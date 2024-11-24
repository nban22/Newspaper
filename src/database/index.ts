import mongoose from 'mongoose';
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in environment variables.');
}

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};
