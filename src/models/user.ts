import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    email: string;
    password?: string;
    role: "writer" | "editor" | "subscriber" | "admin";
    createdAt: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["writer", "editor", "subscriber", "admin"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre<IUser>('save', async function(next) {
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 12);
    }

    next();
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
