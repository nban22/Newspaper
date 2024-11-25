import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import catchAsync from "../utils/catchAsync";
import GlobalError from "../utils/GlobalError";

export const getHomePage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    if (!users) {
        return next(new GlobalError(404, "No users found!"));
    }

    res.status(200).render("pages/home", {
        users: users,
    });
});

export const getLoginPage = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).render("login");
};

export const getSignupPage = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).render("signup");
}

export const getCreateUserPage = (req: Request, res: Response, next: NextFunction) => { 
    res.status(200).render("create_user");
}
