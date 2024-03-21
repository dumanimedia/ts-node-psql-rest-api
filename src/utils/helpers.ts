import bcrypt from "bcryptjs";
import slugify from "slugify";
import jwt from "jsonwebtoken";
import { Response } from "express";

export const hashPassword = (password: string) => bcrypt.hash(password, 10);

export const checkPassword = (inputPassword: string, hashedPassword: string) =>
  bcrypt.compare(inputPassword, hashedPassword);

export const generateToken = (res: Response, userInfo: { id: string }) => {
  let token = jwt.sign({ ...userInfo }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
  res.cookie(process.env.TOKEN_NAME || "ts-node", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET as string);

export const slugifyText = (text: string) =>
  slugify(text, { lower: true, trim: true, remove: /[*+~.:(),?/$#%^&'"!:@]/g });
