import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

import { CustomReq, NewJwtPayload } from '../utils/types.js';

const notFound = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(404);
    throw new Error(`Route not found - ${req.originalUrl}`);
  }
);

async function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message;
  const stack = process.env.NODE_ENV === 'development' ? err.stack : '';

  res.status(statusCode).json({
    message,
    stack,
  });
}

const loginRequired = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['ts-node'];

    if (token === undefined || token === '') {
      res.status(401);
      throw new Error('Not authorized, No token!');
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET!);
    if (!verified) {
      res.status(401);
      throw new Error('Not authorized, Invalid token!');
    }

    (req as CustomReq).userId = (verified as NewJwtPayload).id;

    next();
  }
);

export { notFound, errorHandler, loginRequired };
