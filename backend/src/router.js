import express from "express";
import itemRouter from "./routes/item.route.js";

const router = express.Router();

router.use("/item", itemRouter);

export default router;
