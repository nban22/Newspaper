import mongoose, { Schema } from "mongoose"; 

const CommentSchema = new Schema({
    id: Schema.Types.ObjectId,
    article_id: { type: Schema.Types.ObjectId, ref: "Article", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    create_at: { type: Date, default: Date.now }
});

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
