import { Router } from "express";
import * as controller from "../controllers/category.controller.js";
import * as validation from "../validation/category.validation.js";
import validate from "../../../middlewares/validate.js";

const categoryRouter = Router();

// Get all categories (public - no authentication required)
categoryRouter.get("/", controller.list);

// Get category by ID (public - no authentication required)
categoryRouter.get("/:id", validate(validation.get), controller.get);

export default categoryRouter;
