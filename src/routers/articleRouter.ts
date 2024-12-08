import { Router } from "express";
import * as articleController from "../controllers/articleController";
import { attachUserId, authorizeRole } from "../middlewares/authMiddlewares";

const articleRouter = Router();

articleRouter.use(attachUserId); // Middleware to attach user_id to the request object

articleRouter.post("/", authorizeRole(["writer"]), articleController.createArticle); // Route to create a new article

export default articleRouter;