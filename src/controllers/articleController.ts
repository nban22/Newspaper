import { Request, Response, NextFunction } from "express";
import Article from "../models/article";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/AppError";
import WriterProfile from "../models/writerProfile";


export const createArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { title, summary, content, thumbnail, category_id, userId } = req.body;

    const author_id = await WriterProfile.findOne({ user_id: userId });

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