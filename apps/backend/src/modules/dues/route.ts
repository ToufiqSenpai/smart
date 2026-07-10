import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.js";
import {
  list,
  getById,
  create,
  update,
  toggleStatus,
  getBills,
  submitPayment,
  listPayments,
  getPaymentById,
  verifyPayment,
  getMyPayments,
} from "./controller.js";

const router = Router();

// Iuran (Master)
router.get("/", authenticate, list);
router.post("/", authenticate, authorize("CHAIRPERSON"), create);
router.get("/:dueId", authenticate, getById);
router.patch("/:dueId", authenticate, authorize("CHAIRPERSON"), update);
router.patch("/:dueId/status", authenticate, authorize("CHAIRPERSON"), toggleStatus);

// Bills
router.get("/bills", authenticate, authorize("RESIDENT"), getBills);

// Payments
router.post("/payments", authenticate, authorize("RESIDENT"), submitPayment);
router.get("/payments", authenticate, authorize("OFFICER", "CHAIRPERSON"), listPayments);
router.get("/payments/:paymentId", authenticate, getPaymentById);
router.patch("/payments/:paymentId/status", authenticate, authorize("OFFICER", "CHAIRPERSON"), verifyPayment);

// My Payment History
router.get("/me/payments", authenticate, authorize("RESIDENT"), getMyPayments);

export default router;
