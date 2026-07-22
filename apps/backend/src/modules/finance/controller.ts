import type { Request, Response } from "express";
import * as financeService from "./service.js";

export async function getExpenses(req: Request, res: Response) {
  try {
    const data = await financeService.getExpenses(req.user!);
    res.json({ message: "success", data });
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}

export async function getExpenseById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || typeof id !== "string" || id.trim() === "") {
      res.status(400).json({
        message: "Invalid expense ID",
        code: "INVALID_ID",
      });
      return;
    }

    const data = await financeService.getExpenseById(req.user!, id);
    res.json({ message: "success", data });
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}

export async function addExpense(req: Request, res: Response) {
  try {
    const data = await financeService.addExpense(req.user!, req.body);
    res.status(201).json({ message: "success", data });
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}

export async function updateExpense(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || typeof id !== "string" || id.trim() === "") {
      res.status(400).json({
        message: "Invalid expense ID",
        code: "INVALID_ID",
      });
      return;
    }

    const data = await financeService.updateExpense(req.user!, id, req.body);
    res.json({ message: "success", data });
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}

export async function deleteExpense(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || typeof id !== "string" || id.trim() === "") {
      res.status(400).json({
        message: "Invalid expense ID",
        code: "INVALID_ID",
      });
      return;
    }

    await financeService.deleteExpense(req.user!, id);
    res.json({ message: "success", data: { id } });
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}

export async function getFinanceReport(req: Request, res: Response) {
  try {
    const periode = req.query.periode as string | undefined;
    const data = await financeService.getFinanceReport(req.user!, periode);
    res.json({ message: "success", data });
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}
