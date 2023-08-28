import express from 'express';

import {
  fetchAllUsers,
  signUpAUser,
  signInAUser,
  signOutAUser,
  getAUserById,
  updateAUserById,
  deleteAUserById,
} from '../controllers/users.js';
import { loginRequired } from '../utils/middleware.js';

const router = express.Router();

router.route('/').get(fetchAllUsers).post(signUpAUser);

router
  .post('/login/', signInAUser)
  .post('/logout/', loginRequired, signOutAUser);

router
  .route('/profile')
  .get(loginRequired, getAUserById)
  .patch(loginRequired, updateAUserById)
  .delete(loginRequired, deleteAUserById);

export default router;
