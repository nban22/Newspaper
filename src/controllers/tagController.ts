import { Request, Response, NextFunction } from "express";
import Article from "../models/article";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/AppError";
// import 

// export const getTagArticleList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const tag = req.params.tagName;
//     if (!tag) {
//         return next(new AppError(StatusCodes.BAD_REQUEST, "Please provide a tag name"));
//     }

//     const articles = await Article.find({ tags: })
// })