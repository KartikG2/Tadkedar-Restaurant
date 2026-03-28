import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateAdmin } from '../utils/auth';
import { promises as fs } from 'fs';

const router = Router();

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure the directory exists when router loads (or we can just let multer recreate it)
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop() || 'jpg';
        const timestamp = Date.now();
        const safeName = file.originalname
            .replace(/\.[^/.]+$/, '')
            .replace(/[^a-zA-Z0-9]/g, '-')
            .toLowerCase()
            .slice(0, 30);
        cb(null, `${safeName}-${timestamp}.${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.mimetype)) {
            return cb(null, false);
        }
        cb(null, true);
    }
});

router.post('/', authenticateAdmin, upload.single('image'), (req, res): any => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image provided or invalid type' });
        }

        const imageUrl = `/api/uploads/${req.file.filename}`;
        return res.status(201).json({ success: true, url: imageUrl });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to upload image' });
    }
});

export default router;
