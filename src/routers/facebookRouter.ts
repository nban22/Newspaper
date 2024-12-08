import { Router } from "express";
import facebookPassport from "../config/facebookPassport";
import { facebookCallback, redirectUser } from "../controllers/facebookController";

const router = Router();

router.get("/", facebookPassport.authenticate("facebook", { scope: ["email", "public_profile"] }));

router.get("/callback", facebookCallback, redirectUser);

export default router;
