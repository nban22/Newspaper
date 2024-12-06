import { Router } from "express";
import googlePassport from "../config/googlePassport";

import { googleCallback, redirectUser } from "../controllers/googleController";

const router = Router();

router.get("/", googlePassport.authenticate("google", { scope: ["email", "profile"] }));

router.get("/callback", googleCallback, redirectUser);



export default router;
