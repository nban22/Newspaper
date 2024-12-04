import { Router } from "express";

import * as viewController from "../controllers/viewController";
import { attachUserId, authMiddlewares, authorizeRole } from "../middlewares/authMiddlewares";

const viewRouter = Router();

viewRouter.get("/", authMiddlewares, viewController.getHomePage);
viewRouter.get("/login", viewController.getLoginPage);
viewRouter.get("/signup", viewController.getSignupPage);
viewRouter.get("/create_user", viewController.getCreateUserPage);
viewRouter.get("/latest_article", viewController.getLatestArticles);

viewRouter.get("/update_user_profile",attachUserId, viewController.getUpdateUserProfilePage);

export default viewRouter;
