import { Router } from "express";
import * as controller from "../controllers/auth.controller.js";
import * as validation from "../validation/auth.validation.js";
import validate from "../../../middlewares/validate.js";
import { authenticateUser } from "../../../middlewares/auth.js";

const authRouter = Router();

// Public routes with validation
authRouter.post(
  "/register",
  validate(validation.register),
  controller.register
);
authRouter.post("/login", validate(validation.login), controller.login);

// Protected routes with user authentication
authRouter.get("/profile", authenticateUser, controller.profile);

authRouter.put(
  "/profile",
  authenticateUser,
  validate(validation.profileEdit),
  controller.profileEdit
);

export default authRouter;
