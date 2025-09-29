import { Router } from "express";
import * as controller from "../controllers/item.controller.js";
import * as validation from "../validation/item.validation.js";
import validate from "../../../middlewares/validate.js";
import passport from "passport";

const itemRouter = Router();

itemRouter.post(
  "/list",
  passport.authenticate("user", { session: false }),
  validate(validation.list),
  controller.list
);
itemRouter.post(
  "/get",
  passport.authenticate("user", { session: false }),
  validate(validation.get),
  controller.get
);
itemRouter.post(
  "/add",
  passport.authenticate("user", { session: false }),
  validate(validation.add),
  controller.add
);
itemRouter.post(
  "/edit",
  passport.authenticate("user", { session: false }),
  validate(validation.edit),
  controller.edit
);
itemRouter.post(
  "/remove",
  passport.authenticate("user", { session: false }),
  validate(validation.remove),
  controller.remove
);

export default itemRouter;
