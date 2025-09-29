import express from "express";
import adminRouter from "./modules/admin/routes/index.route.js";
import userRouter from "./modules/user/routes/index.route.js";

const router = express.Router();

router.use("/admin", adminRouter);
router.use("/user", userRouter);

export default router;
