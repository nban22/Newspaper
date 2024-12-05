import { Router } from "express";
import * as subscriberController from "../controllers/subscriberController";
import { attachUserId, authorizeRole } from "../middlewares/authMiddlewares";

const router = Router();

router.use(attachUserId);

router.post("/renewal", authorizeRole(["subscriber"]), subscriberController.renewalSubscription);

export default router;