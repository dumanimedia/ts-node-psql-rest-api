import express from "express";

import homeController from "../controllers/homeController";

const router = express.Router();

router.route("/").get(homeController.getHomeResponse);

export default router;
