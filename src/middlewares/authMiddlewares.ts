import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import GlobalError from '../utils/GlobalError';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync';
import mongoose from 'mongoose';

export const attachUserId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : null;

    if (!accessToken) {
        return next(new GlobalError(StatusCodes.UNAUTHORIZED, "accessToken must be sent into body"));
    }
    if (!process.env.JWT_ACCESS_SECRET) {
        return next(new GlobalError(StatusCodes.INTERNAL_SERVER_ERROR, "The JWT_ACCESS_SECRET variable is not defined"));
    }


    let decode: any;
    try {
        decode = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!);
    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            return next(new GlobalError(StatusCodes.UNAUTHORIZED, "accessToken expired"));
        } else {
            return next(new GlobalError(StatusCodes.UNAUTHORIZED, "Invalid accesstoken"));
        }
    }
    const userId = decode.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new GlobalError(StatusCodes.UNAUTHORIZED, "userId in accesstoken is not valid"));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new GlobalError(StatusCodes.UNAUTHORIZED, "User in accesstoken is not valid"));
    }

    // Grant access to protected route
    req.body.user = user;
    req.body.userId = userId;
    req.body.accessToken = accessToken;

    next();
});


type Role = "writer" | "editor" | "subscriber" | "admin";

export const authorizeRole = (roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.user) {
            return next(new GlobalError(StatusCodes.INTERNAL_SERVER_ERROR, "attachUserId middleware must be called before authorizeRole middleware"));
        }
        if (!roles.includes(req.body.user.role)) {
            return next(new GlobalError(StatusCodes.FORBIDDEN, "You do not have permission to perform this action"));
        }
        next();
    };
}