import mongoose, { Schema, Document } from "mongoose";

interface IMedia extends Document {
    article_id: mongoose.Types.ObjectId;
    url: string;
    type: "image" | "video";
}

const MediaSchema: Schema<IMedia> = new mongoose.Schema({
    article_id: { type: Schema.Types.ObjectId, ref: "Article", required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true }
});

const Media = mongoose.model<IMedia>("Media", MediaSchema);

export default Media;
