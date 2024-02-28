import express from 'express';
import { fetchAllAuthors, getAuthorById, becomeAnAuthor, } from '../controllers/authors.js';
import { loginRequired } from '../utils/middleware.js';
const router = express.Router();
router.get('/', fetchAllAuthors);
router.get('/:authorId', getAuthorById);
router.post('/new', loginRequired, becomeAnAuthor);
export default router;
