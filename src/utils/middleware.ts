import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

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
  const stack = process.env.NODE_ENV === "development" ? err.stack : "";

  res.status(statusCode).json({
    message,
    stack,
  });
}

export { notFound, errorHandler };
