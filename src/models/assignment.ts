import mongoose, { Schema } from "mongoose"; 

const AssignmentSchema = new Schema({
    id: Schema.Types.ObjectId,
    editor_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category_id: { type: Schema.Types.ObjectId, ref: "Category", required: true }
});

const Assignment = mongoose.model("Assignment", AssignmentSchema);
export default Assignment;
