import { Router } from "express";

import * as viewController from "../controllers/viewController";
import {  authenticateJWT, authorizeRole } from "../middlewares/authMiddlewares";

const viewRouter = Router();

viewRouter.get("/", authenticateJWT, viewController.getHomePage);
viewRouter.get("/login", viewController.getLoginPage);
viewRouter.get("/forgot_password", viewController.getForgotPasswordPage);
viewRouter.get("/reset_password", viewController.getResetPasswordPage);
viewRouter.get("/signup", viewController.getSignupPage);
viewRouter.get("/create_user", viewController.getCreateUserPage);

viewRouter.get("/update_profile", authenticateJWT, viewController.getUpdateUserProfilePage);
viewRouter.get("/create_article", authenticateJWT, viewController.getCreateArticlePage);
viewRouter.get("/article/:id", authenticateJWT, viewController.getArticlePage);
viewRouter.get("/articles", authenticateJWT, authorizeRole(["writer"]), viewController.getWriterArticleList);

viewRouter.get("/edit_article/:articleId", authenticateJWT, viewController.getEditArticleForm);

viewRouter.get("/chuyen-muc/:categoryId", authenticateJWT, viewController.getCategoryArticleList);
viewRouter.get("/nhan/:tagId", authenticateJWT, viewController.getTagArticleList);
viewRouter.get("/search", authenticateJWT, viewController.getSearchPage);

viewRouter.get("/register-premium-subscriber", authenticateJWT, viewController.getRegisterPremiumSubscriberPage);

export default viewRouter;
