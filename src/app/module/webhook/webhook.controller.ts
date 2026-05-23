import { Request, Response } from 'express';
import { AppError } from '../../errors/AppError.js';
import { catchAsync } from '../../utils/CatchAsync.js';
import { Subscription } from '../subscription/subscription.model.js';

const handlePaymentWebhook = catchAsync(async (req: Request, res: Response) => {
  // Webhook validation handshake auth checks (Emulating real stripe/bintray signatures)
  const webhookSecret = req.headers['x-webhook-signature'];
  if (!webhookSecret || webhookSecret !== 'secure_gateway_handshake_hash_999') {
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