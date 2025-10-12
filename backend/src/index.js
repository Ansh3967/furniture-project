import express from "express";
import cors from "cors";
const app = express();
import { config } from "./config/index.js";
import { connectDB, syncIndexes } from "./config/db.js";
import router from "./router.js";
import passport from "./services/passport.service.js";

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:3000"], // Frontend URLs
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize passport
app.use(passport.initialize());

app.use("/", router);

const PORT = config.port || 5000;

app.listen(PORT, async () => {
  await connectDB();
  // await syncIndexes();
  console.log(`Server is running on port ${PORT}`);
});
