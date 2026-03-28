import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Category: Model<ICategory> =
    mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
