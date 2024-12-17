import { Router } from "express";
import * as commentsController from "../controllers/commentsController";
import { handleAccessToken } from "../middlewares/authMiddlewares";

const commentsRouter = Router();

commentsRouter.post("/:articleId", handleAccessToken, commentsController.createComment);
commentsRouter.patch("/:articleId", commentsController.updateComment);
commentsRouter.delete("/:articleId", commentsController.deleteComment);

export default commentsRouter; 
