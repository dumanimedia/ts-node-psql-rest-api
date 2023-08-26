import asyncHandler from 'express-async-handler';
import { prisma } from '../lib/prismaDb.js';
const fetchAllPosts = asyncHandler(async (req, res) => {
    const page = req.query['page'] ? Number(req.query['page']) : 1;
    const limit = req.query['limit'] ? Number(req.query['limit']) : 4;
    const postsCount = await prisma.post.count();
    const posts = await prisma.post.findMany({
        take: limit,
        skip: (page - 1) * limit,
    });
    const pageCount = Math.ceil(postsCount / limit);
    res.json({ postsCount: postsCount, posts, pageCount });
});
const getPostById = asyncHandler(async (req, res) => {
    const postId = req.params['postId'];
    const post = await prisma.post.findUnique({
        where: { id: postId },
    });
    if (!post) {
        res.status(404);
        throw new Error(`Post not found!`);
    }
    res.json({ post });
});
export { fetchAllPosts, getPostById };
