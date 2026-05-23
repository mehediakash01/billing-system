import { TPlan } from './plan.interface.js';
import { Plan } from './plan.model.js';

const createPlanIntoDB = async (payload: TPlan) => {
  const result = await Plan.create(payload);
  return result;
};

const getAllPlansFromDB = async () => {
  return await Plan.find({ isActive: true });
};

export const PlanServices = { createPlanIntoDB, getAllPlansFromDB };