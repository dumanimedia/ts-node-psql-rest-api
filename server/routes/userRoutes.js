import express from 'express';
import { fetchAllUsers, signUpAUser, signInAUser, signOutAUser, getAUserById, updateAUserById, deleteAUserById, } from '../controllers/userController.js';
import { loginRequired } from '../utils/middleware.js';
const router = express.Router();
router.route('/').get(loginRequired, fetchAllUsers).post(signUpAUser);
router.post('/login/', signInAUser);
router.post('/logout/', loginRequired, signOutAUser);
router
    .route('/profile')
    .get(loginRequired, getAUserById)
    .patch(loginRequired, updateAUserById)
    .delete(loginRequired, deleteAUserById);
export default router;
//# sourceMappingURL=userRoutes.js.map