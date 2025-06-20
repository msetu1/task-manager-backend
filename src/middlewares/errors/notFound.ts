import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatusCodes.NOT_FOUND).json({
    success: false,
    message: 'API Not Found',
    error: '',
  });
  return;
};

export default notFound;
