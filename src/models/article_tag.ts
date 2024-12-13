import mongoose, { Schema, Document } from "mongoose";
import {ITag} from "./tag";

interface IArticleTag extends Document {
    article_id: mongoose.Types.ObjectId; 
    tag_id: ITag | mongoose.Types.ObjectId;     
}

const ArticleTagSchema: Schema<IArticleTag> = new mongoose.Schema({
    article_id: { type: Schema.Types.ObjectId, ref: "Article", required: true },
    tag_id: { type: Schema.Types.ObjectId, ref: "Tag", required: true }
});

const ArticleTag = mongoose.model<IArticleTag>("ArticleTag", ArticleTagSchema);

export default ArticleTag;
