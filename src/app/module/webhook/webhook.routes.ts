import express from 'express';
import { WebhookControllers } from './webhook.controller.js';

const router = express.Router();

router.post('/payment-update', WebhookControllers.handlePaymentWebhook);

export const WebhookRoutes = router;