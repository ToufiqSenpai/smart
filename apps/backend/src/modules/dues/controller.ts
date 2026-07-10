import type { Request, Response } from "express";
import * as duesService from "./service.js";

export async function list(req: Request, res: Response) {
  try {
    const data = await duesService.listIuran();
    res.json({ message: "success", data });
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const data = await duesService.getIuranById(req.params.dueId);
    res.json({ message: "success", data });
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const result = await duesService.addIuran(req.user!, req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const result = await duesService.editIuran(
      req.user!,
      req.params.dueId,
      req.body,
    );
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}

export async function toggleStatus(req: Request, res: Response) {
  try {
    const result = await duesService.toggleIuranStatus(
      req.user!,
      req.params.dueId,
      req.body.status,
    );
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}

export async function getBills(req: Request, res: Response) {
  try {
    const data = await duesService.getBills(req.user!);
    res.json({ message: "success", data });
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}

export async function submitPayment(req: Request, res: Response) {
  try {
    const result = await duesService.addPayment(req.user!, req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}

export async function listPayments(req: Request, res: Response) {
  try {
    const data = await duesService.listPayments(req.user!);
    res.json({ message: "success", data });
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}

export async function getPaymentById(req: Request, res: Response) {
  try {
    const data = await duesService.getPaymentById(
      req.params.paymentId,
      req.user!,
    );
    res.json({ message: "success", data });
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}

export async function verifyPayment(req: Request, res: Response) {
  try {
    const result = await duesService.verifyPayment(
      req.user!,
      req.params.paymentId,
      req.body.status,
    );
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}

export async function getMyPayments(req: Request, res: Response) {
  try {
    const data = await duesService.getMyPayments(req.user!);
    res.json({ message: "success", data });
  } catch (err: any) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      code: err.code,
    });
  }
}
