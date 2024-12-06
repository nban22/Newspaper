import { Router } from "express";

import * as viewController from "../controllers/viewController";
import { authMiddlewares, authorizeRole } from "../middlewares/authMiddlewares";

const viewRouter = Router();

viewRouter.get("/", authMiddlewares, viewController.getHomePage);
viewRouter.get("/login", viewController.getLoginPage);
viewRouter.get("/signup", viewController.getSignupPage);
viewRouter.get("/create_user", viewController.getCreateUserPage);

viewRouter.get("/update_profile", authMiddlewares, viewController.getUpdateUserProfilePage);
viewRouter.get("/create_article", viewController.getCreateArticlePage);

export default viewRouter;
