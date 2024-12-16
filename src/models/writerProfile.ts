import mongoose, { Schema, Document } from "mongoose";

export interface IWriterProfile extends Document {
    user_id: Schema.Types.ObjectId;
    full_name: string;
    pen_name?: string;
    dob?: Date;
    updatedAt: Date;
    avatar?: string;
}

const WriterProfileSchema: Schema<IWriterProfile> = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    full_name: {
        type: String,
        trim: true,
    },
    pen_name: {
        type: String,
        trim: true,
    },
    dob: {
        type: Date,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    avatar: { type: String },
});

const WriterProfile = mongoose.model<IWriterProfile>("WriterProfile", WriterProfileSchema);

export default WriterProfile;
