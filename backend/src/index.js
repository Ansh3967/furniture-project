import express from "express";
const app = express();
import { config } from "./config/index.js";
import { connectDB, syncIndexes } from "./config/db.js";
import router from "./router.js";
import passport from "./services/passport.service.js";

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize passport
app.use(passport.initialize());

app.use("/", router);

app.listen(config.port, async () => {
  await connectDB();
  // await syncIndexes();
  console.log(`Server is running ${config.port}`);
});
