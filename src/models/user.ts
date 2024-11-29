import mongoose, { Schema } from "mongoose"; 


const UserSchema = new mongoose.Schema({
    id: Schema.Types.ObjectId,
    full_name: {
        type: String,
        required: true,
    },
    pen_name: {
        type: String,
        required: true,
        unique: true,
    },
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
        enum: ["user", "admin"],
        default: "user",
    },
    dob: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    subscription_end: { type: Date },
    avatar: { type: String }
});

const User = mongoose.model("User", UserSchema);

export default User;