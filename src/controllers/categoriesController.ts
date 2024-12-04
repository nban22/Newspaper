import { Request, Response, NextFunction } from "express";
import Category from "../models/category";
import Article from "../models/article";
import catchAsync from "../utils/catchAsync";
import GlobalError from "../utils/GlobalError";


export const getTopCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  // Get top 10 categories with most articles
  const categoriesWithCounts = await Article.aggregate([
    { $group: { _id: "$category_id", articleCount: { $sum: 1 } } },
    { $sort: { articleCount: -1 } }, 
    { $limit: 10 } 
  ]);

  const topCategoryIds = categoriesWithCounts.map(item => item._id);
  const topCategories = await Category.find({ '_id': { $in: topCategoryIds } });

  // If no categories found
  if (!topCategories || topCategories.length === 0) {
    return next(new GlobalError(404, "No categories found!"));
  }

  const categoriesWithArticles = await Promise.all(
    topCategories.map(async (category) => {
      const articles = await Article.find({ category_id: category._id })
        .populate("author_id", "fullname pen_name") // Populate author info
        .populate("category_id", "name") // Populate category info
        .limit(3); // Limit to 3 articles per category
      return { category, articles };
    })
  );


  res.status(200).render("categories", { categoriesWithArticles });
});

export const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  // Check if category already exists
  const existingCategory = await Category.findOne({name}); 
  if (existingCategory) {
    return next(new GlobalError(400, "Category already exists!"));
  }

  const category = await Category.create({ name });
  res.status(201).json({ status: "success", data: { category } });
});
