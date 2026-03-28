import { Router } from 'express';
import MenuItem from '../models/MenuItem';
import Category from '../models/Category';
import { authenticateAdmin } from '../utils/auth';

const router = Router();

// Public: GET /api/menu
router.get('/', async (req, res): Promise<any> => {
    try {
        const items = await MenuItem.find({}).populate('category').sort({ createdAt: -1 }).lean();
        const normalizedItems = items.map((item: any) => ({
            ...item,
            halfPrice: item.halfPrice ?? 0,
            quarterPrice: item.quarterPrice ?? 0,
            image: item.image ?? '',
        }));
        return res.json(normalizedItems);
    } catch {
        return res.status(500).json({ error: 'Failed to fetch menu items' });
    }
});

// Admin: GET /api/admin/menu
router.get('/admin', authenticateAdmin, async (req, res): Promise<any> => {
    try {
        const items = await MenuItem.find({}).populate('category').sort({ createdAt: -1 }).lean();
        const categories = await Category.find({}).sort({ order: 1 }).lean();
        return res.json({ items, categories });
    } catch {
        return res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Admin: POST /api/admin/menu
router.post('/admin', authenticateAdmin, async (req, res): Promise<any> => {
    try {
        const item = await MenuItem.create(req.body);
        return res.status(201).json(item);
    } catch {
        return res.status(500).json({ error: 'Failed to create menu item' });
    }
});

// Admin: PUT /api/admin/menu
router.put('/admin', authenticateAdmin, async (req, res): Promise<any> => {
    try {
        const { _id, ...updateData } = req.body;
        if (!_id) return res.status(400).json({ error: 'Item ID required' });
        
        const item = await MenuItem.findByIdAndUpdate(_id, updateData, { new: true });
        if (!item) return res.status(404).json({ error: 'Item not found' });
        
        return res.json(item);
    } catch {
        return res.status(500).json({ error: 'Failed to update menu item' });
    }
});

// Admin: DELETE /api/admin/menu
router.delete('/admin', authenticateAdmin, async (req, res): Promise<any> => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: 'Item ID required' });
        
        await MenuItem.findByIdAndDelete(id);
        return res.json({ success: true });
    } catch {
        return res.status(500).json({ error: 'Failed to delete menu item' });
    }
});

export default router;
