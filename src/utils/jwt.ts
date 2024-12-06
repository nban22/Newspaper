import { StatusCodes } from "http-status-codes"
import AppError from "./AppError"
import jwt from "jsonwebtoken";


export const generateToken = (user: any) => {
    if (!process.env.JWT_ACCESS_SECRET) {
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "JWT_ACCESS_SECRET not defined");
    }
    return jwt.sign({ id: user._id, loginMethod: user.loginMethod, email: user.email }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "1d",

    })
}

