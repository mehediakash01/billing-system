import { z } from 'zod';

export const createPlanValidationSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Plan name must be at least 3 characters'),
    price: z.number().nonnegative('Price cannot be negative values'),
    durationInDays: z.number().positive('Duration must contain positive days count'),
    isActive: z.boolean().optional(),
  }),
});