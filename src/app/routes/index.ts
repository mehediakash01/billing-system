import express from 'express';
import { UserRoutes } from '../module/user/user.routes';
import { PlanRoutes } from '../module/plan/plan.routes';
import { SubscriptionRoutes } from '../module/subscription/subscription.routes';
import { WebhookRoutes } from '../module/webhook/webhook.routes';

const router = express.Router();

const moduleRoutes = [
  { path: '/auth', route: UserRoutes },
  { path: '/plans', route: PlanRoutes },
  { path: '/subscriptions', route: SubscriptionRoutes },
  { path: '/webhooks', route: WebhookRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;