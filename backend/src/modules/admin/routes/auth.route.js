import { Router } from "express";
import * as controller from "../controllers/auth.controller.js";
import * as validation from "../validation/auth.validation.js";
import validate from "../../../middlewares/validate.js";
import { authenticateAdmin } from "../../../middlewares/auth.js";

const authRouter = Router();

// Public routes with validation
authRouter.post(
  "/register",
  validate(validation.register),
  controller.register
);
authRouter.post("/login", validate(validation.login), controller.login);

// Protected routes with admin authentication
authRouter.get("/profile", authenticateAdmin, controller.profile);

authRouter.put(
  "/profile",
  authenticateAdmin,
  validate(validation.profileEdit),
  controller.profileEdit
);

export default authRouter;
