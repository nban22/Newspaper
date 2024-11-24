import mongoose, { Schema } from "mongoose"; 

const MediaSchema = new Schema({
    id: Schema.Types.ObjectId,
    article_id: { type: Schema.Types.ObjectId, ref: "Article", required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true }
});

const Media = mongoose.model("Media", MediaSchema);
export default Media;
