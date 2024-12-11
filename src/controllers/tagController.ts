import { Request, Response, NextFunction } from 'express';
import Tag from '../models/tag';
import catchAsync from '../utils/catchAsync';
import { StatusCodes } from 'http-status-codes';
import ArticleTag from '../models/article_tag';
import AppError from '../utils/AppError';
import Article from '../models/article';

export const getTagsByAriticleId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const articleId = req.params.articleId;
    const articleTags = await ArticleTag.find({ article_id: articleId });
    const tagIds = articleTags.map((articleTag) => articleTag.tag_id);
    const tags = await Tag.find({ _id: { $in: tagIds } });
  
    res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
            tags
        }
    });

});

export const getAllTags= catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
       
        const tags = await Tag.find();

        return res.status(StatusCodes.OK).json({
            status: "success",
            data: {
                tags_total: tags.length,
                tags: tags,
            },
        });
    }
);

export const updateTag = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tagId = req.params.id;
    const { name } = req.body;

    if (name === "") {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Name cannot be empty!"));
    }

    const tag = await Tag.findById(tagId);
    if (!tag) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Tag_id not found!"));
    }

    tag.name = name;

    await tag.save();
    res.status(StatusCodes.OK).redirect("/admin/tags");
});

export const createTag = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.body;

        if (name === "") {
            return next(new AppError(StatusCodes.BAD_REQUEST, "Name cannot be empty!"));
        }
        
        // Check if tag already exists
        const existingTag = await Tag.findOne({ name });
        if (existingTag) {
            return next(new AppError(StatusCodes.BAD_REQUEST, `Tag ${name} already exists!`));
        }

        const tag = await Tag.create({ name });
        res.status(StatusCodes.OK).redirect("/admin/tags");
    }
);

export const deleteTag = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const tagId = req.params.id;
        const tag = await Tag.findByIdAndDelete(tagId);
        if (!tag) {
            return next(new AppError(StatusCodes.NOT_FOUND, "Tag not found!"));
        }
        
        res.status(StatusCodes.OK).redirect("/admin/tags");
    }
);

export const getTagArticleList = async (tagName: string) => {
    if (!tagName) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Please provide a tag!");
    }

    const tag = await Tag.findOne({ name: tagName });
    if (!tag) {
        throw new AppError(StatusCodes.NOT_FOUND, "Tag not found");
    }

    const article_tag = await ArticleTag.find({ tag_id: tag._id }).populate("article_id");
    const articleIds = article_tag.map(article_tag => article_tag.article_id);
    const articles = await Article.find({ _id: { $in: articleIds } })
                                .populate("category_id")
                                .populate("writer_id")
                                .sort({ is_premium: -1, created_at: -1 });;

    return {
        message: "Successfully got tag article list",
        data: {
            tag: tagName,
            articles: articles
        }
    };
};