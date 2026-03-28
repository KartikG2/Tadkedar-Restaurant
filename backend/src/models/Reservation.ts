import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReservation extends Document {
    name: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    guests: number;
    notes: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
    {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, default: '', trim: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        guests: { type: Number, required: true, min: 1, max: 20 },
        notes: { type: String, default: '', trim: true },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Cancelled'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

const Reservation: Model<IReservation> =
    mongoose.models.Reservation ||
    mongoose.model<IReservation>('Reservation', ReservationSchema);

export default Reservation;
