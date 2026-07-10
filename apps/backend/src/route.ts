import { Router } from "express";
import authRoutes from "./modules/auth/route.js";
import issueRoutes from "./modules/issues/route.js";
import profileRoutes from "./modules/profile/route.js";
import residentRoutes from "./modules/residents/route.js";
import financeRoutes from "./modules/finance/route.js";
import duesRoutes from "./modules/dues/route.js";
import dashboardRoutes from "./modules/dashboard/route.js";
import announcementRoutes from './modules/announcement/route.js';
import businessRoutes from './modules/businesses/route.js';

const router = Router();

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/dues", duesRoutes);
router.use("/finance", financeRoutes);
router.use("/issues", issueRoutes);
router.use("/profile", profileRoutes);
router.use("/residents", residentRoutes);
router.use('/announcements', announcementRoutes);
router.use('/businesses', businessRoutes);


export default router;
