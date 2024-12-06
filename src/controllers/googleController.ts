import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import facebookPassport from "../config/facebookPassport";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { generateToken } from "../utils/jwt";


export const googleCallback = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        facebookPassport.authenticate("google", { session: false }, async (err: any, user: any, info: any) => {
            if (err || !user) {
                return next(new AppError(StatusCodes.UNAUTHORIZED, "Google authentication failed"));
            }

            console.log("user", user);

            req.user = user;

            next(); 
        })(req, res, next); 
    }
);

export const redirectUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, "User not found from callback"));
    }
    console.log("user twice", user);
    const accessToken = generateToken(user);

    res.cookie("accessToken", accessToken, {
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
        httpOnly: true,
        path: "/",
    });

    res.redirect("/");
});
