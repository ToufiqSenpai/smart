import type { Request, Response } from "express";
import * as dashboardService from "./service.js";

export async function getDashboard(req: Request, res: Response) {
  try {
    const data = await dashboardService.getDashboard(req.user!);
    res.json({ message: "success", data });
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}