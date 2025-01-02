import { Router } from "express";

import * as categoryController from "../controllers/categoryController";

const categoryRouter = Router();

categoryRouter.post("/create-category", categoryController.createCategory);
categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.post("/create", categoryController.createCategory);
categoryRouter.put("/update/:id", categoryController.updateCategory);
categoryRouter.delete("/delete/:id", categoryController.deleteCategory);
categoryRouter.get("/header", categoryController.getCategories);

export default categoryRouter;








