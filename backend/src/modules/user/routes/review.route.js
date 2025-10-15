import { Router } from "express";
import * as controller from "../controllers/review.controller.js";
import * as validation from "../validation/review.validation.js";
import validate from "../../../middlewares/validate.js";
import passport from "passport";

const reviewRouter = Router();

reviewRouter.post(
  "/add",
  passport.authenticate("user", { session: false }),
  validate(validation.add),
  controller.add
);
// List reviews for a specific item
reviewRouter.get("/item/:itemId", controller.listForItem);
reviewRouter.post(
  "/edit",
  passport.authenticate("user", { session: false }),
  validate(validation.edit),
  controller.edit
);

export default reviewRouter;
