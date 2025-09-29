import { Router } from "express";
import itemRouter from "./item.route.js";
import mediaRouter from "./media.route.js";
import authRouter from "./auth.route.js";
import categoryRouter from "./category.route.js";

const adminRouter = Router();

adminRouter.use("/auth", authRouter);
adminRouter.use("/media", mediaRouter);
adminRouter.use("/item", itemRouter);
adminRouter.use("/category", categoryRouter);

export default adminRouter;
