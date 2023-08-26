import express from 'express';
import { fetchAllPosts, getPostById, createAPost, updateAPost, } from '../controllers/postController.js';
import { loginRequired, isStaffMember } from '../utils/middleware.js';
const router = express.Router();
router.get('/', fetchAllPosts);
router
    .route('/:postId')
    .get(getPostById)
    .patch([loginRequired, isStaffMember], updateAPost);
router.post('/new', [loginRequired, isStaffMember], createAPost);
export default router;
