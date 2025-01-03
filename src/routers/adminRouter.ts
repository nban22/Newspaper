import { Router } from "express";

import * as adminController from "../controllers/adminController";
import { authenticateJWT } from "../middlewares/authMiddlewares";
const adminRouter = Router();

adminRouter.get("/categories", authenticateJWT, adminController.getCategoryManagementPage);
adminRouter.get("/tags", authenticateJWT, adminController.getTagManagementPage);
adminRouter.get("/articles", authenticateJWT, adminController.getArticleManagementPage);

adminRouter.get("/users", authenticateJWT, adminController.getUserManagementPage);

export default adminRouter;