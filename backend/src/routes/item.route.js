import { Router } from "express";
import *as controller from "../controllers/item.controller.js";

const itemRouter = Router();

itemRouter.get("/", controller.list);
itemRouter.get("/:itemId", controller.get);
itemRouter.post("/add", controller.add);
itemRouter.put("/:itemId", controller.edit);
itemRouter.delete("/:itemId", controller.remove);

export default itemRouter;
