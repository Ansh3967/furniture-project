import express from "express";
import itemRouter from "./routes/item.route.js";
import mediaRouter from "./routes/media.route.js";

const router = express.Router();

router.use("/item", itemRouter);
router.use("/media", mediaRouter);

export default router;
