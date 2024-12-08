import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriberProfile extends Document {
    user_id: Schema.Types.ObjectId;
    full_name: string;
    dob?: Date;
    createdAt: Date;
    updatedAt: Date;
    expiryDate: Date;
    subscription_status: string;
    avatar?: string;
}

const SubscriberProfileSchema: Schema<ISubscriberProfile> = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    full_name: {
        type: String,
        trim: true,
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
    expiryDate: {
        type: Date,
        default: function () {
            return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        },
    },

    subscription_status: {
        type: String,
        enum: ["active", "expired"],
        default: "active",
    },
    avatar: { type: String },
});


const SubscriberProfile = mongoose.model<ISubscriberProfile>("SubscriberProfile", SubscriberProfileSchema);

export default SubscriberProfile;
