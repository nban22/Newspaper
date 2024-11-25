import mongoose, { Schema } from "mongoose"; 
const ArticleSchema = new Schema({
    id: Schema.Types.ObjectId,
    title: { type: String, required: true },
    summary: { type: String },
    content: { type: String, required: true },
    profile_picture: { type: String },
    category_id: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    author_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    publish_date: { type: Date },
    status: { type: String, enum: ["draft", "published", "archived"], default: 'draft', required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Article = mongoose.model("Article", ArticleSchema);
export default Article;
