import mongoose, { Schema, Document } from "mongoose";

export interface IEditorProfile extends Document {
    user_id: Schema.Types.ObjectId;
    full_name: string;
    dob?: Date;
    createdAt: Date;
    updatedAt: Date;
    avatar?: string;
}

const EditorProfileSchema: Schema<IEditorProfile> = new mongoose.Schema({
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
    avatar: { type: String },
});


const EditorProfile = mongoose.model<IEditorProfile>("EditorProfile", EditorProfileSchema);

export default EditorProfile;
