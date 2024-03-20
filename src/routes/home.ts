import { Router } from "express";
import homeControllers from "../controllers/home";

const router = Router();

router.use("/", homeControllers.serverIndexRoute);

export default router;
