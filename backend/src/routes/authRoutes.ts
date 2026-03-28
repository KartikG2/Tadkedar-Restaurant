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
        
        // Return token in response body instead of setting cookie
        return res.json({ success: true, token });
    } catch (error) {
        return res.status(500).json({ error: 'Login failed' });
    }
});

router.post('/logout', (req, res): any => {
    // No cookie clearing needed - just return success
    return res.json({ success: true });
});

export default router;
