import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { getDashboard } from "./controller.js";

const router = Router();

router.get("/", authenticate, getDashboard);

export default router;