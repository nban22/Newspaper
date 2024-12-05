import { Router } from "express";
import * as authController from "../controllers/authController";
import { attachUserId } from "../middlewares/authMiddlewares";

const router = Router();

router.post("/logout",  authController.logout);
router.post("/signup", authController.signup);
router.post("/login",  authController.login);


router.get("/getme",attachUserId, authController.getMe);

export default router;