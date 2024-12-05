import { Router } from "express";
import facebookPassport from "../config/facebookPassport";

const router = Router();

router.get("/", facebookPassport.authenticate("facebook", { scope: ["email"] }));

router.get(
    "/callback",
    facebookPassport.authenticate("facebook", { failureRedirect: "/login", successRedirect: "/" }),
);

export default router;
