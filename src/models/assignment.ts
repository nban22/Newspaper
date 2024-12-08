import mongoose, { Schema, Document } from "mongoose";

interface IAssignment extends Document {
    editor_id: mongoose.Types.ObjectId; 
    category_id: mongoose.Types.ObjectId; 
}

const AssignmentSchema: Schema<IAssignment> = new mongoose.Schema({
    editor_id: { type: Schema.Types.ObjectId, ref: "EditorProfile", required: true },
    category_id: { type: Schema.Types.ObjectId, ref: "Category", required: true }
});

const Assignment = mongoose.model<IAssignment>("Assignment", AssignmentSchema);

export default Assignment;
