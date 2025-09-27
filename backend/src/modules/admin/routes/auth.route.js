import { Router } from "express";
import * as controller from "../controllers/auth.controller.js";
import * as validation from "../validation/auth.validation.js";
import validate from "../../../middlewares/validate.js";
import passport from "passport";

const authRouter = Router();

// Public routes with validation
authRouter.post(
  "/register",
  validate(validation.register),
  controller.register
);
authRouter.post("/login", validate(validation.login), controller.login);

// Protected routes with passport authentication
authRouter.post(
  "/profile",
  passport.authenticate("admin", { session: false }),
  validate(validation.profile),
  controller.profile
);

authRouter.post(
  "/profile/edit",
  passport.authenticate("admin", { session: false }),
  validate(validation.profileEdit),
  controller.profileEdit
);

export default authRouter;
