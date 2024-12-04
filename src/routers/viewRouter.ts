import { Router } from "express";

import * as viewController from "../controllers/viewController";
import { attachUserId, authorizeRole } from "../middlewares/authMiddlewares";

const viewRouter = Router();

viewRouter.get("/", viewController.getHomePage);
viewRouter.get("/login", viewController.getLoginPage);
viewRouter.get("/signup", viewController.getSignupPage);
viewRouter.get("/create_user", viewController.getCreateUserPage);
viewRouter.get("/latest_article", viewController.getLatestArticles);

viewRouter.use(attachUserId);
viewRouter.get("/update_user_profile", viewController.getUpdateUserProfilePage);

export default viewRouter;