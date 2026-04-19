import mongoose from "mongoose";
import { config } from "dotenv"
config();

const connectDB = async () => {
    try {
        console.log("connecting...")
        await mongoose.connect(process.env.DATABASE_URL!)
        console.log("MongoDB connected")
    } catch (error) {
        console.log(error)
    }
}

export default connectDB

