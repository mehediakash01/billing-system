import express from 'express';
import { WebhookControllers } from './webhook.controller';

const router = express.Router();

router.post('/payment-update', WebhookControllers.handlePaymentWebhook);

export const WebhookRoutes = router;