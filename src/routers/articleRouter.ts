import { Router } from "express";
import * as articleController from "../controllers/articleController";

const articleRouter = Router();

articleRouter.post("/", articleController.createArticle); // Route to create a new article

export default articleRouter;