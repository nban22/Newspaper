import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import SubscriberProfile from "../models/subscriberProfile";
import WriterProfile from "../models/writerProfile";
import EditorProfile from "../models/editorProfile";
import { StatusCodes } from "http-status-codes";

export const getHomePage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    const user = req.body.user;

    
   

    res.status(200).render("pages/home", {
        user: user,
    });
});

export const getLoginPage = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).render("pages/login");
};

export const getSignupPage = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).render("pages/signup");
}

export const getCreateUserPage = (req: Request, res: Response, next: NextFunction) => { 
    res.status(200).render("create_user");
}

export const getLatestArticles = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    if (!users) {
        return next(new AppError(404, "No users found!"));
    }

    res.status(200).render("pages/latest_article", {
        users: users,
    });
});

export const getUpdateUserProfilePage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;

    const user = await User.findById(userId);

    if (!user) {
        return next(new AppError(StatusCodes.NOT_FOUND, "No user found with that ID!"));
    }
    
    let profileOwner: any;
    if (user.role === "subscriber") {
        profileOwner = await SubscriberProfile.findOne({user_id: userId});
    } else if (user.role === "writer") {
        profileOwner = await WriterProfile.findOne({user_id: userId});
    } else if (user.role === "editor") {
        profileOwner = await EditorProfile.findOne({user_id: userId});
    } else {
        return next(new AppError(StatusCodes.NOT_FOUND, "No profile found for this user!"));
    }

    res.status(200).render("pages/update_user_profile", {user: user, profile: profileOwner});
});