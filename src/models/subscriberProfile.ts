import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriberProfile extends Document {
    user_id: Schema.Types.ObjectId;
    full_name: string;
    dob?: Date;
    createdAt: Date;
    updatedAt: Date;
    subscription_end?: Date;
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
    subscription_end: { type: Date },
    avatar: { type: String },
});


const SubscriberProfile = mongoose.model<ISubscriberProfile>("SubscriberProfile", SubscriberProfileSchema);

export default SubscriberProfile;
