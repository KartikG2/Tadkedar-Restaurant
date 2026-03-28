import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import menuRoutes from './routes/menuRoutes';
import orderRoutes from './routes/orderRoutes';
import reservationRoutes from './routes/reservationRoutes';
import uploadRoutes from './routes/uploadRoutes';
import seedRoutes from './routes/seedRoutes';

const app = express();

app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Static Serving for Uploads - Mapping /api/uploads to public/uploads
app.use('/api/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Routes
// We mount them exactly as they were expected by the Next.js frontend
app.use('/api/admin', authRoutes); // /api/admin/login and /api/admin/logout
app.use('/api/categories', categoryRoutes); // GET /api/categories, POST /api/categories/admin mapped inside? Wait, the router expects /admin... wait!
app.use('/api/menu', menuRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin/upload', uploadRoutes); // POST /api/admin/upload
app.use('/api/admin/seed', seedRoutes); // POST /api/admin/seed

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export default app;
