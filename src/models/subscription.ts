import mongoose, { Schema, Document } from "mongoose";

interface ISubscription extends Document {
    subscriber_id: mongoose.Types.ObjectId; 
    start_date: Date;
    end_date: Date;
}

const SubscriptionSchema: Schema<ISubscription> = new mongoose.Schema({
    subscriber_id: { type: Schema.Types.ObjectId, ref: "SubscriberProfile", required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true }
});

const Subscription = mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

export default Subscription;
