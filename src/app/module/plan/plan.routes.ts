import express from 'express';
import { auth } from '../../middlewares/auth';

import { PlanControllers } from './plan.controller';
import { createPlanValidationSchema } from './plan.validation';
import { validateRequest } from '../../middlewares/ValidateRequest';

const router = express.Router();

router.post('/', auth('admin'), validateRequest(createPlanValidationSchema), PlanControllers.createPlan);
router.get('/', PlanControllers.getAllPlans);

export const PlanRoutes = router;