import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { prisma } from '../lib/prismaDb.js';
import { CustomAuthorReq } from '../utils/types.js';

const fetchAllPosts = asyncHandler(async (req: Request, res: Response) => {
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

const getPostById = asyncHandler(async (req: Request, res: Response) => {
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

const createAPost = asyncHandler(async (req: Request, res: Response) => {
  const authorId = (req as CustomAuthorReq).authorId;
  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error('All fields are required!');
  }

  try {
    const { posts } = await prisma.author.update({
      where: { id: authorId },
      data: {
        posts: {
          create: [
            {
              title,
              description,
            },
          ],
        },
      },
      select: { posts: true },
    });

    res.status(201).json({ posts });
  } catch (err: unknown) {
    throw new Error((err as Error).message);
  }
});

const updateAPost = asyncHandler(async (req: Request, res: Response) => {
  const authorId = (req as CustomAuthorReq).authorId;
  const postId = req.params['postId'];
  const { title, description } = req.body;

  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) {
    res.status(404);
    throw new Error('Post not Found in the Database!');
  }

  const author = await prisma.author.findUnique({
    where: { id: authorId },
    select: { id: true },
  });

  if (post.authorId !== author.id) {
    res.status(401);
    throw new Error('You are not the creator of the post');
  }

  res.json('Update the post then');
});

export { fetchAllPosts, getPostById, createAPost, updateAPost };
