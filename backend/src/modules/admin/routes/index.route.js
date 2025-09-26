import { Router } from "express";
import itemRouter from "./item.route.js";
import mediaRouter from "./media.route.js";
import authRouter from "./auth.route.js";

const adminRouter = Router();

adminRouter.use("/auth", authRouter);
adminRouter.use("/item", itemRouter);
adminRouter.use("/media", mediaRouter);

export default adminRouter;
