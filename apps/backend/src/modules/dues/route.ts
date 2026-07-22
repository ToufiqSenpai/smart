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

// Get bills for current user's resident profile
router.get("/bills/current", authenticate, getBills);

// ==================== PAYMENTS (Pembayaran) ====================

// Submit payment (any user with warga profile)
router.post("/payments", authenticate, submitPayment);

// Get payment history for current user's warga profile
router.get("/me/payments", authenticate, getMyPayments);

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
