import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Category from "../models/category";
import AppError from "../utils/AppError";
import { StatusCodes } from "http-status-codes";
import Article from "../models/article";
import mongoose from "mongoose";
import { getAllCategoriesTree } from '../services/category.service';

export const getAllCategories = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const categories = await Category.find();
        return res.status(StatusCodes.OK).json({
            status: "success",
            data: {
                categories_total: categories.length,
                categories: categories,
            },
        });
    }
);

export const fetchTopCategories = async () => {
    const categoriesWithCounts = await Article.aggregate([
        { $match: { status: "published" } },
        { $group: { _id: "$category_id", articleCount: { $sum: 1 } } },
        { $sort: { articleCount: -1 } },
        { $limit: 10 },
    ]);

    const topCategoryIds = categoriesWithCounts.map((item) => item._id);

    const categoriesWithArticles = await Promise.all(
        topCategoryIds.map(async (categoryId) => {
            const category = await Category.findById(categoryId).select("name");
            const article = await Article.findOne({ category_id: categoryId, status: "published" })
                .sort({ publish_date: -1 })
                .select("title publish_date thumbnail is_premium");


            return {
                id: categoryId,
                name: category?.name,
                articleTitle: article?.title,
                articleId: article?._id,
                publishDate: article?.publish_date,
                thumbnail: article?.thumbnail,
                isPremium: article?.is_premium,
            };
        })
    );
    return categoriesWithArticles;
};





export const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id;
    const { name, parent_name } = req.body;

    if (name === "") {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Name cannot be empty!"));
    }

    const category = await Category.findById(categoryId);
    if (!category) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Category_id not found!"));
    }

    const parentCategory = await Category.findOne({ name: parent_name });
    if (parent_name !== '' && !parentCategory) {
        return next(new AppError(StatusCodes.NOT_FOUND, `Parent category ${parent_name} not found!`));
    }

    if (name === parentCategory?.name) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Category name and parent category name cannot be the same!"));
    }

    category.name = name;
    category.parent_id = parentCategory ? parentCategory._id as mongoose.Types.ObjectId : undefined;

    await category.save();
    res.status(StatusCodes.OK).redirect("/admin/categories");
});

export const createCategory = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, parent_name } = req.body;

        if (name === "") {
            return next(new AppError(StatusCodes.BAD_REQUEST, "Name cannot be empty!"));
        }
        
        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return next(new AppError(StatusCodes.BAD_REQUEST, `Category ${name} already exists!`));
        }

        const parentCategory = await Category.findOne({ name: parent_name });
        if (parent_name !== '' && !parentCategory) {
            return next(new AppError(StatusCodes.NOT_FOUND, `Parent category ${parent_name} not found!`));
        }

        if (name === parentCategory?.name) {
            return next(new AppError(StatusCodes.BAD_REQUEST, "Category name and parent category name cannot be the same!"));
        }

        const category = await Category.create({ name, parent_id: parentCategory?._id });
        res.status(StatusCodes.OK).redirect("/admin/categories");
    }
);

export const deleteCategory = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        if (!category) {
            return next(new AppError(StatusCodes.NOT_FOUND, "Category not found!"));
        }
        
        await Category.deleteMany({ parent_id: categoryId });
        await Category.deleteMany({ _id: categoryId });
        res.status(StatusCodes.OK).redirect("/admin/categories");
    }
);

export const getCategoryArticleList = async (categoryName: string) => {
    if (!categoryName) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Please provide a category!");
    }

    const category = await Category.findOne({ name: categoryName });
    if (!category) {
        throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
    }

    const articles = await Article.find({ category_id: category._id })
                                .populate("category_id")
                                .populate("writer_id")
                                .sort({ is_premium: -1, created_at: -1 });

    return {
        message: "Successfully got category article list",
        data: {
            category: categoryName,
            articles: articles
        }
    };
};

export async function getCategories(req: Request, res: Response) {
    try {
        const categories = await getAllCategoriesTree();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories' });
    }
}