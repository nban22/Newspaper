import { Request, Response, NextFunction } from "express";
import Article from "../models/article";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/AppError";

export const createArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { title, summary, content, thumbnail, category_id, author_id } = req.body;

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
        author_id,
        category_id,
        createdAt: new Date(),
    });

    res.status(StatusCodes.CREATED).json({
        status: "success",
        data: {
            article: newArticle,
        },
    });
});