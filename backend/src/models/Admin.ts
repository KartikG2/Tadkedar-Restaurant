import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>(
    {
        username: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

AdminSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

AdminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const Admin: Model<IAdmin> =
    mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;
