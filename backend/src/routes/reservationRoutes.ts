import { Router } from 'express';
import Reservation from '../models/Reservation';
import { sendReservationConfirmation } from '../utils/email';
import { authenticateAdmin } from '../utils/auth';

const router = Router();

// Public: POST /api/reservations
router.post('/', async (req, res): Promise<any> => {
    try {
        const { name, phone, email, date, time, guests, notes } = req.body;

        if (!name || !phone || !date || !time || !guests) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const reservation = await Reservation.create({
            name: name.trim(),
            phone: phone.trim(),
            email: email?.trim() || '',
            date,
            time,
            guests,
            notes: notes?.trim() || '',
        });

        try {
            sendReservationConfirmation({
                name,
                email: email?.trim() || '',
                phone,
                date,
                time,
                guests,
                notes: notes?.trim(),
            }).catch((err) => console.error('Reservation email error:', err));
        } catch (err) {
            console.error('Sync reservation email error:', err);
        }
        return res.status(201).json({ success: true, reservationId: reservation._id });
    } catch {
        return res.status(500).json({ error: 'Failed to create reservation' });
    }
});

// Admin: GET /api/reservations
router.get('/', authenticateAdmin, async (req, res): Promise<any> => {
    try {
        const reservations = await Reservation.find({}).sort({ createdAt: -1 }).lean();
        return res.json(reservations);
    } catch {
        return res.status(500).json({ error: 'Failed to fetch reservations' });
    }
});

// Admin: PATCH /api/reservations/:id
router.patch('/:id', authenticateAdmin, async (req, res): Promise<any> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Confirmed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const reservation = await Reservation.findByIdAndUpdate(id, { status }, { new: true });
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        return res.json(reservation);
    } catch {
        return res.status(500).json({ error: 'Failed to update reservation' });
    }
});

export default router;
