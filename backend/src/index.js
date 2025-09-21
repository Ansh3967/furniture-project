import express, { urlencoded } from "express";
const app = express();
import { config } from "./config/index.js";
import { connectDB } from "./config/db.js";
import router from "./router.js";

app.use("/", router);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(config.port, () => {
  connectDB();
  console.log(`Server is running ${config.port}`);
});
