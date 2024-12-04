import mongoose, { Schema, Document } from "mongoose";

interface ICategory extends Document {
    name: string;
    parent_id?: mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}

const CategorySchema: Schema<ICategory> = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    parent_id: { type: Schema.Types.ObjectId, ref: "Category" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Category = mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
