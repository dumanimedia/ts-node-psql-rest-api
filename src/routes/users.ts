import express from "express";

import usersControllers from "../controllers/users";
import { loginRequired } from "../utils/middleware";

const router = express.Router();

router
  .route("/")
  .get(usersControllers.fetchAllUsers)
  .post(usersControllers.signUpAUser);

router
  .post("/login/", usersControllers.signInAUser)
  .post("/logout/", loginRequired, usersControllers.signOutAUser);

router
  .route("/profile")
  .get(loginRequired, usersControllers.getAUserByCookie)
  .patch(loginRequired, usersControllers.updateAUserByCookie)
  .delete(loginRequired, usersControllers.deleteAUserByCookie);

export default router;
