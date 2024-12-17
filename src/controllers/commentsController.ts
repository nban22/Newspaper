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


    // Kiểm tra đầu vào
    if (!content) {
        return next(new AppError(400, "Content is required"));
    }

    // Kiểm tra xem article_id có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(article_id)) {
        return next(new AppError(400, "Invalid article_id"));
    }

    // Tạo bình luận mới
    const newComment = await Comment.create({
        article_id: article_id, // Sử dụng article_id từ params
        user_id: user_id || null, // Gán null nếu không có user_id (guest user)
        content: content,
        create_at: new Date(),
    });

    // Trả về response
    res.status(201).json({
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
