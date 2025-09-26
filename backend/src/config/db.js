import mongoose from "mongoose";
import { config } from "./index.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.dbUrl || "");
    console.log("✅ Connected to Database");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export const syncIndexes = async () => {
  try {
    const models = mongoose.models;
    for (const modelName of Object.keys(models)) {
      await models[modelName].syncIndexes();
      console.log(`🔄 Indexes synced for: ${modelName}`);
    }
  } catch (error) {
    console.error("⚠️ Failed to sync indexes:", error.message);
  }
};
