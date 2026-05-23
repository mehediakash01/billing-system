import { z } from 'zod';

export const purchaseSubscriptionValidationSchema = z.object({
  body: z.object({
    planId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB hexadecimal ObjectID identifier format'),
    autoRenew: z.boolean().optional(),
  }),
});