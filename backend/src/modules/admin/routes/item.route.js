import { Router } from "express";
import * as controller from "../controllers/item.controller.js";
import * as validation from "../validation/item.validation.js";
import validate from "../../../middlewares/validate.js";

const itemRouter = Router();

itemRouter.get("/", controller.list);
itemRouter.get("/:itemId", controller.get);
itemRouter.post("/add", validate(validation.add), controller.add);
itemRouter.put("/:itemId", validate(validation.edit), controller.edit);
itemRouter.delete("/:itemId", controller.remove);

export default itemRouter;
