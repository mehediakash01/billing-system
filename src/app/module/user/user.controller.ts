import { Request, Response } from 'express';

import { UserServices } from './user.service';
import { catchAsync } from '../../utils/CatchAsync';
import { sendResponse } from '../../utils/SendResponse';

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.registerUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully!',
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.loginUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User authenticated successfully!',
    data: result,
  });
});

export const UserControllers = { registerUser, loginUser };