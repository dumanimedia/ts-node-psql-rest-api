import { Request } from 'express';
import { Post } from '@prisma/client';

export type NewJwtPayload = { id: string; iat: number; exp: number };

export type CustomUserReq = Request & {
  userId: string;
};

export type CustomAuthorReq = Request & {
  authorId: string;
};

export type PostReq = Request & {
  post: Post;
};
