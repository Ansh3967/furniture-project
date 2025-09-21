import dotenv from "dotenv";
dotenv.config({ path: './config.env' });
import express from "express";
const app = express();
import { config } from "./config/index.js";
import { connectDB } from "./config/db.js";
import router from "./router.js";

app.use("/", router);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(config.port, async () => {
  await connectDB();
  console.log(`Server is running ${config.port}`);
});
