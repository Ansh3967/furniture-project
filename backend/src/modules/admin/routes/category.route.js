import { Router } from "express";
import * as controller from "../controllers/category.controller.js";
import * as validation from "../validation/category.validation.js";
import validate from "../../../middlewares/validate.js";
import passport from "passport";

const categoryRouter = Router();

categoryRouter.post(
  "/list",
  passport.authenticate("admin", { session: false }),
  validate(validation.list),
  controller.list
);
categoryRouter.post(
  "/add",
  passport.authenticate("admin", { session: false }),
  validate(validation.add),
  controller.add
);
categoryRouter.post(
  "/edit",
  passport.authenticate("admin", { session: false }),
  validate(validation.edit),
  controller.edit
);
categoryRouter.post(
  "/remove",
  passport.authenticate("admin", { session: false }),
  validate(validation.remove),
  controller.remove
);

export default categoryRouter;
