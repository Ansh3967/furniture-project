import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.MONGO_URI || "mongodb://localhost:27017/furniture_db",
  jwtSecret: process.env.JWT_SECRET,
};
