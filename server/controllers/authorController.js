import asyncHandler from 'express-async-handler';
import { prisma } from '../lib/prismaDb.js';
const fetchAllAuthors = asyncHandler(async (req, res) => {
    const page = req.query['page'] ? Number(req.query['page']) : 1;
    const limit = req.query['limit'] ? Number(req.query['limit']) : 4;
    const authorsCount = await prisma.author.count();
    const authors = await prisma.author.findMany({
        take: limit,
        skip: (page - 1) * limit,
    });
    const pageCount = Math.ceil(authorsCount / limit);
    res.json({ authorsCount, authors, pageCount });
});
const getAuthorById = asyncHandler(async (req, res) => {
    const authorId = req.params['authorId'];
    const author = await prisma.author.findUnique({
        where: { id: authorId },
        select: {
            id: true,
            bio: true,
            user: { select: { id: true, username: true } },
        },
    });
    if (!author) {
        res.status(404);
        throw new Error(`Author not found!`);
    }
    res.json({ author });
});
const becomeAnAuthor = asyncHandler(async (req, res) => {
    const { bio } = req.body;
    const userId = req.userId;
    const alreadyAnAuthor = await prisma.author.findFirst({ where: { userId } });
    if (alreadyAnAuthor) {
        res.status(401);
        throw new Error('User already an Author!');
    }
    if (!bio) {
        res.status(400);
        throw new Error('A little Bio is required in order to become an Author!');
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        res.status(400);
        throw new Error('User not found!');
    }
    const { author } = await prisma.user.update({
        where: { id: userId },
        data: { author: { create: { bio } } },
        select: { author: true },
    });
    res.json({ author });
});
export { fetchAllAuthors, getAuthorById, becomeAnAuthor };
