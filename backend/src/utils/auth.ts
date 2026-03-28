import { SignJWT, jwtVerify } from 'jose';
import { Request, Response, NextFunction } from 'express';

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

export interface AuthRequest extends Request {
    admin?: JWTPayload;
}

export const authenticateAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.admin_token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Unauthorized: No token provided' });
            return;
        }
        
        const decoded = await verifyToken(token);
        if (!decoded) {
            res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
            return;
        }
        
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};
