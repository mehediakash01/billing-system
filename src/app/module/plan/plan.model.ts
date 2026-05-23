import { Schema, model } from 'mongoose';
import { TPlan } from './plan.interface';

const PlanSchema = new Schema<TPlan>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    durationInDays: { type: Number, required: true, min: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Plan = model<TPlan>('Plan', PlanSchema);