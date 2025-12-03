import express from "express";
import cors from "cors";
const app = express();
import { config } from "./config/index.js";
import { connectDB, syncIndexes } from "./config/db.js";
import router from "./router.js";
import passport from "./services/passport.service.js";

// // --- ADD THIS LINE HERE ---
// // This disables the ETag generation, forcing a 200 OK response every time.
// app.set('etag', false); 
// // --------------------------

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:3000"], 
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

// --- OPTIONAL: ADD CACHE CONTROL HEADERS ---
// You can also explicitly tell browsers not to cache
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});
// -------------------------------------------

app.use("/", router);

app.listen(config.port, async () => {
  await connectDB();
  console.log(`Server is running on port ${config.port}`);
});