import mongoose from "mongoose";
import { config } from "./index.js";


export const connectDB = async () => {
  try {
    console.log();

    await mongoose.connect(config.dbUrl || "");

    console.log(`Connected to Database`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};
