import { Request } from "express";

export type NewJwtPayload = { id: string; iat: number; exp: number };

export type CustomUserReq = Request & {
  userId: string;
};
