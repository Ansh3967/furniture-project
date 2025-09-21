import { Router } from "express";
import Item from "../models/item.model.js";

const itemRouter = Router();

itemRouter.post("/add", async (req, res) => {
  const item = new Item({
    itemId: "1234",
  });

  await item.save();
  res.status(201).send("gand");
});

export default itemRouter;
