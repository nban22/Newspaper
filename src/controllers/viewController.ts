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
import tag from "../models/tag";
import Comment from "../models/comment";

export const getHomePage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;

    const [latestArticles] = await Promise.all([
        Article.find().sort({created_at: -1}).limit(5).populate("category_id").populate("author_id")
    ]);

    // console.log(latestArticles);
    
    const [popularArticles] = await Promise.all([
        Article.find().sort({content: -1}).limit(4).populate("category_id").populate("author_id")
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
    res.status(StatusCodes.OK).render("pages/create_article", {user: user});
}   

export const getArticlePage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const articleId = req.params.id;
    const user = req.body.user;

    // Check if id is provided
    if (!articleId) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Article id cannot be empty!"));
    }

    // Check if article exists
    // Check if id is valid
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Invalid article ID!"));
    }
    // Convert id to ObjectId
    const articleObjectId = new mongoose.Types.ObjectId(articleId);
    // Get an article
    const article = await Article.findById(articleId);
    // Check if article exists
    if (!article) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Article not found!"));
    }
    // Increment view count
    await Article.incrementViewCount(articleObjectId);

    // Re-fetch the article to ensure updated data is sent
    const updatedArticle = await Article.findById(articleId);

    // Ensure updatedArticle is not null
    if (!updatedArticle) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Updated article not found!"));
    }

    // Format publish date
    const formattedPublishDate = moment(updatedArticle.publish_date).format("DD-MM-YYYY");

    // Get category's name 
    const category = await Category.findById(updatedArticle.category_id);
    const categoryName = category ? category.name : "Unknown";

    // Get article's author
    const author = await WriterProfile.findOne({user_id: updatedArticle.author_id});
    const authorName = author ? author.full_name : "Khuyết danh";

    // Get tags for the article
    const tagsList = await tag.find({article_id: articleObjectId}).populate("tag_id");
    const tags = tagsList.map(tag => tag.name);
    if (tags.length === 0) {
        tags.push("No tags");
    }

    // Get comments for the article
    const comments = await Comment.find({article_id: articleObjectId}).populate("user_id").populate("content").populate("create_at");
    // Get all articles
    const relatedArticles = await Article.find({
        category_id: updatedArticle.category_id, // Lọc theo danh mục
        _id: { $ne: updatedArticle._id },       // Loại bỏ bài viết hiện tại
    })
        .limit(5)                               // Lấy tối đa 5 bài viết
        .sort({ created_at: -1 })               // Sắp xếp bài viết theo ngày tạo mới nhất
        .select("title publish_date thumbnail") // Chỉ chọn các trường cần thiết
        .exec();                                // Thực thi truy vấn
    
    // Render article page
    res.status(StatusCodes.OK).render("pages/detail_article", { user,
        article: {
            ...updatedArticle.toObject(),
            categoryName,
            authorName,
            tags,
            comments,
            relatedArticles,
            publish_date: formattedPublishDate,
        },
    });
})

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

    if (article.author_id.toString() !== writer._id?.toString()) {   
        return next(new AppError(StatusCodes.FORBIDDEN, "You are not authorized to edit this article!"));
    }
    
    res.status(StatusCodes.OK).render("pages/edit_article", {user: user, article: article});
});
