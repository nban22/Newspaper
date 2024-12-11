import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import SubscriberProfile from "../models/subscriberProfile";
import WriterProfile from "../models/writerProfile";
import EditorProfile from "../models/editorProfile";
import { StatusCodes } from "http-status-codes";
import Article from "../models/article";
import moment from "moment";
import * as categoryController from "./categoryController";

export const getHomePage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;

    const [latestArticles] = await Promise.all([
        Article.find().sort({created_at: -1}).limit(10).populate("category_id").populate("writer_id")
    ]);
    
    const [popularArticles] = await Promise.all([
        Article.find().sort({content: -1}).limit(4).populate("category_id").populate("writer_id")
    ]);
    const featuredArticles = (await Article.getFeaturedArticles()).map(article => ({
        ...article.toObject(),
        publish_date: moment(article.publish_date).format('DD-MM-YYYY'),
    }));

    
    res.status(StatusCodes.OK).render("pages/home", {
        user: user,
        latestArticle: latestArticles,
        popularArticle: popularArticles,
        featuredArticles: featuredArticles
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

export const getUpdateUserProfilePage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;
    const user = req.body.user;
    
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

    res.status(200).render("pages/update_profile", {user: user, profile: profileOwner});
});

export const getCreateArticlePage = (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    
    res.status(200).render("pages/create_article", {user: user, article: null});
}   

export const getEditArticlePage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const articleId = req.params.articleId;

    const user = req.body.user;

    const writer = await WriterProfile.findOne({ user_id: user._id })
    if (!writer) {
        return next(new AppError(StatusCodes.NOT_FOUND, "No profile found for this user!"));
    }

    // status draft or rejected
    const article = await Article.findOne({_id: articleId, status: { $in: ["draft", "rejected"] }}).
                                    populate("category_id")
    if (!article) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Article not found!"));
    }

    if (article.writer_id.toString() !== writer._id?.toString()) {   
        return next(new AppError(StatusCodes.FORBIDDEN, "You are not authorized to edit this article!"));
    }
    
    res.status(200).render("pages/edit_article", {user: user, article: article});
});

export const getCategoryArticleList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;

    const category = req.params.categoryName.replace('-', ' ').charAt(0).toUpperCase()
                    + req.params.categoryName.replace('-', ' ').slice(1);
    if (!category) {
        throw next(new AppError(StatusCodes.BAD_REQUEST, "Please provide category name"));
    }

    const article = await categoryController.getCategoryArticleList(category);

    res.status(StatusCodes.OK).render("pages/category_articles", {
        user: user,
        category: article.data.category,
        articles: article.data.articles
    })
})