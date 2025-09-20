import { Router } from "express";

const itemRouter = Router();

itemRouter.post("/add", () => {
  console.log("hello bhen chodo");
});

export default itemRouter;
