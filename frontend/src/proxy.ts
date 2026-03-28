import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenEdge } from '@/lib/auth-edge';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect admin routes (except login)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        const payload = await verifyTokenEdge(token);
        if (!payload) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Protect admin API routes
    if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login') && !pathname.startsWith('/api/admin/seed')) {
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyTokenEdge(token);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
