import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Tag from "../models/tag";
import AppError from "../utils/AppError";
import { StatusCodes } from "http-status-codes";
import Article from "../models/article";
import mongoose from "mongoose";

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
