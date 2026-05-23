import { Request, Response } from 'express';
import crypto from 'crypto';
import { AppError } from '../../errors/AppError';
import { catchAsync } from '../../utils/CatchAsync';
import { Subscription } from '../subscription/subscription.model';
import config from '../../config/index';

const calculateWebhookSignature = (payload: unknown) => {
  return crypto
    .createHmac('sha256', config.webhook.secret as string)
    .update(JSON.stringify(payload))
    .digest('hex');
};

const handlePaymentWebhook = catchAsync(async (req: Request, res: Response) => {
  const webhookSecret = req.headers['x-webhook-signature'];
  if (!config.webhook.secret || !webhookSecret || webhookSecret !== calculateWebhookSignature(req.body)) {
    throw new AppError(401, 'Unauthorized or counterfeit webhook origin source signature detected.');
  }

  const { event, data } = req.body;
  const { subscriptionId } = data;

  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    throw new AppError(404, 'Webhook event targets an unresolvable subscription entity.');
  }

  if (event === 'payment.failed') {
    subscription.status = 'expired'; // Revoke access privileges upon invoice failures
    await subscription.save();
  } else if (event === 'payment.succeeded') {
    // Extend duration parameters on renewal confirmation signals
    const activeDateExtension = new Date(subscription.expiryDate);
    activeDateExtension.setDate(activeDateExtension.getDate() + 30);
    subscription.expiryDate = activeDateExtension;
    subscription.status = 'active';
    await subscription.save();
  }

  res.status(200).json({ success: true, message: 'Webhook context cataloged and synchronized.' });
});

export const WebhookControllers = { handlePaymentWebhook };