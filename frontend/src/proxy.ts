import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Note: Token-based auth is now handled client-side in useEffect hooks
    // No longer using middleware for auth since tokens are in localStorage
    // Middleware cannot access localStorage, so client-side protection is used instead

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
