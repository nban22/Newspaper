import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import SubscriberProfile from '../models/subscriberProfile';


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