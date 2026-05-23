import { Request, Response } from 'express';

import { PlanServices } from './plan.service';
import { sendResponse } from '../../utils/SendResponse';
import { catchAsync } from '../../utils/CatchAsync';

const createPlan = catchAsync(async (req: Request, res: Response) => {
  const result = await PlanServices.createPlanIntoDB(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Subscription tier plan created successfully!',
    data: result,
  });
});

const getAllPlans = catchAsync(async (req: Request, res: Response) => {
  const result = await PlanServices.getAllPlansFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Active subscription tier plans fetched successfully!',
    data: result,
  });
});

export const PlanControllers = { createPlan, getAllPlans };