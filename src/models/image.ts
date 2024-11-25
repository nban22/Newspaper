import mongoose, { Schema } from "mongoose"; 

const ImageSchema = new Schema({
    id: Schema.Types.ObjectId,
    original_name: { type: String, required: true },
    data: { type: Buffer, required: true },
    type: { type: String, required: true }
});

const Image = mongoose.model("Image", ImageSchema);
export default Image;
