import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
    article_id: mongoose.Types.ObjectId; 
    user_id: mongoose.Types.ObjectId;  
    content: string;
    create_at: Date;
}

const CommentSchema: Schema<IComment> = new mongoose.Schema({
    article_id: { type: Schema.Types.ObjectId, ref: "Article", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    create_at: { type: Date, default: Date.now }
});

const Comment = mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
