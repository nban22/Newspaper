import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import SubscriberProfile from "../models/subscriberProfile";
import WriterProfile from "../models/writerProfile";
import EditorProfile from "../models/editorProfile";
import { StatusCodes } from "http-status-codes";
import Article from "../models/article";
import moment from "moment";
import { fetchTopCategories } from "./categoryController";
import mongoose from "mongoose";
import Category from "../models/category";
import Tag from "../models/tag";
import ArticleTag from "../models/article_tag";
import Comment from "../models/comment";
import * as categoryController from "./categoryController";
import * as tagController from "./tagController";
import * as articleController from "./articleController";
import { sanitizeSummary, sanitizeContent } from "../utils/sanitizeHTML";

export const getHomePage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;

    const latestArticles = (await articleController.getLatestArticles()).data.articles;
    
    const [popularArticles] = await Promise.all([
        Article.find().sort({content: -1}).limit(4).populate("category_id").populate("writer_id")
    ]);

    const featuredArticles = (await Article.getFeaturedArticles()).map(article => ({
        ...article.toObject(),
        publish_date: moment(article.publish_date).format('DD-MM-YYYY'),
    }));

    const topCategories = (await fetchTopCategories()).map(category => ({
        ...category,
        publishDate: moment(category.publishDate).format('DD-MM-YYYY'),
        }));
    
    res.status(StatusCodes.OK).render("pages/home", {
        user: user,
        latestArticle: latestArticles,
        popularArticle: popularArticles,
        featuredArticles: featuredArticles,
        topCategories: topCategories,
    });
});

export const getLoginPage = (req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.OK).render("pages/login");
};

export const getForgotPasswordPage = (req: Request, res: Response, next: NextFunction) => {
    const { enterCode, email } = req.query;
    res.status(StatusCodes.OK).render("pages/forgot_password", { enterCode, email });
};

export const getResetPasswordPage = (req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.OK).render("pages/reset_password");
}

export const getSignupPage = (req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.OK).render("pages/signup");
}

export const getCreateUserPage = (req: Request, res: Response, next: NextFunction) => { 
    res.status(StatusCodes.OK).render("create_user");
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

    res.status(StatusCodes.OK).render("pages/update_profile", {user: user, profile: profileOwner});
});

export const getCreateArticlePage = (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    res.status(StatusCodes.OK).render("pages/create_article", {user: user, article: null});
}   

export const getArticlePage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const articleId = req.params.id;
    const user = req.body.user;

    // Check if id is provided
    if (!articleId) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Article id cannot be empty!"));
    }

    // Check if article exists
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Invalid article ID!"));
    }

    const articleObjectId = new mongoose.Types.ObjectId(articleId);
    const article = await Article.findById(articleId);
    if (!article) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Article not found!"));
    }

    // Increment view count
    await Article.incrementViewCount(articleObjectId);

    // Re-fetch the article to ensure updated data is sent
    const updatedArticle = await Article.findById(articleId);
    if (!updatedArticle) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Updated article not found!"));
    }

    // Format publish date
    const formattedPublishDate = moment(updatedArticle.publish_date).format("DD-MM-YYYY");

    // Get category's name 
    const category = await Category.findById(updatedArticle.category_id);
    const categoryName = category ? category.name : "Unknown";

    // Get article's author
    const writer = await WriterProfile.findOne({ user_id: updatedArticle.writer_id });
    const writerName = writer ? writer.full_name : "Khuyết danh"; 

    // Get tags for the article
    const tagsListID = await ArticleTag.find({ article_id: articleObjectId }).select("tag_id");
    
    const tags = await Tag.find({ _id: { $in: tagsListID.map(tag => tag.tag_id) } });

    const tagNames = tags.map(tag => tag.name);

    // Get comments for the article
    const comments = await Comment.find({ article_id: articleObjectId })
        .populate("user_id")
        .populate("content")
        .populate("create_at");

        const relatedArticles = await Article.find({
            category_id: updatedArticle.category_id,
            _id: { $ne: updatedArticle._id },
        })
            .limit(5)
            .sort({ created_at: -1 })
            .select("title publish_date thumbnail")
            .exec();
        
        const formattedArticles = relatedArticles.map((article) => ({
            ...article.toObject(),
            publish_date: moment(article.publish_date).format("DD-MM-YYYY"), // Format date
        }));
    

    // Sanitize the summary
    const rawSummary = updatedArticle.summary ?? "";
    const sanitizedSummary = sanitizeSummary(String(rawSummary));

    const rawContent = updatedArticle.content ?? "";
    const sanitizedContent = sanitizeContent(String(rawContent));

    // Render article page
    res.status(StatusCodes.OK).render("pages/detail_article", {
        user,
        article: {
            ...updatedArticle.toObject(),
            summary: sanitizedSummary,
            content: sanitizedContent,
            categoryName,
            writerName,
            tagNames,
            comments,
            relatedArticles: formattedArticles,
            publish_date: formattedPublishDate,
        },
    });
});


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
    
    res.status(StatusCodes.OK).render("pages/edit_article", {user: user, article: article});
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

export const getTagArticleList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;

    const tag = req.params.tagName.replace('-', ' ').charAt(0).toUpperCase()
                    + req.params.tagName.replace('-', ' ').slice(1);
    if (!tag) {
        throw next(new AppError(StatusCodes.BAD_REQUEST, "Please provide tag name"));
    }

    const article = await tagController.getTagArticleList(tag);

    res.status(StatusCodes.OK).render("pages/tag_articles", {
        user: user,
        tag: article.data.tag,
        articles: article.data.articles
    })
})