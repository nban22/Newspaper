import mongoose, { Schema } from "mongoose"; 

const SubscriptionSchema = new Schema({
    id: Schema.Types.ObjectId,
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true }
});

const Subscription = mongoose.model("Subscription", SubscriptionSchema);
export default Subscription;
