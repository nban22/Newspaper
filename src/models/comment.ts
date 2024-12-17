import mongoose, { Schema, Document, Model } from "mongoose";

interface IComment extends Document {
    article_id: mongoose.Types.ObjectId;
    user_id?: mongoose.Types.ObjectId;
    content: string;
    create_at: Date;
}
// Define the custom static methods interface
interface ICommentModel extends Model<IComment> {
    createComment(comment: Partial<IComment>): Promise<IComment>;
    updateCommentById(commentId: mongoose.Types.ObjectId, comment: Partial<IComment>): Promise<IComment | null>;
    deleteCommentById(commentId: mongoose.Types.ObjectId): Promise<IComment | null>;
}

const CommentSchema: Schema<IComment> = new Schema({
    article_id: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    content: { type: String, required: true },
    create_at: { type: Date, default: Date.now },
});

// Implement custom static methods
CommentSchema.statics.createComment = async function (comment: Partial<IComment>): Promise<IComment> {
    return this.create(comment);
};

CommentSchema.statics.updateCommentById = async function (
    commentId: mongoose.Types.ObjectId,
    comment: Partial<IComment>
): Promise<IComment | null> {
    return this.findByIdAndUpdate(commentId, comment, { new: true }).exec();
};

CommentSchema.statics.deleteCommentById = async function (
    commentId: mongoose.Types.ObjectId
): Promise<IComment | null> {
    return this.findByIdAndDelete(commentId).exec();
};

// Cast schema to the model interface
const Comment = mongoose.model<IComment, ICommentModel>("Comment", CommentSchema);

export default Comment;
