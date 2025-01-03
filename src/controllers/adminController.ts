import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Category from "../models/category";
import Article from "../models/article";
import ArticleTag from "../models/article_tag";
import Tag from "../models/tag";
import { StatusCodes } from "http-status-codes";
import formatDate from "../utils/formatDate";
import User from "../models/user";
import SubscriberProfile from "../models/subscriberProfile";

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

export const getArticleManagementPage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    const articles = await Article.find().populate("category_id").populate("writer_id").lean();

    const articlesFiltered = articles.map((article: any) => ({
        _id: article?._id,
        title: article?.title,
        is_premium: article?.is_premium,
        category: article?.category_id?.name,
        writer_name: article?.writer_id?.full_name,
        created_at: article?.created_at,
        status: article?.status,
    }));

    res.status(StatusCodes.OK).render("pages/admin/articles_management", {
        layout: "layouts/admin",
        title: "Quản lý bài viết",
        user: user,
        articles: articlesFiltered,
    });
});

export const getUserManagementPage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    const users = await User.find();

    const editors = users.filter(user => user.role === "editor");

    const categories = await Category.find().lean();

    const readers = users.filter(user => user.role === "subscriber") as any;
    for (const reader of readers) {
        const subscriberProfile = await SubscriberProfile.findOne({ user_id: reader._id });
        reader.subscription_status = subscriberProfile?.subscription_status;
        reader.expiryDate = subscriberProfile?.expiryDate;
    }

    res.status(StatusCodes.OK).render("pages/admin/users_management", {
        layout: "layouts/admin",
        title: "Quản lý người dùng",
        user: user,
        users: users,
        editors: editors,
        categories: categories,
        readers: readers,
    });
});