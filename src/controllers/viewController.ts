import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import SubscriberProfile from "../models/subscriberProfile";
import WriterProfile from "../models/writerProfile";
import EditorProfile from "../models/editorProfile";
import { StatusCodes } from "http-status-codes";
import Article from "../models/article";

export const getHomePage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const users = await User.find();

    // if (!users) {
    //     return next(new AppError(404, "No users found!"));
    // }

    const [latestArticles] = await Promise.all([
        Article.find().sort({created_at: -1}).limit(5).populate("category_id").populate("author_id")
    ]);

    res.status(StatusCodes.OK).render("pages/home", {
        // users: users,
        latestArticle: latestArticles
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