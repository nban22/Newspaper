import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import AppError from "../utils/AppError";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catchAsync";
import mongoose from "mongoose";

export const attachUserId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : null;

    if (!process.env.JWT_ACCESS_SECRET) {
        return next(
            new AppError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "The JWT_ACCESS_SECRET variable is not defined"
            )
        );
    }

    let decode: any;
    try {
        decode = jwt.verify(accessToken!, process.env.JWT_ACCESS_SECRET!);
    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            return next(new AppError(StatusCodes.UNAUTHORIZED, "accessToken expired"));
        } else {
            return next(new AppError(StatusCodes.UNAUTHORIZED, "Invalid accesstoken"));
        }
    }
    const userId = decode.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, "userId in accesstoken is not valid"));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, "User in accesstoken is not valid"));
    }

    // Grant access to protected route
    req.body.user = user;
    req.body.userId = userId;
    req.body.accessToken = accessToken;

    next();
});

export const authenticateJWT = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!process.env.JWT_ACCESS_SECRET) {
            return next(
                new AppError(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    "The JWT_ACCESS_SECRET variable is not defined"
                )
            );
        }
        const accessToken = req.cookies?.accessToken;

        if (!accessToken) {
            req.body.user = null;
            return next();
        }

        let decode: any;
        try {
            decode = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        } catch (err: any) {
            if (err.name === "TokenExpiredError") {
                req.body.user = null;
                return next();
            } else {
                return next(new AppError(StatusCodes.UNAUTHORIZED, `Invalid accesstoken with error name ${err.name}`));
            }
        }

        const userId = decode.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            req.body.user = null;
            return next();
        }

        const user = await User.findById(userId);
        if (!user) {
            req.body.user = null;
            return next();
        }

        // Grant access to protected route
        req.body.user = user;
        req.body.userId = userId;
        req.body.accessToken = accessToken;

        next();
    }
);

type Role = "writer" | "editor" | "subscriber" | "admin";

export const authorizeRole = (roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.user) {
            return next(
                new AppError(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    "attachUserId middleware must be called before authorizeRole middleware"
                )
            );
        }
        if (!roles.includes(req.body.user.role)) {
            return next(
                new AppError(
                    StatusCodes.FORBIDDEN,
                    "You do not have permission to perform this action"
                )
            );
        }
        next();
    };
};
