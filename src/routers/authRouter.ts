import { Router } from "express";
import * as authController from "../controllers/authController";

const router = Router();

router.post("/logout",  authController.logout);
router.post("/signup", authController.signup);
router.post("/login",  authController.login);
router.post("/forgot_password",  authController.forgotPassword);
router.post("/reset_password",  authController.resetPassword);
router.post("/forgot_password/verify_reset_code",  authController.verifyResetCode);


export default router;