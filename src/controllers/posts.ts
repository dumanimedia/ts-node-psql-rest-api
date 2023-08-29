import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { prisma } from '../lib/prismaDb.js';
import { CustomAuthorReq, CustomUserReq, PostReq } from '../utils/types.js';

const fetchAllPosts = asyncHandler(async (req: Request, res: Response) => {
  const page = req.query['page'] ? Number(req.query['page']) : 1;
  const limit = req.query['limit'] ? Number(req.query['limit']) : 4;

  const postsCount = await prisma.post.count();

  const posts = await prisma.post.findMany({
    take: limit,
    skip: (page - 1) * limit,
    select: {
      title: true,
      description: true,
      authorId: true,
      createdAt: true,
      comments: { select: { id: true } },
    },
  });

  const pageCount = Math.ceil(postsCount / limit);

  res.json({ postsCount: postsCount, posts, pageCount });
});

const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const postId = req.params['postId'];

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      title: true,
      description: true,
      authorId: true,
      createdAt: true,
      comments: {
        select: {
          message: true,
          user: { select: { username: true } },
          createdAt: true,
        },
      },
    },
  });

  if (!post) {
    res.status(404);
    throw new Error(`Post not found!`);
  }

  res.json(post);
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
  const post = (req as PostReq).post;

  type Post = Partial<
    Omit<typeof post, 'authorId' | 'createdAt' | 'updatedAt' | 'id'>
  >;

  let updateInfo: Post = {};
  updateInfo.title = req.body.title || post.title;
  updateInfo.description = req.body.description || post.description;

  try {
    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: updateInfo,
    });

    res.json(updatedPost);
  } catch (err: unknown) {
    throw new Error((err as Error).message);
  }
});

const deleteAPost = asyncHandler(async (req: Request, res: Response) => {
  const post = (req as PostReq).post;

  try {
    await prisma.post.delete({ where: { id: post.id } });
    res.json({ message: 'Delete Successful' });
  } catch (err) {
    throw new Error((err as Error).message);
  }
});

const getPostComments = asyncHandler(async (req: Request, res: Response) => {
  const postId = req.params['postId'];

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      comments: {
        select: {
          message: true,
          user: { select: { username: true } },
          createdAt: true,
        },
      },
    },
  });

  if (!post) {
    res.status(404);
    throw new Error('Post with the given ID Not found!');
  }

  res.json(post.comments);
});

const commentOnAPost = asyncHandler(async (req: Request, res: Response) => {
  const { message } = req.body;
  const userId = (req as CustomUserReq).userId;
  const postId = req.params['postId'];

  if (!message) {
    res.status(400);
    throw new Error('All fields are required!');
  }

  const alreadyCommented = await prisma.post.findUnique({
    where: { id: postId, comments: { some: { userId } } },
    select: { id: true, comments: { select: { userId: true } } },
  });

  if (alreadyCommented) {
    res.status(400);
    throw new Error('Post already commented on by the user!');
  }

  const { comments } = await prisma.post.update({
    where: { id: postId },
    data: {
      comments: {
        create: {
          message,
          userId,
        },
      },
    },
    select: {
      comments: {
        select: {
          message: true,
          user: { select: { username: true } },
          createdAt: true,
        },
      },
    },
  });

  res.json(comments);
});

export {
  fetchAllPosts,
  getPostById,
  createAPost,
  updateAPost,
  deleteAPost,
  getPostComments,
  commentOnAPost,
};
