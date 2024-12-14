import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { StatusCodes } from "http-status-codes";
import Comment from "../models/comment";
import mongoose from "mongoose";

export const createComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { article_id, content } = req.body;
    const user = req.body.user;

    if (!article_id) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Article ID is required"));
    }

    if (!content) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Content is required"));
    }

    if (!mongoose.Types.ObjectId.isValid(article_id)) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Invalid Article ID format"));
    }

    const newComment = await Comment.create({
        article_id,
        content,
        user_id: user._id,
    });

    res.status(StatusCodes.CREATED).json({
        status: "success",
        data: {
            comment: newComment,
        },
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
