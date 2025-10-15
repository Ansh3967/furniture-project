import { Router } from "express";
import * as controller from "../controllers/item.controller.js";
import * as validation from "../validation/item.validation.js";
import validate from "../../../middlewares/validate.js";
import multerService from "../../../services/multerService.js";

const itemRouter = Router();

// Get all items with filtering and pagination
itemRouter.get("/", validate(validation.list), controller.list);

// Get item statistics
itemRouter.get("/stats", controller.getStats);

// Get single item by ID
itemRouter.get("/:id", validate(validation.get), controller.get);

// Create new item
itemRouter.post("/", multerService.array('images', 5), validate(validation.add), controller.add);

// Update item
itemRouter.put("/:id", multerService.array('images', 5), validate(validation.edit), controller.edit);

// Delete item
itemRouter.delete("/:id", validate(validation.remove), controller.remove);

// Toggle featured status
itemRouter.patch(
  "/:id/featured",
  validate(validation.toggleFeatured),
  controller.toggleFeatured
);

export default itemRouter;
