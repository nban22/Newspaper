import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/AppError";
import formatDate from "../utils/formatDate";
import ArticleTag from "../models/article_tag";
import Article from "../models/article";
import Category from "../models/category";
import {ITag} from "../models/tag";
import {IArticle} from "../models/article";
import { Types } from "mongoose";
import EditorProfile from "../models/editorProfile";

export const getArticleList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;

    if (!user) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, "You need to login to view this page!"));
    }

    if (user.role !== "editor") {
        return next(new AppError(StatusCodes.FORBIDDEN, "You are not authorized to view this page!"));
    }

    const categories = await Category.find().lean();

    const editorProfile = await EditorProfile.findOne({ user_id: user._id }).lean();
    
    if (!editorProfile) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Editor profile not found!"));
    }

    if (!editorProfile.category_id) {
        res.status(StatusCodes.OK).render("pages/articles_list", {user, category: null});
    }
    else {
        const editorcategoryID = editorProfile.category_id;
        const editorcategory = categories.find(category => category._id.toString() === editorcategoryID.toString());
        const articleTag = await ArticleTag.find().populate<{article_id: IArticle}>("article_id").populate<{ tag_id: ITag }>("tag_id").lean();
        const articles = Object.values(
            articleTag.filter(article => article?.article_id?.category_id.toString() === editorcategoryID.toString())
                        .reduce((acc: { [key: string]: any }, article) => {
                            const __article = article.article_id;
                            const __tag = article.tag_id;
                            const __category = categories.find(category => category._id.toString() === __article.category_id.toString());
                        
                            if (!acc[__article._id.toString()]) {
                                acc[__article._id.toString()] = { ...__article, tag: [__tag.name], category: __category ? __category.name : "Không xác định" };
                            } else {
                                acc[__article._id.toString()].tag.push(__tag.name);
                            }
                        
                            return acc;
                        }, {})
        );
        res.status(StatusCodes.OK).render("pages/articles_list", {user, category: editorcategory?.name, articles, formatDate, categories});
    }
})

export const rejectArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;

    if (!user) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, "You need to login to view this page!"));
    }

    if (user.role !== "editor") {
        return next(new AppError(StatusCodes.FORBIDDEN, "You are not authorized to view this page!"));
    }

    const articleId = req.params.id;
    if (!articleId) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Article ID is required!"));
    }

    const article = await Article.findById(articleId);
    if (!article) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Article not found!"));
    }

    if (article.status !== "draft") {
        return next(new AppError(StatusCodes.BAD_REQUEST, "You can only reject draft article!"));
    }

    article.status = "rejected";
    article.rejection_reason = req.body.rejectionReasonInput;
    await article.save();

    res.status(StatusCodes.OK).redirect("/editor/articles");
});

export const approveArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    const { category, publishDate } = req.body;

    if (!user) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, "You need to login to view this page!"));
    }

    if (user.role !== "editor") {
        return next(new AppError(StatusCodes.FORBIDDEN, "You are not authorized to view this page!"));
    }

    const categoryObj = await Category.findOne({ name: category });
    if (!categoryObj) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Category not found!"));
    }

    const articleId = req.params.id;
    if (!articleId) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Article ID is required!"));
    }

    const article = await Article.findById(articleId);
    if (!article) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Article not found!"));
    }

    if (article.status !== "draft") {
        return next(new AppError(StatusCodes.BAD_REQUEST, "You can only approve draft article!"));
    }
    
    article.category_id = categoryObj._id as Types.ObjectId;
    article.status = "pending";
    article.publish_date = publishDate ? new Date(publishDate) : new Date();
    await article.save();
    // console.log(`Article ${article.title} is approved! Publishing date: ${article.publish_date}`);
    res.status(StatusCodes.OK).redirect("/editor/articles");
});
