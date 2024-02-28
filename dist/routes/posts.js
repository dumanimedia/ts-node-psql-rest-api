import express from 'express';
import { fetchAllPosts, getPostById, createAPost, updateAPost, deleteAPost, getPostComments, commentOnAPost, } from '../controllers/posts.js';
import { loginRequired, isStaffMember, isPostOwner, } from '../utils/middleware.js';
const router = express.Router();
router
    .get('/', fetchAllPosts)
    .post('/new', [loginRequired, isStaffMember], createAPost);
router
    .route('/:postId')
    .get(getPostById)
    .patch([loginRequired, isStaffMember, isPostOwner], updateAPost)
    .delete([loginRequired, isStaffMember, isPostOwner], deleteAPost);
router
    .route('/:postId/comments')
    .get(getPostComments)
    .post(loginRequired, commentOnAPost);
export default router;
