import { Schema, model } from 'mongoose';
import { TSubscription } from './subscription.interface';

const SubscriptionSchema = new Schema<TSubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'upgraded'],
      default: 'active',
    },
    startDate: { type: Date, required: true, default: Date.now },
    expiryDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// High-Performance compound lookups index optimization mapping strategies
SubscriptionSchema.index({ userId: 1, status: 1 });

export const Subscription = model<TSubscription>('Subscription', SubscriptionSchema);