import express from 'express';
import { auth } from '../../middlewares/auth.js';

import { purchaseSubscriptionValidationSchema } from './subscription.validation.js';
import { SubscriptionControllers } from './subscription.controller.js';
import { validateRequest } from '../../middlewares/ValidateRequest.js';

const router = express.Router();

router.post(
  '/purchase',
  auth('client'),
  validateRequest(purchaseSubscriptionValidationSchema),
  SubscriptionControllers.purchaseSubscription
);

router.patch('/:id/cancel', auth('client'), SubscriptionControllers.cancelSubscription);

export const SubscriptionRoutes = router;