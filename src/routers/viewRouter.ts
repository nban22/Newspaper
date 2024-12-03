import { Router } from "express";

import * as viewController from "../controllers/viewController";

const viewRouter = Router();

viewRouter.get("/", viewController.getHomePage);
viewRouter.get("/login", viewController.getLoginPage);
viewRouter.get("/signup", viewController.getSignupPage);
viewRouter.get("/create_user", viewController.getCreateUserPage);
viewRouter.get("/latest_article", viewController.getLatestArticles);


export default viewRouter;