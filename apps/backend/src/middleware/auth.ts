import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'smart-rt-secret-key';

export interface AuthUser {
  id: string;
  role: 'RESIDENT' | 'OFFICER' | 'CHAIRPERSON';
  idWarga?: string;
  idPengurus?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token tidak valid', code: 'UNAUTHORIZED' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const masyarakat = await prisma.masyarakat.findUnique({
      where: { idMasyarakat: decoded.id },
      include: {
        warga: true,
        pengurusRt: true,
      },
    });

    if (!masyarakat) {
      res.status(401).json({ message: 'Pengguna tidak ditemukan', code: 'UNAUTHORIZED' });
      return;
    }

    let role: AuthUser['role'] = 'RESIDENT';
    let idWarga: string | undefined;
    let idPengurus: string | undefined;

    if (masyarakat.pengurusRt) {
      idPengurus = masyarakat.pengurusRt.idPengurus;
      role = masyarakat.pengurusRt.jabatan === 'KETUA_RT' ? 'CHAIRPERSON' : 'OFFICER';
    }

    if (masyarakat.warga) {
      idWarga = masyarakat.warga.idWarga;
    }

    req.user = { id: masyarakat.idMasyarakat, role, idWarga, idPengurus };
    next();
  } catch {
    res.status(401).json({ message: 'Token tidak valid', code: 'UNAUTHORIZED' });
  }
}

export function authorize(...roles: AuthUser['role'][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Belum login', code: 'UNAUTHORIZED' });
      return;
    }
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      res.status(401).json({ message: 'Tidak memiliki hak akses', code: 'UNAUTHORIZED' });
      return;
    }
    next();
  };
}
