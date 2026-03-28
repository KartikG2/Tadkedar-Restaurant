import { Router } from 'express';
import Admin from '../models/Admin';
import Category from '../models/Category';
import MenuItem from '../models/MenuItem';

const router = Router();

router.post('/', async (req, res): Promise<any> => {
    try {
        // Create or reset admin
        await Admin.deleteOne({ username: 'admin' });
        await Admin.create({ username: 'admin', password: 'tadkedar2024' });

        const categoryData = [
            { name: 'Rice', slug: 'rice', order: 1 },
            { name: 'Starters', slug: 'starters', order: 2 },
            { name: 'Main Course', slug: 'main-course', order: 3 },
            { name: 'Breads', slug: 'breads', order: 4 },
            { name: 'Beverages', slug: 'beverages', order: 5 },
        ];

        const categories: Record<string, string> = {};
        for (const cat of categoryData) {
            const existing = await Category.findOneAndUpdate(
                { slug: cat.slug },
                cat,
                { upsert: true, new: true }
            );
            categories[cat.slug] = (existing._id as { toString(): string }).toString();
        }

        const menuItems = [
            { name: 'Mushroom Fried Rice', description: 'Aromatic basmati rice wok-tossed with fresh mushrooms and spices', price: 180, halfPrice: 110, quarterPrice: 65, category: categories['rice'], isVeg: true, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80' },
            { name: 'Paneer Butter Masala', description: 'Soft paneer in rich tomato-butter gravy', price: 220, halfPrice: 130, quarterPrice: 80, category: categories['main-course'], isVeg: true, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80' },
            { name: 'Butter Naan', description: 'Soft leavened bread brushed with butter', price: 50, halfPrice: 0, quarterPrice: 0, category: categories['breads'], isVeg: true, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
        ];

        await MenuItem.deleteMany({});
        await MenuItem.insertMany(menuItems);

        return res.json({
            success: true,
            message: 'Database seeded successfully',
            admin: { username: 'admin', password: 'tadkedar2024' },
            itemCount: menuItems.length,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to seed database' });
    }
});

export default router;
