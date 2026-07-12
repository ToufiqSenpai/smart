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

// ==================== IURAN (Master) ====================

// Get all iuran
router.get("/", authenticate, list);

// Create new iuran (chairperson only)
router.post("/", authenticate, authorize("CHAIRPERSON"), create);

// Get specific iuran by ID
router.get("/:dueId", authenticate, getById);

// Update specific iuran (chairperson only)
router.patch("/:dueId", authenticate, authorize("CHAIRPERSON"), update);

// Toggle iuran status (chairperson only)
router.patch(
  "/:dueId/status",
  authenticate,
  authorize("CHAIRPERSON"),
  toggleStatus,
);

// ==================== BILLS (Tagihan) ====================

// Get bills for current resident (must come before /payments)
router.get("/bills/current", authenticate, authorize("RESIDENT"), getBills);

// ==================== PAYMENTS (Pembayaran) ====================

// Submit payment (resident only)
router.post("/payments", authenticate, authorize("RESIDENT"), submitPayment);

// Get payment history for current resident (must come before /payments/:paymentId)
router.get("/me/payments", authenticate, authorize("RESIDENT"), getMyPayments);

// Get all payments (officer and chairperson only)
router.get(
  "/payments",
  authenticate,
  authorize("OFFICER", "CHAIRPERSON"),
  listPayments,
);

// Get specific payment by ID (can be resident viewing their own, or officer/chairperson viewing any)
router.get("/payments/:paymentId", authenticate, getPaymentById);

// Verify payment status (officer and chairperson only)
router.patch(
  "/payments/:paymentId/status",
  authenticate,
  authorize("OFFICER", "CHAIRPERSON"),
  verifyPayment,
);

export default router;
