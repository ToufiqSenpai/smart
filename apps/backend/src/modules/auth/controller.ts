import type { Request, Response } from "express";
import * as authService from "./service.js";

export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);
    res.json({ message: "success", data: result });
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}
