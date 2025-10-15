import { Router } from "express";
import * as controller from "../controllers/user.controller.js";
import * as validation from "../validation/user.validation.js";
import validate from "../../../middlewares/validate.js";

const userRouter = Router();

// Get all users with filtering and pagination
userRouter.get("/", validate(validation.list), controller.list);

// Get user statistics
userRouter.get("/stats", controller.getStats);

// Get single user by ID
userRouter.get("/:id", validate(validation.get), controller.get);

// Update user
userRouter.put("/:id", validate(validation.update), controller.update);

// Delete user
userRouter.delete("/:id", validate(validation.remove), controller.remove);

// Toggle user status
userRouter.patch("/:id/status", validate(validation.toggleStatus), controller.toggleStatus);

export default userRouter;
