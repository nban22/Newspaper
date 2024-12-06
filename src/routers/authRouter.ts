import { Router } from "express";
import * as authController from "../controllers/authController";

const router = Router();

router.post("/logout",  authController.logout);
router.post("/signup", authController.signup);
router.post("/login",  authController.login);

export default router;