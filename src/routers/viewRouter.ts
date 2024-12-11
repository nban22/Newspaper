import { Router } from "express";

import * as viewController from "../controllers/viewController";
import { attachUserId, authenticateJWT, authorizeRole } from "../middlewares/authMiddlewares";

const viewRouter = Router();

viewRouter.get("/", authenticateJWT, viewController.getHomePage);
viewRouter.get("/login", viewController.getLoginPage);
viewRouter.get("/signup", viewController.getSignupPage);
viewRouter.get("/create_user", viewController.getCreateUserPage);

viewRouter.get("/update_profile", authenticateJWT, viewController.getUpdateUserProfilePage);
viewRouter.get("/create_article", viewController.getCreateArticlePage);
viewRouter.get("/edit_article/:articleId", authenticateJWT, viewController.getEditArticlePage);
viewRouter.get("/:categoryName", authenticateJWT, viewController.getCategoryArticleList);

export default viewRouter;
