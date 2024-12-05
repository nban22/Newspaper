import { Router } from "express";

import * as categoryController from "../controllers/categoryController";

const categoryRouter = Router();

categoryRouter.get("/top-categories", categoryController.getTopCategories);
categoryRouter.post("/create-category", categoryController.createCategory);
categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.get("/:categoryName", categoryController.getCategoryArticleList);


export default categoryRouter;








