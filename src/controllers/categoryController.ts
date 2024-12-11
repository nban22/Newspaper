import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Category from "../models/category";
import AppError from "../utils/AppError";
import { StatusCodes } from "http-status-codes";
import Article from "../models/article";
import mongoose from "mongoose";

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

export const getTopCategories = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        // Get top 10 categories with most articles
        const categoriesWithCounts = await Article.aggregate([
            { $group: { _id: "$category_id", articleCount: { $sum: 1 } } },
            { $sort: { articleCount: -1 } },
            { $limit: 10 },
        ]);

        const topCategoryIds = categoriesWithCounts.map((item) => item._id);
        const topCategories = await Category.find({ _id: { $in: topCategoryIds } });

        // If no categories found
        if (!topCategories || topCategories.length === 0) {
            return next(new AppError(404, "No categories found!"));
        }

        const categoriesWithArticles = await Promise.all(
            topCategories.map(async (category) => {
                const articles = await Article.find({ category_id: category._id })
                    .populate("writer_id", "fullname pen_name") // Populate writer info
                    .populate("category_id", "name") // Populate category info
                    .limit(3); // Limit to 3 articles per category
                return { category, articles };
            })
        );

        res.status(200).render("categories", { categoriesWithArticles });
    }
);

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

export const getCategoryArticleList = async (category: string) => {
    if (!category) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Please provide a category!");
    }

    const categoryId = await Category.findOne({ name: category });
    if (!categoryId) {
        throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
    }

    const articles = await Article.find({ category_id: categoryId })
                                .populate("category_id")
                                .populate("writer_id")
                                .sort({ is_premium: -1, created_at: -1 });

    return {
        message: "Successfully got category article list",
        data: {
            category: category,
            articles: articles
        }
    };
};