import express from 'express';

import {
  fetchAllPosts,
  getPostById,
  createAPost,
  updateAPost,
  deleteAPost,
} from '../controllers/postController.js';
import {
  loginRequired,
  isStaffMember,
  isPostOwner,
} from '../utils/middleware.js';
const router = express.Router();

router
  .get('/', fetchAllPosts)
  .post('/new', [loginRequired, isStaffMember], createAPost);

router
  .route('/:postId')
  .get(getPostById)
  .patch([loginRequired, isStaffMember, isPostOwner], updateAPost)
  .delete([loginRequired, isStaffMember, isPostOwner], deleteAPost);

export default router;
