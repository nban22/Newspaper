import { Router } from "express";

import * as articleHandlingController from "../controllers/articleHandlingController";
import {  authenticateJWT, authorizeRole } from "../middlewares/authMiddlewares";

const articleHandlingRouter = Router();


articleHandlingRouter.get("/", authenticateJWT, authorizeRole(['editor']), articleHandlingController.getArticleList);
articleHandlingRouter.put("/reject/:id", authenticateJWT, authorizeRole(['editor']), articleHandlingController.rejectArticle);
articleHandlingRouter.put("/approve/:id", authenticateJWT, authorizeRole(['editor']), articleHandlingController.approveArticle);


export default articleHandlingRouter;
