import dotenv from "dotenv";
dotenv.config({ path: './config.env' });

dotenv.config();

export const config = {
  port: process.env.PORT,
  dbUrl: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
};
