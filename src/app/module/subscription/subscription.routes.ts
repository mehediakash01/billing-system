import express from 'express';
import { auth } from '../../middlewares/auth';

import { purchaseSubscriptionValidationSchema } from './subscription.validation';
import { SubscriptionControllers } from './subscription.controller';
import { validateRequest } from '../../middlewares/ValidateRequest';

const router = express.Router();

router.post(
  '/purchase',
  auth('client'),
  validateRequest(purchaseSubscriptionValidationSchema),
  SubscriptionControllers.purchaseSubscription
);

router.patch('/:id/cancel', auth('client'), SubscriptionControllers.cancelSubscription);

export const SubscriptionRoutes = router;