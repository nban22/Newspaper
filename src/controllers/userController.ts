import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import catchAsync from "../utils/catchAsync";
import GlobalError from "../utils/GlobalError";

export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    if (!users) {
        return next(new GlobalError(404, "No users found!"));
    }

    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users,
        },
    });
});

export const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { full_name, pen_name,  email, password, role, dob} = req.body;
    
    const newUser = await User.create({
        full_name,
        pen_name,
        email,
        password,
        role,
        dob
    });

    if (!newUser) {
        return next(new GlobalError(400, "Invalid data provided!"));
    }

    // res.status(201).json({
    //     status: "success",
    //     data: {
    //         user: newUser,
    //     },
    // });

    res.status(201).redirect("/");

});

export const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new GlobalError(404, "No user found with that ID!"));
    }

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});

export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        return next(new GlobalError(404, "No user found with that ID!"));
    }

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});

export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new GlobalError(404, "No user found with that ID!"));
    }

    res.status(204).json({
        status: "success",
        data: {
            user: null,
        }
    });
});


export const updateUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
        req.body.avatar = `/uploads/${req.file.filename}`;
    }

    console.log(req.body);

    const user = await User.findByIdAndUpdate
    (req.params.id, req.body, {
        new: true,
        runValidators: true,
    });


    res.status(200).json({
        status: "success",
        data: {
            user,
        }   
    });
});
