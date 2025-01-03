import { Router } from "express";
import * as subscriberController from "../controllers/subscriberController";
import { attachUserId, authenticateJWT, authorizeRole } from "../middlewares/authMiddlewares";

const router = Router();

router.post("/renewal",attachUserId, authorizeRole(["subscriber"]), subscriberController.renewalSubscription);

router.post("/register-premium", authenticateJWT, subscriberController.registerPremium);

export default router;