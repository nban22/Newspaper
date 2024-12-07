import { Router } from "express";

import * as tagController from "../controllers/tagController";

const tagRouter = Router();

tagRouter.get("/", tagController.getAllTags);
tagRouter.post("/create", tagController.createTag);
tagRouter.put("/update/:id", tagController.updateTag);
tagRouter.delete("/delete/:id", tagController.deleteTag);


export default tagRouter;







