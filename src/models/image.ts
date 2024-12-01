import mongoose, { Schema, Document } from "mongoose";

interface IImage extends Document {
    original_name: string;
    data: Buffer;
    type: string;
}

const ImageSchema: Schema<IImage> = new mongoose.Schema({
    original_name: { type: String, required: true },
    data: { type: Buffer, required: true },
    type: { type: String, required: true }
});

const Image = mongoose.model<IImage>("Image", ImageSchema);

export default Image;
