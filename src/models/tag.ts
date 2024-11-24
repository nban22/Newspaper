import mongoose, { Schema } from "mongoose"; 

const TagSchema = new Schema({
    id: {type: Schema.Types.ObjectId},
    name: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Tag = mongoose.model("Tag", TagSchema);
export default Tag;
