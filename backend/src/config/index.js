import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  dbUrl: process.env.MONGO_URI || "mongodb://localhost:27017/furniture-store",
  jwtSecret:
    process.env.JWT_SECRET ||
    "your-super-secret-jwt-key-change-this-in-production",
};
