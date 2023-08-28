import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import { prisma } from '../lib/prismaDb.js';

import {
  generateToken,
  hashPassword,
  checkPassword,
} from '../utils/helpers.js';
import { CustomUserReq } from '../utils/types.js';

const fetchAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = req.query['page'] ? Number(req.query['page']) : 1;
  const limit = req.query['limit'] ? Number(req.query['limit']) : 4;

  const usersCount = await prisma.user.count();
  const users = await prisma.user.findMany({
    take: limit,
    skip: (page - 1) * limit,
    select: {
      firstName: true,
      lastName: true,
      maidenName: true,
      username: true,
      email: true,
      author: {
        select: {
          id: true,
        },
      },
    },
  });
  const pageCount = Math.ceil(usersCount / limit);

  res.json({ usersCount, users, pageCount });
});

const signUpAUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    res.status(401);
    throw new Error('All fields are required!');
  }

  const user =
    (await prisma.user.findUnique({ where: { email } })) ||
    (await prisma.user.findUnique({ where: { username } }));

  if (user) {
    res.status(400);
    throw new Error('User with the credentials found in the DB!');
  }

  try {
    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: { email, username, password: hashedPassword },
      include: { author: { select: { id: true } } },
    });

    generateToken(res, { id: newUser.id });

    res.status(201).json({ user: newUser });
  } catch (err: unknown) {
    res.status(400);
    throw new Error((err as Error).message);
  }
});

const signInAUser = asyncHandler(async (req: Request, res: Response) => {
  const { login, password } = req.body;

  if (!login || !password) {
    res.status(400);
    throw new Error('All fields are required!');
  }

  const user =
    (await prisma.user.findUnique({
      where: { email: login },
      include: { author: { select: { id: true } } },
    })) ||
    (await prisma.user.findUnique({
      where: { username: login },
      include: { author: { select: { id: true } } },
    }));

  if (!user) {
    res.status(404);
    throw new Error('Invalid user credentials!');
  }

  const passwordsMatch = await checkPassword(password, user.password);

  if (passwordsMatch === false) {
    res.status(400);
    throw new Error('Invalid user credentials!');
  }
  try {
    generateToken(res, { id: user.id });

    res.status(200).json({ user: user });
  } catch (err: unknown) {
    throw new Error((err as Error).message);
  }
});

const signOutAUser = asyncHandler(async (req: Request, res: Response) => {
  res
    .cookie('ts-node', '', { httpOnly: true, maxAge: 0 })
    .json({ message: 'logout successful' });
});

const getAUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as CustomUserReq).userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      maidenName: true,
      age: true,
      author: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user) {
    res.status(400);
    throw new Error('User not found!');
  }

  res.json({ user });
});

const updateAUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as CustomUserReq).userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    res.status(400);
    throw new Error('User not found!');
  }

  try {
    let updateInfo: Partial<typeof user> = {};
    updateInfo.firstName = req.body.firstName || updateInfo.firstName;
    updateInfo.lastName = req.body.lastName || updateInfo.lastName;
    updateInfo.maidenName = req.body.maidenName || updateInfo.maidenName;
    updateInfo.age = req.body.age || updateInfo.age;

    if (req.body.password) {
      const hashedPassword = await hashPassword(req.body.password);
      updateInfo.password = req.body.password
        ? hashedPassword
        : updateInfo.password;
    }

    let updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { ...updateInfo },
    });

    res.status(200).json({ user: updatedUser });
  } catch (err: unknown) {
    throw new Error((err as Error).message);
  }
});

const deleteAUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as CustomUserReq).userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    res.status(400);
    throw new Error('User not found!');
  }

  try {
    await prisma.user.delete({ where: { id: userId } });

    res.json({ message: 'User deletion successful!' });
  } catch (err: unknown) {
    throw new Error((err as Error).message);
  }
});

export {
  fetchAllUsers,
  signUpAUser,
  signInAUser,
  signOutAUser,
  getAUserById,
  updateAUserById,
  deleteAUserById,
};
