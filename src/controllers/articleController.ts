import { Request, Response, NextFunction } from "express";
import Article from "../models/article";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/AppError";
import WriterProfile from "../models/writerProfile";
import ArticleTag from "../models/article_tag";

export const createArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {    
    const { title, summary, content, thumbnail, category_id, userId, tags } = req.body;

    const writer_id = await WriterProfile.findOne({ user_id: userId });

    if (!writer_id) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Writer profile not found"));
    }

    // Validate required fields
    if (!title && !summary && !content && !category_id) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Please provide title, description, content, and category_id"));
    }

    // Create a new article
    const newArticle = await Article.create({
        title,
        summary,
        thumbnail,
        content,
        writer_id,
        category_id,
        createdAt: new Date(),
    });

    // Create article tags
    if (tags) {
        tags.forEach(async (tag: string) => {
            await ArticleTag.create({
                article_id: newArticle.id,
                tag_id: tag,
            });
        });
    }

    res.status(StatusCodes.CREATED).json({
        status: "success",
        data: {
            article: newArticle,
        },
    });
});

export const updateArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { title, summary, content, thumbnail, category_id, userId, tags } = req.body;
    const { articleId } = req.params;

    await Article.findByIdAndUpdate(articleId, {
        title,
        summary,
        thumbnail,
        content,
        category_id,
    });
    
    // Update article tags
    if (tags) {
        await ArticleTag.deleteMany({ article_id: articleId });
        tags.forEach(async (tag: string) => {
            await ArticleTag.create({
                article_id: articleId,
                tag_id: tag,
            });
        });
    }

    res.status(StatusCodes.OK).json({
        status: "success",
        message: "Article updated successfully",
    });
});

export const getLatestArticles = async () => {
    const latestArticles = await Article.find().sort({created_at: -1}).limit(10).populate("category_id").populate("writer_id");

    return {
        message: "Successfully got latest article list",
        data: {
            articles: latestArticles
        }
    };
};