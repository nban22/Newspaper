import { Router } from "express";
import * as commentsController from "../controllers/commentsController";

const commentsRouter = Router();

commentsRouter.post("/", commentsController.createComment);
commentsRouter.patch("/:id", commentsController.updateComment);
commentsRouter.delete("/:id", commentsController.deleteComment);

export default commentsRouter; 
