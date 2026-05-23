import express from 'express';
import { auth } from '../../middlewares/auth.js';

import { PlanControllers } from './plan.controller.js';
import { createPlanValidationSchema } from './plan.validation.js';
import { validateRequest } from '../../middlewares/ValidateRequest.js';

const router = express.Router();

router.post('/', auth('admin'), validateRequest(createPlanValidationSchema), PlanControllers.createPlan);
router.get('/', PlanControllers.getAllPlans);

export const PlanRoutes = router;