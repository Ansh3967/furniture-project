import { Router } from "express";
import itemRouter from "./item.route.js";
import mediaRouter from "./media.route.js";
import authRouter from "./auth.route.js";
import categoryRouter from "./category.route.js";
import orderRouter from "./order.route.js";
import { authenticateAdmin } from "../../../middlewares/auth.js";

const adminRouter = Router();

// Public auth routes (no authentication required)
adminRouter.use("/auth", authRouter);

// Protected admin routes (authentication required)
adminRouter.use("/media", authenticateAdmin, mediaRouter);
adminRouter.use("/items", authenticateAdmin, itemRouter);
adminRouter.use("/categories", authenticateAdmin, categoryRouter);
adminRouter.use("/orders", authenticateAdmin, orderRouter);

export default adminRouter;
