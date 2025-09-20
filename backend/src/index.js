import express from "express";
const app = express();
import { config } from "./config/index.js";
import { connectDB } from "./config/db.js";
import router from "./router.js";

app.use("/", router);

app.listen(config.port, () => {
  connectDB();
  console.log(`Server is running ${config.port}`);
});
