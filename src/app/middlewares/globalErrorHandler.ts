import { ErrorRequestHandler } from 'express';
import config from '../config/index';
import { logger } from '../utils/logger';

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';
  let errorDetails = err;

  logger.error('Request failed.', {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message,
  });

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val: any) => val.message).join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails: config.env === 'development' ? errorDetails : null,
    stack: config.env === 'development' ? err.stack : null,
  });
};