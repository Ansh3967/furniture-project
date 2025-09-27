import { Router } from "express";
import * as controller from "../controllers/item.controller.js";
import * as validation from "../validation/item.validation.js";
import validate from "../../../middlewares/validate.js";

const itemRouter = Router();

itemRouter.post("/list", validate(validation.list), controller.list);
itemRouter.post("/get", validate(validation.get), controller.get);
itemRouter.post("/add", validate(validation.add), controller.add);
itemRouter.post("/edit", validate(validation.edit), controller.edit);
itemRouter.post("/remove", validate(validation.remove), controller.remove);

export default itemRouter;
