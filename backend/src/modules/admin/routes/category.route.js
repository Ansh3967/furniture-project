import { Router } from "express";
import * as controller from "../controllers/category.controller.js";
import * as validation from "../validation/category.validation.js";
import validate from "../../../middlewares/validate.js";
import { authenticateAdmin } from "../../../middlewares/auth.js";

const categoryRouter = Router();

// Get all categories (protected - admin only)
categoryRouter.get("/", authenticateAdmin, controller.list);

// Get category by ID (protected - admin only)
categoryRouter.get(
  "/:id",
  authenticateAdmin,
  validate(validation.get),
  controller.get
);

// Create new category (protected - admin only)
categoryRouter.post(
  "/",
  authenticateAdmin,
  validate(validation.add),
  controller.add
);

// Update category (protected - admin only)
categoryRouter.put(
  "/:id",
  authenticateAdmin,
  validate(validation.edit),
  controller.edit
);

// Delete category (protected - admin only)
categoryRouter.delete(
  "/:id",
  authenticateAdmin,
  validate(validation.remove),
  controller.remove
);

export default categoryRouter;
