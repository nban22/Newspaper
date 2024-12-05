import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";


export const facebookCallback = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
});