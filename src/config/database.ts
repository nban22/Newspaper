import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const mongooseConnection = async () => {
    if (!process.env.MONGODB_URI) {
        console.error("FATAL ERROR: MONGODB_URI in .env file is not defined.");
        process.exit(1);
    }
    
    const MONGODB_URI = process.env.MONGODB_URI!.replace(
        "<MONGODB_USERNAME>",
        process.env.MONGODB_USERNAME!
    ).replace("<MONGODB_PASSWORD>", process.env.MONGODB_PASSWORD!);
    
    mongoose.connect(MONGODB_URI).then(() => console.log("Connected to MongoDB..."));
}

export default mongooseConnection;