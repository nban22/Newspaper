import mongoose, { Schema, Document, Model } from "mongoose";


interface IArticle extends Document {
    title: string;
    summary?: string;
    content: string;
    thumbnail?: string;
    category_id: mongoose.Types.ObjectId; 
    author_id: mongoose.Types.ObjectId; 
    publish_date?: Date;
    view_count: number;
    status: "draft" | "published" | "archived"; 
    created_at: Date;
    updated_at: Date;
}

// Interface for Article Model (includes static methods)
export interface ArticleModel extends Model<IArticle> {
    getFeaturedArticles(): Promise<IArticle[]>;
}

const ArticleSchema: Schema<IArticle> = new mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String },
    content: { type: String, required: true },
    thumbnail: { type: String },
    category_id: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    author_id: { type: Schema.Types.ObjectId, ref: "WriterProfile", required: true },
    publish_date: { type: Date },
    view_count: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft", required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

ArticleSchema.statics.incrementViewCount = async function (articleId: mongoose.Types.ObjectId): Promise<void> {
    await this.findByIdAndUpdate(articleId, { $inc: { view_count: 1 } });
};

ArticleSchema.statics.getFeaturedArticles = async function (): Promise<IArticle[]> {
    return this.find({ status: "published" }) // Only fetch published articles
        .sort({ view_count: -1 })            // Sort by view_count in descending order
        .limit(4)                            // Limit to 4 articles
        .select("title publish_date thumbnail view_count summary"); // Select specific fields if needed
};


const Article = mongoose.model<IArticle, ArticleModel>("Article", ArticleSchema);

export default Article;
