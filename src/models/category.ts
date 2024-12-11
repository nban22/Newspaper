import mongoose, { Schema, Document, Model } from "mongoose";

interface ICategory extends Document {
    name: string;
    parent_id?: mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}

export interface CategoryModel extends Model<ICategory> {
    getCategoryNameById(category_id: mongoose.Types.ObjectId): Promise<ICategory[]>;
}

const CategorySchema: Schema<ICategory> = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    parent_id: { type: Schema.Types.ObjectId, ref: "Category" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

CategorySchema.statics.getCategoryNameById = async function (category_id: mongoose.Types.ObjectId): Promise<void> {
    const category = await this.findById(category_id);
    return category?.name;
};

const Category = mongoose.model<ICategory, CategoryModel>("Category", CategorySchema);

export default Category;
