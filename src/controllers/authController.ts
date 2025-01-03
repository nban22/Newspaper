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
import { isRequired } from "../utils/validation";
import Email from "../utils/Email";
import crypto from "crypto";

export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return next(
            new AppError(StatusCodes.BAD_REQUEST, "Vui lòng cung cấp email, mật khẩu và vai trò")
        );
    }

    if (!validator.isEmail(email)) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Email không hợp lệ"));
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
        return next(new AppError(StatusCodes.BAD_REQUEST, "Email đã tồn tại"));
    }

    // Create new user
    const newUser = await User.create({ email, password, role, loginMethod: "local" });
    newUser.password = undefined;

    if (role === "subscriber") {
        await SubscriberProfile.create({ user_id: newUser._id });
    } else if (role === "writer") {
        await WriterProfile.create({ user_id: newUser._id , pen_name: "Anonymous" });
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
        return next(new AppError(StatusCodes.BAD_REQUEST, "Vui lòng cung cấp email và mật khẩu"));
    }

    // Check if user exists
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Người dùng không tồn tại"));
    }

    // Check if password is correct
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, "Mật khẩu không chính xác"));
    }
    const accessTokenStr = accessToken(user);

    if (user.role === "subscriber") {
        const subscriberProfile = await SubscriberProfile.findOne({ user_id: user._id });
        if (!subscriberProfile) {
            return next(new AppError(StatusCodes.NOT_FOUND, "Độc giả không tồn tại"));
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

export const forgotPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;
        isRequired(email, "email");

        if (!validator.isEmail(email)) {
            return next(new AppError(StatusCodes.BAD_REQUEST, "Email is not valid"));
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return next(new AppError(StatusCodes.NOT_FOUND, `No user found with email: ${email}`));
        }

        const resetCode = user.getPasswordResetCode();
        await new Email(email).sendPasswordResetCode(resetCode);

        res.status(StatusCodes.OK).json({
            status: "success",
            data: null,
            message: "Password reset code has been sent to your email",
        });
    }
);

export const verifyResetCode = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, resetCode } = req.body;
        isRequired(email, "email");
        isRequired(resetCode, "resetCode");

        if (!validator.isEmail(email)) {
            return next(new AppError(StatusCodes.BAD_REQUEST, "Email is not valid"));
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return next(new AppError(StatusCodes.NOT_FOUND, `No user found with email: ${email}`));
        }

        if (user.getPasswordResetCode() !== resetCode) {
            return next(new AppError(StatusCodes.BAD_REQUEST, "Invalid reset code"));
        }

        const resetToken = user.createPasswordResetToken();
        await user.save();

        res.status(StatusCodes.SEE_OTHER).json({
            status: "success",
            data: {
                redirectUrl: `/reset_password?resetToken=${resetToken}&email=${email}`,
            }
        });
    }
);

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { resetToken, password, email } = req.body;

    isRequired(email, "email");
    isRequired(resetToken, "resetToken");
    isRequired(password, "password");

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");


    const user = await User.findOne({
        email: email,
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        return next(new AppError(StatusCodes.NOT_FOUND, "User not found or reset token has expired"));
    }

    user.password = password;
    user.passwordResetCode = undefined;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(StatusCodes.OK).json({
        status: "success",
        data: null,
        message: "Password has been reset successfully",
    });
});


export const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;
    isRequired(currentPassword, "currentPassword");
    isRequired(newPassword, "newPassword");

    const user = await User.findById(req.body.userId).select("+password");

    if (!user) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Người dùng không tồn tại"));
    }

    if (!(await bcrypt.compare(currentPassword, user.password!))) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, "Mât khẩu hiện tại không chính xác"));
    }

    user.password = newPassword;

    await user.save();

    res.status(StatusCodes.OK).json({
        status: "success",
        data: null,
        message: "Password has been changed successfully",
    });
});