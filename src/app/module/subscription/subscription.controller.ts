import { Request, Response } from 'express';

import { SubscriptionServices } from './subscription.service';
import { catchAsync } from '../../utils/CatchAsync';
import { sendResponse } from '../../utils/SendResponse';

const purchaseSubscription = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { planId, autoRenew } = req.body;

  const result = await SubscriptionServices.purchaseSubscriptionService(userId, planId, autoRenew);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Subscription contract purchased successfully!',
    data: result,
  });
});

const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id: subscriptionId } = req.params;

  const result = await SubscriptionServices.cancelSubscriptionService(userId, subscriptionId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription contract set to cancel successfully.',
    data: result,
  });
});

export const SubscriptionControllers = { purchaseSubscription, cancelSubscription };