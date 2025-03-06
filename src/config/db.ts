import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("MongoDB Connected succesfully");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        throw error;
    }
};

export default connectDB;
