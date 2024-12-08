import { Request, Response, NextFunction } from 'express';
import Tag from '../models/tag';
import catchAsync from '../utils/catchAsync';
import { StatusCodes } from 'http-status-codes';
import ArticleTag from '../models/article_tag';

export const getAllTags = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tags = await Tag.find();
    res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
            tags
        }
    });
});

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