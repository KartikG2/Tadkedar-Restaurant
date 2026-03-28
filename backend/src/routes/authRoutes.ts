import { Router } from 'express';
import Admin from '../models/Admin';
import { signToken } from '../utils/auth';

const router = Router();

router.post('/login', async (req, res): Promise<any> => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        
        const admin = await Admin.findOne({ username: username.toLowerCase().trim() });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = await signToken({
            adminId: (admin._id as { toString(): string }).toString(),
            username: admin.username,
        });
        
        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days in ms
            path: '/',
        });
        
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: 'Login failed' });
    }
});

router.post('/logout', (req, res): any => {
    res.cookie('admin_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    });
    return res.json({ success: true });
});

export default router;
