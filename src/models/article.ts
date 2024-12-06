import mongoose, { Schema, Document } from "mongoose";

interface IArticle extends Document {
    title: string;
    summary?: string;
    content: string;
    thumbnail?: string;
    category_id: mongoose.Types.ObjectId; 
    author_id: mongoose.Types.ObjectId; 
    publish_date?: Date;
    status: "draft" | "published" | "archived"; 
    created_at: Date;
    updated_at: Date;
}

const ArticleSchema: Schema<IArticle> = new mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String },
    content: { type: String, required: true },
    thumbnail: { type: String },
    category_id: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    author_id: { type: Schema.Types.ObjectId, ref: "WriterProfile", required: true },
    publish_date: { type: Date },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft", required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Article = mongoose.model<IArticle>("Article", ArticleSchema);

export default Article;
