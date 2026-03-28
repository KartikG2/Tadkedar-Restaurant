import { Router } from 'express';
import Order from '../models/Order';
import { sendOrderConfirmation, sendEReceipt } from '../utils/email';
import { authenticateAdmin } from '../utils/auth';

const router = Router();

function generateOrderNumber() {
    const date = new Date();
    const prefix = 'TK';
    const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const timePart = `${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${datePart}${timePart}${random}`;
}

// Public: POST /api/orders
router.post('/', async (req, res): Promise<any> => {
    try {
        const { items, customerName, phone, email, address, notes, total, orderType, tableNumber } = req.body;

        if (!items || !items.length || !customerName || !phone || total === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const orderNumber = generateOrderNumber();

        const order = await Order.create({
            orderNumber,
            items: items.map((item: any) => ({
                menuItemId: item.menuItemId || 'unknown',
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                portion: item.portion || 'Full',
                image: item.image || '',
            })),
            customerName: customerName.trim(),
            phone: phone.trim(),
            email: email?.trim() || '',
            address: address?.trim() || '',
            notes: notes?.trim() || '',
            total,
            orderType: orderType || 'Dine-in',
            tableNumber: tableNumber?.trim() || '',
        });

        try {
            sendOrderConfirmation({
                orderNumber,
                customerName: customerName.trim(),
                email: email?.trim() || '',
                phone: phone.trim(),
                items,
                total,
                orderType: orderType || 'Dine-in',
                address: address?.trim(),
                tableNumber: tableNumber?.trim(),
            }).catch((err) => console.error('Background email error:', err));
        } catch (err) {
            console.error('Sync email error:', err);
        }

        return res.status(201).json({ success: true, orderId: order._id, orderNumber });
    } catch (error: any) {
        return res.status(500).json({ error: error.message || 'Failed to create order' });
    }
});

// Admin: GET /api/orders
router.get('/', authenticateAdmin, async (req, res): Promise<any> => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
        return res.json(orders);
    } catch {
        return res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Admin: PATCH /api/orders/:id
router.patch('/:id', authenticateAdmin, async (req, res): Promise<any> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const currentOrder = await Order.findById(id);
        if (!currentOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (currentOrder.status === 'Completed') return res.status(400).json({ error: 'Completed orders cannot be modified' });
        if (currentOrder.status === 'Cancelled') return res.status(400).json({ error: 'Cancelled orders cannot be modified' });

        const statusOrder: Record<string, number> = {
            'Pending': 0, 'Confirmed': 1, 'Preparing': 2, 'Completed': 3, 'Cancelled': 3,
        };

        const currentLevel = statusOrder[currentOrder.status as string] ?? 0;
        const targetLevel = statusOrder[status] ?? 0;

        if (targetLevel < currentLevel && status !== 'Cancelled') {
            return res.status(400).json({ error: `Cannot change from ${currentOrder.status} back to ${status}` });
        }

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

        if (status === 'Completed' && order && order.email) {
            sendEReceipt({
                orderNumber: order.orderNumber,
                customerName: order.customerName,
                email: order.email as string,
                phone: order.phone,
                items: order.items.map((item: any) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    portion: item.portion || 'Full',
                })),
                total: order.total,
                orderType: order.orderType,
            }).catch((err) => console.error('E-Receipt email error:', err));
        }

        return res.json(order);
    } catch {
        return res.status(500).json({ error: 'Failed to update order' });
    }
});

export default router;
