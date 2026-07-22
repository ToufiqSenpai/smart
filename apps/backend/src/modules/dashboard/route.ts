import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { getDashboard, getDashboardActivities } from "./controller.js";

const router = Router();

router.get("/", authenticate, getDashboard);
router.get("/activities", authenticate, getDashboardActivities);

export default router;