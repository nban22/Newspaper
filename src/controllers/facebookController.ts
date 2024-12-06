import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import facebookPassport from "../config/facebookPassport";
import AppError from "../utils/AppError";
import { generateToken } from "../utils/jwt";


export const facebookCallback = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    facebookPassport.authenticate("facebook", {session: false}, (err: any, user: any) => {
        if (err || !user) {
            return next(new AppError(StatusCodes.UNAUTHORIZED, "Facebook authentication failed"));
        }

        req.user = user;

        next();
    })(req, res, next);
});

export const redirectUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const accessToken = generateToken(user);

    res.cookie("accessToken", accessToken, {
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
        httpOnly: true,
        path: "/",
    });

    res.redirect("/");
})