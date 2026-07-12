import { Request, Response } from 'express';
import * as residentService from './service.js';

export async function register(req: Request, res: Response) {
  try {
    const result = await residentService.register(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const data = await residentService.listResidents(req.user!, req.query as any);
    res.json({ message: 'success', data });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const data = await residentService.getResidentById(req.params.residentId);
    res.json({ message: 'success', data });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const result = await residentService.updateResident(req.params.residentId, req.body);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function getPendingVerifications(req: Request, res: Response) {
  try {
    const data = await residentService.getPendingVerifications();
    res.json({ message: 'success', data });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function verifyResident(req: Request, res: Response) {
  try {
    const result = await residentService.verifyResident(req.params.residentId, req.body.status);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function listOfficers(req: Request, res: Response) {
  try {
    const data = await residentService.listOfficers();
    res.json({ message: 'success', data });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function manageOfficerRole(req: Request, res: Response) {
  try {
    const result = await residentService.manageOfficerRole(req.params.residentId, req.body);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}
