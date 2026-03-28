import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export interface JWTPayload {
    adminId: string;
    username: string;
}

function getSecret() {
    return new TextEncoder().encode(
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-2024'
    );
}

export async function signToken(payload: JWTPayload): Promise<string> {
    const secret = getSecret();
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const secret = getSecret();
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as JWTPayload;
    } catch {
        return null;
    }
}

export async function getAdminFromCookies(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return null;
    return verifyToken(token);
}

export async function isAuthenticated(): Promise<boolean> {
    const admin = await getAdminFromCookies();
    return admin !== null;
}
