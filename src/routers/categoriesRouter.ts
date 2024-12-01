import express from "express";
import * as categoriesController from "../controllers/categoriesController";

const router = express.Router();

router.get("/top-categories", categoriesController.getTopCategories);
router.post("/create-category", categoriesController.createCategory);

export default router;
