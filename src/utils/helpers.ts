import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const hashPassword = (password: string) => bcrypt.hash(password, 10);

export const checkPassword = (inputPassword: string, hashedPassword: string) =>
  bcrypt.compare(inputPassword, hashedPassword);

export const generateToken = (res: Response, userInfo: { id: string }) => {
  let token = jwt.sign({ ...userInfo }, process.env.JWT_SECRET!, {
    expiresIn: '3d',
  });
  res.cookie('ts-node', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: true,
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });
};

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET);
