import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import SubscriberProfile from '../models/subscriberProfile';
import User from '../models/user';


export const renewalSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;

    const subscriber = await SubscriberProfile.findOne({user_id: userId});

    if (!subscriber) {
        return next(new AppError(StatusCodes.NOT_FOUND, 'Subscriber not found'));
    }

    subscriber.expiryDate = new Date();
    subscriber.subscription_status = 'active';
    await subscriber.save();
    res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Subscription renewed successfully',
    });
});

export const registerPremium = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;
    const { user } = req.body;
    const { password } = req.body;

    if (user && user.role !== 'subscriber') {
        return next(new AppError(StatusCodes.UNAUTHORIZED, 'Bạn không phải là người dùng đăng ký tài khoản premium'));
    }

    const subscriber = await SubscriberProfile.findOne({user_id: userId});

    if (!subscriber) {
        return next(new AppError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng'));
    }
    
    const userWithPassword = await User.findOne({ _id: userId }).select('+password');
    const isPasswordCorrect = await userWithPassword?.correctPassword(password);
    
    if (!isPasswordCorrect) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, 'Mật khẩu không chính xác'));
    }

    subscriber.subscription_status = 'active';
    await subscriber.save();
    res.status(StatusCodes.OK).json({
        status: 'success',
        // tiếng việt
        message: "Đăng ký tài khoản premium thành công",
    });
});