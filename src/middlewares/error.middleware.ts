import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import httpStatusCodes from 'http-status-codes';
import { TErrorSource } from './errors/error';
import handleZodError from './errors/handleZodError';
import handleValidationError from './errors/handleValidationError';
import handleCastError from './errors/handleCastError';
import handleDuplicateError from './errors/handleDuplicateError';
import AppError from './errors/AppError';
import dbConfig from '../config/db.config';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // setting default value
  let statusCode = 500;
  let message = 'Something went wrong';
  let errorSources: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if (error instanceof ZodError) {
    const basicError = handleZodError(error);
    statusCode = basicError?.statusCode ?? httpStatusCodes.BAD_REQUEST; // Set default if undefined
    message = basicError?.message ?? 'Validation Error';
    errorSources = basicError?.errorSources ?? [
      { path: '', message: 'Validation error occurred' },
    ];
  } else if (error?.name === 'ValidationError') {
    const basicError = handleValidationError(error);
    statusCode = basicError?.statusCode ?? httpStatusCodes.BAD_REQUEST;
    message = basicError?.message ?? 'Validation Error';
    errorSources = basicError?.errorSources ?? [
      { path: '', message: 'Validation error occurred' },
    ];
  } else if (error?.name === 'CastError') {
    const basicError = handleCastError(error);
    statusCode = basicError?.statusCode ?? httpStatusCodes.BAD_REQUEST;
    message = basicError?.message ?? 'Invalid ID format';
    errorSources = basicError?.errorSources ?? [
      { path: '', message: 'Invalid ID' },
    ];
  } else if (error?.code === 11000) {
    const basicError = handleDuplicateError(error);
    statusCode = basicError?.statusCode ?? httpStatusCodes.BAD_REQUEST;
    message = basicError?.message ?? 'Duplicate Key Error';
    errorSources = basicError?.errorSources ?? [
      { path: '', message: 'Duplicate key found' },
    ];
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode ?? httpStatusCodes.INTERNAL_SERVER_ERROR;
    message = error.message ?? 'Unknown application error';
    errorSources = [
      {
        path: '',
        message: error?.message ?? 'Unknown error occurred',
      },
    ];
  } else if (error instanceof Error) {
    message = error.message ?? 'Unknown error';
    errorSources = [
      {
        path: '',
        message: error?.message ?? 'Unknown error occurred',
      },
    ];
  }

  //ultimate return
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    error,
    stack: dbConfig.NODE_ENV === 'development' ? error?.stack : null,
  });
};
export default globalErrorHandler;
