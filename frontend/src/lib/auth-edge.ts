import { jwtVerify } from 'jose';

export interface JWTPayload {
    adminId: string;
    username: string;
}

function getSecret() {
    return new TextEncoder().encode(
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-2024'
    );
}

export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
    try {
        const secret = getSecret();
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as JWTPayload;
    } catch (error) {
        console.error('[Middleware] JWT verification failed:', error);
        return null;
    }
}
