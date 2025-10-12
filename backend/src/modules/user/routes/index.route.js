import { Router } from "express";
import itemRouter from "./item.route.js";
import mediaRouter from "./media.route.js";
import authRouter from "./auth.route.js";
import reviewRouter from "./review.route.js";
import categoryRouter from "./category.route.js";

const userRouter = Router();

userRouter.use("/auth", authRouter);
userRouter.use("/item", itemRouter);
userRouter.use("/media", mediaRouter);
userRouter.use("/review", reviewRouter);
userRouter.use("/category", categoryRouter);

export default userRouter;
