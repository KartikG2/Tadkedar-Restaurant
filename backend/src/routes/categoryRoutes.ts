import { Router } from 'express';
import Category from '../models/Category';
import { authenticateAdmin } from '../utils/auth';

const router = Router();

// Public: GET /api/categories
router.get('/', async (req, res): Promise<any> => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ order: 1 }).lean();
        return res.json(categories);
    } catch {
        return res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Admin routes for categories (mounted at /api/admin/categories in app.ts)
router.post('/admin', authenticateAdmin, async (req, res): Promise<any> => {
    try {
        const category = await Category.create(req.body);
        return res.status(201).json(category);
    } catch {
        return res.status(500).json({ error: 'Failed to create category' });
    }
});

router.put('/admin', authenticateAdmin, async (req, res): Promise<any> => {
    try {
        const { _id, ...updateData } = req.body;
        if (!_id) return res.status(400).json({ error: 'Category ID required' });
        
        const category = await Category.findByIdAndUpdate(_id, updateData, { new: true });
        if (!category) return res.status(404).json({ error: 'Category not found' });
        
        return res.json(category);
    } catch {
        return res.status(500).json({ error: 'Failed to update category' });
    }
});

router.delete('/admin', authenticateAdmin, async (req, res): Promise<any> => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: 'Category ID required' });
        
        await Category.findByIdAndDelete(id);
        return res.json({ success: true });
    } catch {
        return res.status(500).json({ error: 'Failed to delete category' });
    }
});

export default router;
