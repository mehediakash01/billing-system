import mongoose from 'mongoose';
import { AppError } from '../../errors/AppError';

import { TSubscription } from './subscription.interface';
import { Subscription } from './subscription.model';
import { Plan } from '../plan/plan.model';

const purchaseSubscriptionService = async (userId: string, planId: string, autoRenew = true) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const targetPlan = await Plan.findById(planId).session(session);
    if (!targetPlan || !targetPlan.isActive) {
      throw new AppError(404, 'The requested subscription tier target plan is active or invalid.');
    }

    // Identify active plans bound to the requesting account profile configuration layers
    const existingActiveSub = await Subscription.findOne({
      userId,
      status: 'active',
    }).populate('planId').session(session);

    if (existingActiveSub) {
      const activePlanDetails = existingActiveSub.planId as any;

      // Rule Violation Code Block Check 1: Preventing duplicate concurrent matching tier purchases
      if (activePlanDetails._id.toString() === planId) {
        throw new AppError(400, 'You are already currently subscribed actively to this exact tier plan.');
      }

      // Extra Problem-Solving Condition: Upgrades allowed ONLY when target price > active price
      if (targetPlan.price <= activePlanDetails.price) {
        throw new AppError(400, 'Downgrades or lateral swaps to lower-priced tiers are strictly restricted. Please select a premium tier.');
      }

      // Gracefully shift old sub status inside atomic transaction pipelines
      existingActiveSub.status = 'upgraded';
      await existingActiveSub.save({ session });
    }

    // Initialize metrics variables mapping expiry limits
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(startDate.getDate() + targetPlan.durationInDays);

    const newSubscription = await Subscription.create(
      [
        {
          userId,
          planId,
          price: targetPlan.price,
          status: 'active',
          startDate,
          expiryDate,
          autoRenew,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return newSubscription[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cancelSubscriptionService = async (userId: string, subscriptionId: string) => {
  const subscription = await Subscription.findOne({ _id: subscriptionId, userId });

  if (!subscription) {
    throw new AppError(404, 'No active matching subscription parameters found.');
  }
  if (subscription.status !== 'active') {
    throw new AppError(400, `Cannot terminate a subscription that is currently flagged as: ${subscription.status}`);
  }

  subscription.status = 'cancelled';
  subscription.autoRenew = false;
  await subscription.save();

  return subscription;
};

export const SubscriptionServices = {
  purchaseSubscriptionService,
  cancelSubscriptionService,
};