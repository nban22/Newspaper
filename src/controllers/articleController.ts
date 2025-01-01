import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import Article from "../models/article";
import WriterProfile from "../models/writerProfile";
import ArticleTag from "../models/article_tag";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { sanitizeSummary } from "../utils/sanitizeHTML";
import moment from "moment";

export const createArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {    
    const { title, summary, content, thumbnail, category_id, userId, tags, is_premium } = req.body;
    const writer_id = (await WriterProfile.findOne({ user_id: userId }))?._id;
    // console.log(writer_id);
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
        is_premium,
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

    const { title, summary, content, thumbnail, category_id, userId, tags, is_premium } = req.body;
    const { articleId } = req.params;

    await Article.findByIdAndUpdate(articleId, {
        title,
        summary,
        thumbnail,
        content,
        category_id,
        updatedAt: new Date(),
        is_premium,
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
    const latestArticles = await Article.find({status: "published"}).sort({created_at: -1}).limit(10).populate("category_id").populate("writer_id")
                                          
    
    let articles = latestArticles.map(article => ({
        ...article.toObject(),
        
        // Sanitize the summary
        summary: sanitizeSummary(String(article.summary)),

        // Format the publish date
        publish_date: moment(article.publish_date).format("DD-MM-YYYY")
    }));

    return {
        message: "Successfully got latest article list",
        data: {
            articles: articles
        }
    };
};

export const uploadImage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {   
    if (!req.file) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Please upload an image"));
    }

    // remove the 'public' from the path
    req.file.path = req.file.path.replace("public", "");

    return res.status(StatusCodes.OK).json({
        status: "success",
        data: {
            imageUrl: req.file.path,
        },
    });
});

export const getWriterArticleList = async (writer_id: string) => {
    // console.log(writer_id)
    const writer = await WriterProfile.findOne({ user_id: writer_id });
    // console.log(writer)
    const articles = await Article.find({writer_id: writer}).sort({created_at: -1, is_premium: -1}).populate("category_id").populate("writer_id");
    // console.log(articles)
    return {
        message: "Successfully got writer's article list",
        data: {
            articles: articles
        }
    };
};