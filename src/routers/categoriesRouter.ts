import { Router } from "express";

import * as categoryController from "../controllers/categoryController";

const categoryRouter = Router();

categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.post("/create", categoryController.createCategory);
categoryRouter.put("/update/:id", categoryController.updateCategory);
categoryRouter.delete("/delete/:id", categoryController.deleteCategory);


export default categoryRouter;








