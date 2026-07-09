import { Request, Response } from 'express';
import * as announcementService from './service.js';

export async function list(req: Request, res: Response) {
  try {
    const data = await announcementService.listAnnouncements(req.user!);
    res.json({ message: 'success', data });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const result = await announcementService.createAnnouncement(req.user!, req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const data = await announcementService.getAnnouncementById(req.params.announcementId, req.user!);
    res.json({ message: 'success', data });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const result = await announcementService.updateAnnouncement(req.params.announcementId, req.user!, req.body);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const result = await announcementService.deleteAnnouncement(req.params.announcementId, req.user!);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}
