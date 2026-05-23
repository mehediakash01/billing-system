import { Types, Document } from 'mongoose';

export interface TSubscription extends Document {
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  price: number;
  status: 'active' | 'cancelled' | 'expired' | 'upgraded';
  startDate: Date;
  expiryDate: Date;
  autoRenew: boolean;
}