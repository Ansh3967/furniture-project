import { Router } from "express";
import * as controller from "../controllers/media.controller.js";
import * as validation from "../validation/media.validation.js";
import validate from "../../../middlewares/validate.js";
import multerService from "../../../services/multerService.js";

const mediaRouter = Router();

// Upload media files
mediaRouter.post(
  "/upload",
  multerService.array("files", 10),
  validate(validation.uploadMedia),
  controller.uploadMedia
);

// Get all media
mediaRouter.get("/", validate(validation.getAllMedia), controller.getAllMedia);

// Get media statistics
mediaRouter.get("/stats", controller.getMediaStats);

// Get single media
mediaRouter.get("/:id", validate(validation.getMediaById), controller.getMediaById);

// Update media
mediaRouter.put("/:id", validate(validation.updateMedia), controller.updateMedia);

// Delete media
mediaRouter.delete("/:id", validate(validation.deleteMedia), controller.deleteMedia);

export default mediaRouter;
