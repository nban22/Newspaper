import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Category from "../models/category";
import Article from "../models/article";
import ArticleTag from "../models/article_tag";
import Tag from "../models/tag";
import AppError from "../utils/AppError";
import { StatusCodes } from "http-status-codes";
import formatDate from "../utils/formatDate";

export const getCategoryManagementPage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    const categories = await Category.find();
    let categoriesWithParentName: { _id: unknown; name: string; parent_name: string; created_at: string; total_articles: number }[] = [];
    for (const category of categories) {
        const parentCategory = await Category.findById(category.parent_id);
        const articles = await Article.find({ category_id: category._id });
        categoriesWithParentName.push({
            _id: category._id,
            name: category.name,
            parent_name: parentCategory ? parentCategory.name : "",
            total_articles: articles.length,
            created_at: formatDate(category.created_at),
        });
    };

    res.status(StatusCodes.OK).render("pages/admin/categories", {
        user: user,
        categories: categoriesWithParentName,
    });
});

export const getTagManagementPage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;

    const tags = await Tag.find();
    let tagsWithTotalArticles: { _id: unknown; name: string; created_at: string; total_articles: number }[] = [];
    for (const tag of tags) {
        const articles = await ArticleTag.find({ tag_id: tag._id });
        tagsWithTotalArticles.push({
            _id: tag._id,
            name: tag.name,
            total_articles: articles.length,
            created_at: formatDate(tag.created_at),
        });
    };

    res.status(StatusCodes.OK).render("pages/admin/tags", {
        user: user,
        tags: tagsWithTotalArticles,
    });
});