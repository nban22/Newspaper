import { Router } from "express";

import * as articleHandlingController from "../controllers/articleHandlingController";
import {  authenticateJWT } from "../middlewares/authMiddlewares";

const articleHandlingRouter = Router();


articleHandlingRouter.get("/", authenticateJWT, articleHandlingController.getArticleList);
articleHandlingRouter.put("/reject/:id", authenticateJWT, articleHandlingController.rejectArticle);
articleHandlingRouter.put("/approve/:id", authenticateJWT, articleHandlingController.approveArticle);


export default articleHandlingRouter;
