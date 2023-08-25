import express from 'express';

import {
  fetchAllUsers,
  signUpAUser,
  signInAUser,
  signOutAUser,
  getAUserById,
  updateAUserById,
  deleteAUserById,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/').get(fetchAllUsers).post(signUpAUser);
router.post('/login/', signInAUser);
router.post('/logout/', signOutAUser);
router
  .route('/profile')
  .get(getAUserById)
  .patch(updateAUserById)
  .delete(deleteAUserById);

export default router;
