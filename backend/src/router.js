import express from "express";
import adminRouter from "./modules/admin/routes/index.route.js";

const router = express.Router();

router.use("/admin",adminRouter);

export default router;
