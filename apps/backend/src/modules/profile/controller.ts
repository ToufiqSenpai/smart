import { Request, Response } from 'express';
import * as profileService from './service.js';

export async function getProfile(req: Request, res: Response) {
  try {
    const data = await profileService.getProfile(req.user!);
    res.json({ message: 'success', data });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const result = await profileService.updateProfile(req.user!, req.body);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}
