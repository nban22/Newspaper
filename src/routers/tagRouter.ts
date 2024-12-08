import { Router } from "express";
import * as tagController from "../controllers/tagController";


const router = Router();

router.get("/", tagController.getAllTags);
router.get("/:articleId", tagController.getTagsByAriticleId);

export default router;