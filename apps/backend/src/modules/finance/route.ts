import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.js";
import {
  getExpenses,
  getExpenseById,
  addExpense,
  updateExpense,
  deleteExpense,
} from "./controller.js";

const router = Router();

// Get all expenses - accessible by officers and chairperson
router.get(
  "/expenses",
  authenticate,
  authorize("OFFICER", "CHAIRPERSON"),
  getExpenses,
);

// Get specific expense by ID - accessible by officers and chairperson
router.get(
  "/expenses/:id",
  authenticate,
  authorize("OFFICER", "CHAIRPERSON"),
  getExpenseById,
);

// Create expense - only chairperson
router.post("/expenses", authenticate, authorize("CHAIRPERSON"), addExpense);

// Update expense - only chairperson (and only their own)
router.patch(
  "/expenses/:id",
  authenticate,
  authorize("CHAIRPERSON"),
  updateExpense,
);

// Delete expense - only chairperson (and only their own)
router.delete(
  "/expenses/:id",
  authenticate,
  authorize("CHAIRPERSON"),
  deleteExpense,
);

export default router;
