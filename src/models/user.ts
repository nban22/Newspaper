import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import crypto from 'crypto';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    password?: string;
    email?: string;
    googleId?: string;
    facebookId?: string;
    loginMethod?: "local" | "google" | "facebook";
    name?: string;
    role: "writer" | "editor" | "subscriber" | "admin";
    createdAt: Date;
    active?: boolean;
    passwordResetCode?: string;
    passwordResetToken?: string;
    passwordResetExpires?: number;
    getPasswordResetCode: () => string;
    createPasswordResetToken: () => string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    email: {
        type: String,
        // required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    googleId: {
        type: String,
    },
    facebookId: {
        type: String,
    },
    loginMethod: {
        type: String,
        enum: ["local", "google", "facebook"],
        required: true,
    },
    name: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: ["writer", "editor", "subscriber", "admin"],
    },
    passwordResetCode: {
        type: String,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
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

UserSchema.methods.getPasswordResetCode = function() {
    console.log("this.passwordResetCode", this.passwordResetCode);  
    
    if (this.passwordResetCode) {
        return this.passwordResetCode;
    }
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    this.passwordResetCode = resetCode;
    this.save();
    setTimeout(() => {        
        this.passwordResetCode = undefined;
        this.save();
    }, +process.env.PASSWORD_RESET_CODE_EXPIRES_IN! || 10 * 60 * 1000); // 10 minutes for default

    return resetCode;
}

UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};



const User = mongoose.model<IUser>("User", UserSchema);

export default User;
