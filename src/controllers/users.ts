import { db } from "../db";
import { users } from "../db/schema";
import { count, eq } from "drizzle-orm";
import { Request, Response } from "express";
import { CustomUserReq } from "../utils/types";
import { checkPassword, generateToken, hashPassword } from "../utils/helpers";

const fetchAllUsers = async (req: Request, res: Response) => {
  const page = req.query["page"] ? Number(req.query["page"]) : 1;
  const limit = req.query["limit"] ? Number(req.query["limit"]) : 12;

  try {
    const usersCountList = await db
      .select({ value: count(users.id) })
      .from(users);

    const allUsers = await db.query.users.findMany({
      limit,
      offset: (page - 1) * limit,
      columns: {
        createdAt: false,
        UpdatedAt: false,
        password: false,
        bio: false,
        id: false,
      },
    });

    if (!allUsers || allUsers.length < 1) {
      res.status(404);
      throw new Error("No user found in the database!");
    }

    const pagesCount = Math.ceil(usersCountList[0].value / limit);

    res.json({
      pagesCount,
      users: allUsers,
      usersCount: usersCountList[0].value,
    });
  } catch (err: unknown) {
    return res.status(500).json({ message: (err as Error).message });
  }
};

const signUpAUser = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    if (!email || !username || !password) {
      res.status(403);
      throw new Error("All fields are required!");
    }

    const user =
      (await db.query.users.findFirst({
        where: eq(users.username, username),
        columns: { id: true },
      })) ||
      (await db.query.users.findFirst({
        where: eq(users.email, email),
        columns: { id: true },
      }));

    if (user) {
      res.status(403);
      throw new Error("User with the credentials found in the DB!");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        createdAt: new Date(),
      })
      .returning();

    if (!newUser || newUser.length < 1) {
      res.status(400);
      throw new Error("User creation failed, something went wrong!");
    }

    generateToken(res, { id: newUser[0].id });

    res.status(201).json(newUser[0]);
  } catch (err: unknown) {
    return res.json({ message: (err as Error).message });
  }
};

const signInAUser = async (req: Request, res: Response) => {
  const { login, password } = req.body;

  try {
    if (!login || !password) {
      res.status(403);
      throw new Error("All fields are required!");
    }

    const user =
      (await db.query.users.findFirst({
        where: eq(users.username, login),
      })) ||
      (await db.query.users.findFirst({
        where: eq(users.email, login),
      }));

    if (!user) {
      res.status(404);
      throw new Error("Invalid user credentials!");
    }

    const passwordsMatch = await checkPassword(password, user.password);

    if (passwordsMatch === false) {
      res.status(400);
      throw new Error("Invalid user credentials!");
    }

    generateToken(res, { id: user.id });

    res.status(200).json({ user: user });
  } catch (err: unknown) {
    return res.json({ message: (err as Error).message });
  }
};

const signOutAUser = async (req: Request, res: Response) => {
  res
    .cookie(process.env.TOKEN_NAME || "ts-node", "", {
      httpOnly: true,
      maxAge: 0,
    })
    .json({ message: "logout successful" });
};

const getAUserByCookie = async (req: Request, res: Response) => {
  const userId = (req as CustomUserReq).userId;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { id: false, password: false },
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found!");
    }

    res.json(user);
  } catch (err: unknown) {
    return res.json({ message: (err as Error).message });
  }
};

const updateAUserByCookie = async (req: Request, res: Response) => {
  const userId = (req as CustomUserReq).userId;
  let { firstName, password, lastName, maidenName, age, bio } = req.body;

  try {
    if (Object.keys(req.body).length < 1) {
      res.status(403);
      throw new Error("Can't update nothing at all now, can you?");
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { id: false },
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found!");
    }

    firstName !== undefined ? firstName : user.firstName;
    lastName !== undefined ? lastName : user.lastName;
    maidenName !== undefined ? maidenName : user.maidenName;
    age !== undefined ? age : user.age;
    bio !== undefined ? bio : user.bio;

    if (password !== undefined) {
      const hashedPassword = await hashPassword(password);
      password = hashedPassword;
    } else {
      password = user.password;
    }

    const results = await db
      .update(users)
      .set({
        age,
        bio,
        firstName,
        lastName,
        maidenName,
        password,
        UpdatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!results || results.length < 1) {
      res.status(400);
      throw new Error("Failed to update user, something went wrong!");
    }

    res.json(results[0]);
  } catch (err: unknown) {
    return res.json({ message: (err as Error).message });
  }
};

const deleteAUserByCookie = async (req: Request, res: Response) => {
  const userId = (req as CustomUserReq).userId;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { id: false },
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found!");
    }

    const results = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    if (!results || results.length < 1) {
      res.status(400);
      throw new Error("Failed to delete user, something went wrong!");
    }

    res
      .cookie(process.env.TOKEN_NAME || "ts-node", "", {
        httpOnly: true,
        maxAge: 0,
      })
      .json({
        message: `User "${results[0].username}" deleted successfully!`,
      });
  } catch (err: unknown) {
    return res.json({ message: (err as Error).message });
  }
};

export default {
  fetchAllUsers,
  signUpAUser,
  signInAUser,
  signOutAUser,
  getAUserByCookie,
  updateAUserByCookie,
  deleteAUserByCookie,
};
