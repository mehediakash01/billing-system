import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/index.js';
import { AppError } from '../errors/AppError.js';
import { catchAsync } from '../utils/CatchAsync.js';


export const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError(401, 'You are not authorized to access this resource.');
    }

    const decoded = jwt.verify(token, config.jwt.secret as string) as JwtPayload;
    const { role } = decoded;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(403, 'Forbidden access privilege level.');
    }

    req.user = decoded;
    next();
  });
};