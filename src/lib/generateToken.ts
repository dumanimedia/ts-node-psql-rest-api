import { Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

const SECRET_KEY: Secret = process.env.JWT_SECRET!;

export function generateToken(userId: string, res: Response) {
  const token = jwt.sign(userId, SECRET_KEY, {
    expiresIn: '3d',
  });

  res.cookie('ts-node', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: true,
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });
}
