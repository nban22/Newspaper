import mongoose, { Schema, Document } from "mongoose";

interface ITag extends Document {
    name: string;
    created_at: Date;
    updated_at: Date;
}

const TagSchema: Schema<ITag> = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Tag = mongoose.model<ITag>("Tag", TagSchema);

export default Tag;
