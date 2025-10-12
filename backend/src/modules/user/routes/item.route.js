import { Router } from "express";
import * as controller from "../controllers/item.controller.js";
import * as validation from "../validation/item.validation.js";
import validate from "../../../middlewares/validate.js";
import { authenticateUser } from "../../../middlewares/auth.js";

const itemRouter = Router();

// Public routes (no authentication required for browsing)
itemRouter.get("/", validate(validation.list), controller.list);
itemRouter.get("/:id", validate(validation.get), controller.get);

// Protected routes (authentication required for user actions)
itemRouter.post(
  "/",
  authenticateUser,
  validate(validation.add),
  controller.add
);
itemRouter.put(
  "/:id",
  authenticateUser,
  validate(validation.edit),
  controller.edit
);
itemRouter.delete(
  "/:id",
  authenticateUser,
  validate(validation.remove),
  controller.remove
);

export default itemRouter;
