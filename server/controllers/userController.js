import asyncHandler from 'express-async-handler';
import { prisma } from '../lib/prismaDb.js';
const fetchAllUsers = asyncHandler(async (req, res) => {
    const page = req.query['page'] ? Number(req.query['page']) : 1;
    const limit = req.query['limit'] ? Number(req.query['limit']) : 4;
    const usersCount = await prisma.user.count();
    const users = await prisma.user.findMany({
        take: limit,
        skip: (page - 1) * limit,
    });
    const pageCount = Math.floor(usersCount / limit);
    res.json({ usersCount, users, pageCount });
});
const signUpAUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    const user = (await prisma.user.findUnique({ where: { email } })) ||
        (await prisma.user.findUnique({ where: { username } }));
    if (user) {
        res.status(400);
        throw new Error('User with the credentials found in the DB!');
    }
    try {
        // user not found in the database at this moment
        // Catch block step handled
        // Next step hash the password then create a user to postgresql via prisma
        // NOTE: First add a check for username, password and email.
    }
    catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
});
const signInAUser = asyncHandler(async (req, res) => {
    res.json('Route for authenticating a user');
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