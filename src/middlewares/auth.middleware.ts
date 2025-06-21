import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import AppError from './errors/AppError';
import dbConfig from '../config/db.config';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, dbConfig.jwt_access_secret as string);

    if (typeof decoded === 'string') {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token payload');
    }

    req.user = decoded;

    next();
  } catch (error) {
    next(new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'));
  }
};
