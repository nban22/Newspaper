import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { StatusCodes } from "http-status-codes";
import Comment from "../models/comment";
import mongoose from "mongoose";

export const createComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { content } = req.body;
    const article_id = req.params.articleId;
    const user_id = req.body.userId;

    // Validate input
    if (!content) {
        return next(new AppError(400, "Content is required"));
    }

    // Check if article_id is valid
    if (!mongoose.Types.ObjectId.isValid(article_id)) {
        return next(new AppError(400, "Invalid article_id"));
    }

    // Check if the content is unique for this article
    const existingComment = await Comment.findOne({
        article_id: article_id,
        content: content.trim(),
    });
    
    // Create the new comment
    if (!existingComment) {
    await Comment.create({
        article_id: article_id, // Use article_id from params
        user_id: user_id || null, // Assign null if user_id is not provided (guest user)
        content: content.trim(),
        create_at: new Date(),
    });
    }

    // Return response
    res.status(201).json({
        status: "success",
        message: "Comment created successfully",
    });
});



export const updateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id: commentId } = req.params;
    const { content } = req.body;

    if (!content) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Content is required"));
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Invalid Comment ID format"));
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { content },
        { new: true, runValidators: true }
    );

    if (!updatedComment) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Comment not found"));
    }

    res.status(StatusCodes.OK).json({
        status: "success",
        data: {
            comment: updatedComment,
        },
    });
});

export const deleteComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id: commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Invalid Comment ID format"));
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Comment not found"));
    }

    res.status(StatusCodes.NO_CONTENT).json({
        status: "success",
        data: null,
    });
});
