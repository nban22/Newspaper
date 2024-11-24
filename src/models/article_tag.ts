import mongoose, { Schema } from "mongoose"; 

const ArticleTagSchema = new Schema({
    id: Schema.Types.ObjectId,
    article_id: { type: Schema.Types.ObjectId, ref: "Article", required: true },
    tag_id: { type: Schema.Types.ObjectId, ref: "Tag", required: true }
});

const ArticleTag = mongoose.model("ArticleTag", ArticleTagSchema);
export default ArticleTag;
