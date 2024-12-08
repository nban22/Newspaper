import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import User from "../models/user";
import validator from "validator";
import bcrypt from "bcrypt";
import { accessToken, createSendToken, refreshToken } from "../utils/tokenServices";
import SubscriberProfile from "../models/subscriberProfile";
import WriterProfile from "../models/writerProfile";
import EditorProfile from "../models/editorProfile";


export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return next(
            new AppError(StatusCodes.BAD_REQUEST, "Please provide email, password and role")
        );
    }

    if (!validator.isEmail(email)) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Email is not valid"));
    }

    const validRoles = ["admin", "writer", "subscriber", "editor"];

    if (!validRoles.includes(role)) {
        return next(
            new AppError(
                StatusCodes.BAD_REQUEST,
                "Role must be one of the following: admin, writer, subscriber, editor"
            )
        );
    }

    // Check if user already exists
    if (await User.findOne({ email: email })) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "User already exists"));
    }

    // Create new user
    const newUser = await User.create({ email, password, role, loginMethod: "local" });
    newUser.password = undefined;

    if (role === "subscriber") {
        await SubscriberProfile.create({ user_id: newUser._id });
    } else if (role === "writer") {
        await WriterProfile.create({ user_id: newUser._id });
    } else if (role === "editor") {
        await EditorProfile.create({ user_id: newUser._id });
    }

    res.status(StatusCodes.CREATED).json({
        status: "success",
        data: {
            user: newUser,
        },
    });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Please provide email and password"));
    }

    // Check if user exists
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Email is not found"));
    }

    // Check if password is correct
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, "Wrong password"));
    }
    const accessTokenStr = accessToken(user);

    if (user.role === "subscriber") {
        const subscriberProfile = await SubscriberProfile.findOne({ user_id: user._id });
        if (!subscriberProfile) {
            return next(new AppError(StatusCodes.NOT_FOUND, "No subscriber profile found!"));
        }
        
        if (new Date() > subscriberProfile.expiryDate) {
            subscriberProfile.subscription_status = "expired";
            await subscriberProfile.save();
        }
    }

    // res.cookie("refreshToken", refreshTokenStr, {
    //     expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    //     httpOnly: true,
    // });
    res.cookie("accessToken", accessTokenStr, {
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
        httpOnly: true,
        path: "/",
    });

    user.password = undefined;

    res.status(StatusCodes.OK).json({
        status: "success",
        data: {
            user,
            accessToken: accessTokenStr,
        },
    });
});

export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("accessToken", "", {
        expires: new Date(Date.now() + 1),
        httpOnly: true,
        path: "/",
    });
    res.redirect("/");
});
