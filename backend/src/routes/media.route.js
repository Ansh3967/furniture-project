import { Router } from "express";
import { uploadMedia } from "../controllers/media.controller.js";
import multerService from "../services/multerService.js";

const mediaRouter = Router();

mediaRouter.post("/upload", multerService.array('files'),uploadMedia);

export default mediaRouter;