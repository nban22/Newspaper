import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { StatusCodes } from "http-status-codes";
import WriterProfile from "../models/writerProfile";
import EditorProfile from "../models/editorProfile";
import SubscriberProfile from "../models/subscriberProfile";
import validator from "validator";
import Category from "../models/category";

export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    if (!users) {
        return next(new AppError(StatusCodes.NOT_FOUND, "No users found!"));
    }

    // i want to create user profile array
    const userProfiles: any[] = [];

    for (let i = 0; i < users.length; i++) {
        if (users[i].role === "writer") {
            const writerProfile = await WriterProfile.findOne({ user_id: users[i]._id });
            if (!writerProfile) {
                return next(new AppError(StatusCodes.NOT_FOUND, `No writer profile found for user with email: ${users[i].email}!`));
            }
            userProfiles.push({
                email: users[i].email,
                role: users[i].role,
                full_name: writerProfile.full_name,
                pen_name: writerProfile.pen_name,
                dob: writerProfile.dob, 
                avatar: writerProfile.avatar,
            });            
        } else if (users[i].role === "editor") {
            const editorProfile = await EditorProfile.findOne({ user_id: users[i]._id });
            if (!editorProfile) {
                return next(new AppError(StatusCodes.NOT_FOUND, `No editor profile found for user with email: ${users[i].email}!`));
            }
            userProfiles.push({
                email: users[i].email,
                role: users[i].role,
                full_name: editorProfile.full_name,
                dob: editorProfile.dob, 
                avatar: editorProfile.avatar,
            });
        } else if (users[i].role === "subscriber") {
            const subscriberProfile = await SubscriberProfile.findOne({ user_id: users[i]._id });
            if (!subscriberProfile) {
                return next(new AppError(StatusCodes.NOT_FOUND, `No subscriber profile found for user with email: ${users[i].email}!`));
            }
            userProfiles.push({
                email: users[i].email,
                role: users[i].role,
                full_name: subscriberProfile.full_name,
                dob: subscriberProfile.dob, 
                avatar: subscriberProfile.avatar,
            });
        }
    }

    res.status(StatusCodes.OK).json({
        status: "success",
        data: {
            users: userProfiles,
        },
    });
});

export const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {email, password, role, full_name, pen_name, dob, avatar} = req.body;
   // Check if all required fields are filled
    if (!email || !password || !role) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Please provide email, password and role"));
    }

    // Check email format
    if (!validator.isEmail(email)) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Email is not valid"));
    }

    const validRoles = ["admin", "writer", "subscriber", "editor"];

    if (!validRoles.includes(role)) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Role must be one of the following: admin, writer, subscriber, editor"));
    }


    // Check if user already exists
    if (await User.findOne({ email: email })) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "User already exists"));
    }

    // Create new user
    const newUser = await User.create({ email, password, role });
    newUser.password = undefined;

    if (role === "subscriber") {
        await SubscriberProfile.create({
            user_id: newUser._id,
            full_name: full_name,
            dob: dob,
            avatar: avatar,
        });
    } else if (role === "writer") {
        await WriterProfile.create({
            user_id: newUser._id,
            full_name: full_name,
            pen_name: pen_name,
            dob: dob,
            avatar: avatar,
        });
    } else if (role === "editor") {
        await EditorProfile.create({
            user_id: newUser._id,
            full_name: full_name,
            dob: dob,
            avatar: avatar,
        });
    }

    res.status(StatusCodes.CREATED).json({
        status: "success",
        data: {
            user: newUser,
        },
    });
});

export const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new AppError(StatusCodes.NOT_FOUND, "No user found with that ID!"));
    }

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});

export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, role,  full_name, pen_name, subscription_status, dob, avatar } = req.body;

    // at least one field must be provided
    if (!email && !password && !role && !full_name && !pen_name && !subscription_status && !dob && !avatar) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Please provide at least one field to update"));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new AppError(StatusCodes.NOT_FOUND, "No user found with that ID!"));
    }

    await User.findByIdAndUpdate(req.params.id, {
        email: email || user.email,
        password: password || user.password,
        role: role || user.role,
    }, { runValidators: true });

    let profile: any;

    if (user.role === "writer") {
        profile = await WriterProfile.findOne({ user_id: req.params.id });
    } else if (user.role === "editor") {
        profile = await EditorProfile.findOne({ user_id: req.params.id });
    } else if (user.role === "subscriber") {
        profile = await SubscriberProfile.findOne({ user_id: req.params.id });
    }

    if (!profile) {
        return next(new AppError(StatusCodes.NOT_FOUND, `No profile found for user`));
    }

    await profile.updateOne({
        full_name: full_name || profile.full_name,
        pen_name: pen_name || profile.pen_name,
        subscription_status: subscription_status || profile.subscription_status,
        dob: dob || profile.dob,
        avatar: avatar || profile.avatar,
    }, { runValidators: true });


    res.status(StatusCodes.OK).json({
        status: "success"
    });
});

export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new AppError(StatusCodes.NOT_FOUND, "No user found with that ID!"));
    }

    await User.findByIdAndDelete(req.params.id);

    let profile: any;

    if (user.role === "writer") {
        profile = await WriterProfile.findOne({ user_id: req.params.id });
    } else if (user.role === "editor") {
        profile = await EditorProfile.findOne({ user_id: req.params.id });
    } else if (user.role === "subscriber") {
        profile = await SubscriberProfile.findOne({ user_id: req.params.id });
    }

    // if (!profile) {
    //     return next(new AppError(StatusCodes.NOT_FOUND, `No profile found for user`));
    // }

    await profile?.deleteOne();

    res.status(StatusCodes.OK).json({
        status: "success"
    });
});


export const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId, ...updateData } = req.body;
    const user = await User.findOne({ _id: userId });

    if (!user) {
        return next(new AppError(StatusCodes.NOT_FOUND, "No user found with that ID!"));
    }

    let profile: any;

    if (user.role === "writer") {
        profile = await WriterProfile.findOne({ user_id: userId });
    } else if (user.role === "editor") {
        profile = await EditorProfile.findOne({ user_id: userId });
    } else if (user.role === "subscriber") {
        profile = await SubscriberProfile.findOne({ user_id: userId });
    }

    if (!profile) {
        return next(new AppError(StatusCodes.NOT_FOUND, `No profile found for user`));
    }

    try {
        await profile.updateOne(updateData);
        
        let updatedProfile: any;
        if (user.role === "writer") {
            updatedProfile = await WriterProfile.findOne({ user_id: userId });
        } else if (user.role === "editor") {
            updatedProfile = await EditorProfile.findOne({ user_id: userId });
        } else if (user.role === "subscriber") {
            updatedProfile = await SubscriberProfile.findOne({ user_id: userId });
        }

        res.status(StatusCodes.OK).json({
            status: "success",
            profile: updatedProfile,
            data: {
            },
        });
    } catch (err) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Failed to update profile!"));
    }
});


export const assignCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { editorId, categoryId } = req.body;
    const user = await User.findOne({ _id: editorId, role: "editor" });

    if (!user) {
        return next(new AppError(StatusCodes.NOT_FOUND, "No user found with that ID!"));
    }

    const category = await Category.findOne({ _id: categoryId });

    if (!category) {
        return next(new AppError(StatusCodes.NOT_FOUND, "No category found with that ID!"));
    }

    let profile: any;

    if (user.role === "editor") {
        profile = await EditorProfile.findOne({ user_id: editorId });
    }

    if (!profile) {
        return next(new AppError(StatusCodes.NOT_FOUND, `No profile found for user`));
    } 

    try {
        await profile.updateOne({ category_id: categoryId });
        
        let updatedProfile = await EditorProfile.findOne({ user_id: editorId });

        res.status(StatusCodes.OK).json({
            status: "success",
            profile: updatedProfile,
            data: {
            },
        });
    } catch (err) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Failed to assign category!"));
    }  
});
