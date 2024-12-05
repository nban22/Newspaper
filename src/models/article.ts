import mongoose, { Schema, Document } from "mongoose";

interface IArticle extends Document {
    title: string;
    level: string;
    summary?: string;
    content: string;
    profile_picture?: string;
    category_id: mongoose.Types.ObjectId; 
    author_id: mongoose.Types.ObjectId; 
    publish_date?: Date;
    status: "draft" | "published" | "archived"; 
    created_at: Date;
    updated_at: Date;
}

const ArticleSchema: Schema<IArticle> = new mongoose.Schema({
    title: { type: String, required: true },
    level: { type: String, required: true , enum: ["premium", "free"]},
    summary: { type: String },
    content: { type: String, required: true },
    profile_picture: { type: String },
    category_id: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    author_id: { type: Schema.Types.ObjectId, ref: "WriterProfile", required: true },
    publish_date: { type: Date },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft", required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Article = mongoose.model<IArticle>("Article", ArticleSchema);

export default Article;
