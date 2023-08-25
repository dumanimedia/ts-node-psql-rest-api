import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prismaDb.js';
import { generateToken } from '../lib/generateToken.js';
const fetchAllUsers = asyncHandler(async (req, res) => {
    const page = req.query['page'] ? Number(req.query['page']) : 1;
    const limit = req.query['limit'] ? Number(req.query['limit']) : 4;
    const usersCount = await prisma.user.count();
    const users = await prisma.user.findMany({
        take: limit,
        skip: (page - 1) * limit,
    });
    const pageCount = Math.ceil(usersCount / limit);
    res.json({ usersCount, users, pageCount });
});
const signUpAUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        res.status(401);
        throw new Error('All fields are required!');
    }
    const user = (await prisma.user.findUnique({ where: { email } })) ||
        (await prisma.user.findUnique({ where: { username } }));
    if (user) {
        res.status(400);
        throw new Error('User with the credentials found in the DB!');
    }
    try {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await prisma.user.create({
            data: { email, username, password: hashedPassword },
        });
        generateToken(res, { id: newUser.id });
        res.status(201).json({ user: newUser });
    }
    catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
});
const signInAUser = asyncHandler(async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) {
        res.status(400);
        throw new Error('All fields are required!');
    }
    const user = (await prisma.user.findUnique({ where: { email: login } })) ||
        (await prisma.user.findUnique({ where: { username: login } }));
    if (!user) {
        res.status(404);
        throw new Error('Invalid user credentials!');
    }
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (passwordsMatch === false) {
        res.status(400);
        throw new Error('Invalid user credentials!');
    }
    try {
        generateToken(res, { id: user.id });
        res.status(200).json({ user: user });
    }
    catch (err) {
        throw new Error(err.message);
    }
});
const signOutAUser = asyncHandler(async (req, res) => {
    res.json('Route for logging out a user');
});
const getAUserById = asyncHandler(async (req, res) => {
    res.json('Route for getting A User By Id');
});
const updateAUserById = asyncHandler(async (req, res) => {
    res.json('Route for updating A User By Id');
});
const deleteAUserById = asyncHandler(async (req, res) => {
    res.json('Route for deleting A User By Id');
});
export { fetchAllUsers, signUpAUser, signInAUser, signOutAUser, getAUserById, updateAUserById, deleteAUserById, };
//# sourceMappingURL=userController.js.map