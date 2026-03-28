import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IMenuItem extends Document {
    name: string;
    description: string;
    price: number;
    halfPrice: number;
    quarterPrice: number;
    category: Types.ObjectId;
    isAvailable: boolean;
    isVeg: boolean;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, default: '', trim: true },
        price: { type: Number, required: true, min: 0 },
        halfPrice: { type: Number, default: 0, min: 0 },
        quarterPrice: { type: Number, default: 0, min: 0 },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        isAvailable: { type: Boolean, default: true },
        isVeg: { type: Boolean, default: true },
        image: { type: String, default: '' },
    },
    { timestamps: true }
);

// Force recompile: delete cached model if schema has changed
if (mongoose.models.MenuItem) {
    delete mongoose.models.MenuItem;
}

const MenuItem: Model<IMenuItem> = mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);

export default MenuItem;
