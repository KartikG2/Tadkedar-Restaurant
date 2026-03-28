import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    portion: 'Full' | 'Half' | 'Quarter';
    image?: string;
}

export interface IOrder extends Document {
    orderNumber: string;
    items: IOrderItem[];
    customerName: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
    total: number;
    orderType: 'Dine-in' | 'Takeaway' | 'Delivery';
    tableNumber: string;
    status: 'Pending' | 'Confirmed' | 'Preparing' | 'Completed' | 'Cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
    {
        menuItemId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        portion: { type: String, enum: ['Full', 'Half', 'Quarter'], default: 'Full' },
        image: { type: String, default: '' },
    },
    { _id: false }
);

const OrderSchema = new Schema<IOrder>(
    {
        orderNumber: { type: String, default: '' },
        items: { type: [OrderItemSchema], required: true },
        customerName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, default: '', trim: true },
        address: { type: String, default: '', trim: true },
        notes: { type: String, default: '', trim: true },
        total: { type: Number, required: true, min: 0 },
        orderType: {
            type: String,
            enum: ['Dine-in', 'Takeaway', 'Delivery'],
            default: 'Dine-in',
        },
        tableNumber: { type: String, default: '' },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Preparing', 'Completed', 'Cancelled'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
