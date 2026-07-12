import { Request, Response } from 'express';
import * as businessService from './service.js';

export async function list(req: Request, res: Response) {
  try {
    const { keyword, jenis_usaha } = req.query as { keyword?: string; jenis_usaha?: string };
    const data = await businessService.listBusinesses(req.user!, { keyword, jenis_usaha });
    res.json({ message: 'success', data });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const result = await businessService.createBusiness(req.user!, req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function getMyBusinesses(req: Request, res: Response) {
  try {
    const data = await businessService.getMyBusinesses(req.user!);
    res.json({ message: 'success', data });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const data = await businessService.getBusinessById(req.params.businessId, req.user!);
    res.json({ message: 'success', data });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const result = await businessService.updateBusiness(req.params.businessId, req.user!, req.body);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function validateStatus(req: Request, res: Response) {
  try {
    const result = await businessService.validateBusiness(req.params.businessId, req.user!, req.body.status);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}
