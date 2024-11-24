import mongoose, { Schema } from "mongoose"; 

const CategorySchema = new Schema({
    id: Schema.Types.ObjectId,
    name: { type: String, required: true, unique: true },
    parent_id: { type: Schema.Types.ObjectId, ref: "Category" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Category = mongoose.model("Category", CategorySchema);
export default Category;
