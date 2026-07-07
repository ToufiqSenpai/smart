import { Request, Response } from 'express';
import * as issueService from './service.js';

export async function list(req: Request, res: Response) {
  try {
    const data = await issueService.listIssues(req.user!);
    res.json({ message: 'success', data });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function create(req: Request, res: Response) {
  try {
    await issueService.createIssue(req.user!, req.body);
    res.status(201).json({ message: 'Laporan berhasil dikirim.' });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function getMyIssues(req: Request, res: Response) {
  try {
    const data = await issueService.getMyIssues(req.user!);
    res.json({ message: 'success', data });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const data = await issueService.getIssueById(req.params.issueId, req.user!);
    res.json({ message: 'success', data });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const result = await issueService.updateIssue(req.params.issueId, req.user!, req.body);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function updateStatus(req: Request, res: Response) {
  try {
    const result = await issueService.updateIssueStatus(req.params.issueId, req.user!, req.body.status);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}

export async function followUp(req: Request, res: Response) {
  try {
    const result = await issueService.followUpIssue(req.params.issueId, req.user!, req.body.tanggapan);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error', code: err.code });
  }
}
