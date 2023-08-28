import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { verifyToken } from '../utils/helpers.js';

import {
  CustomUserReq,
  CustomAuthorReq,
  NewJwtPayload,
  PostReq,
} from '../utils/types.js';
import { prisma } from '../lib/prismaDb.js';

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

    const verified = verifyToken(token);

    if (!verified) {
      res.status(401);
      throw new Error('Not authorized, Invalid token!');
    }

    (req as CustomUserReq).userId = (verified as NewJwtPayload).id;

    next();
  }
);

const isStaffMember = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as CustomUserReq).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { author: { select: { id: true } } },
    });

    if (!user) {
      res.status(404);
      throw new Error('Invalid user credentials!');
    }

    if (user.author === null) {
      res.status(401);
      throw new Error('User not An Author!');
    }

    (req as CustomAuthorReq).authorId = user.author.id;
    next();
  }
);

const isPostOwner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = (req as CustomAuthorReq).authorId;
    const postId = req.params['postId'];

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      res.status(404);
      throw new Error('Post not Found in the Database!');
    }

    const author = await prisma.author.findUnique({
      where: { id: authorId },
      select: { id: true },
    });

    if (post.authorId !== author.id) {
      res.status(401);
      throw new Error('You are not the creator of the post');
    }

    (req as PostReq).post = post;
    next();
  }
);

export { notFound, errorHandler, loginRequired, isStaffMember, isPostOwner };
