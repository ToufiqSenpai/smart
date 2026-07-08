import * as issueRepository from './repository.js';
import type { AuthUser } from '../../middleware/auth.js';

export async function listIssues(user: AuthUser) {
  return issueRepository.findAll();
}

export async function createIssue(user: AuthUser, data: { kategori_kendala: string; deskripsi: string; foto_kendala?: string }) {
  if (!data.kategori_kendala || !data.deskripsi) {
    throw { status: 400, message: 'kategori_kendala dan deskripsi wajib diisi', code: 'VALIDATION_ERROR' };
  }
  if (!user.idWarga) {
    throw { status: 400, message: 'Anda belum terdaftar sebagai warga', code: 'NOT_A_RESIDENT' };
  }

  const issue = await issueRepository.create({
    idWarga: user.idWarga,
    kategoriKendala: data.kategori_kendala,
    deskripsi: data.deskripsi,
    fotoKendala: data.foto_kendala,
    tanggalLapor: new Date(),
    statusLaporan: 'PENDING',
  });
  return issue;
}

export async function getMyIssues(user: AuthUser) {
  if (!user.idWarga) {
    return [];
  }
  return issueRepository.findByWargaId(user.idWarga);
}

export async function getIssueById(issueId: string, user: AuthUser) {
  const issue = await issueRepository.findById(issueId);
  if (!issue) {
    throw { status: 404, message: 'Laporan tidak ditemukan', code: 'NOT_FOUND' };
  }

  const isOfficer = user.role === 'OFFICER' || user.role === 'CHAIRPERSON';
  if (!isOfficer && user.idWarga) {
    const issueRaw = await issueRepository.findByWargaId(user.idWarga);
    const owned = issueRaw.some((i: { id: string }) => i.id === issueId);
    if (!owned) {
      throw { status: 401, message: 'Tidak memiliki hak akses', code: 'UNAUTHORIZED' };
    }
  }

  return issue;
}

export async function updateIssue(issueId: string, user: AuthUser, data: { kategori_kendala?: string; deskripsi?: string; foto_kendala?: string }) {
  const issue = await issueRepository.findById(issueId);
  if (!issue) {
    throw { status: 404, message: 'Laporan tidak ditemukan', code: 'NOT_FOUND' };
  }

  if (issue.status_laporan !== 'PENDING') {
    throw { status: 400, message: 'Laporan hanya bisa diubah jika status masih PENDING', code: 'INVALID_STATUS' };
  }

  const issueRaw = await issueRepository.findByWargaId(user.idWarga!);
  const owned = issueRaw.some((i: { id: string }) => i.id === issueId);
  if (!owned) {
    throw { status: 401, message: 'Tidak memiliki hak akses', code: 'UNAUTHORIZED' };
  }

  await issueRepository.update(issueId, data);
  return { message: 'Laporan berhasil diperbarui.' };
}

export async function updateIssueStatus(issueId: string, user: AuthUser, status: string) {
  const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
  if (!validStatuses.includes(status)) {
    throw { status: 400, message: 'Status tidak valid', code: 'VALIDATION_ERROR' };
  }

  const issue = await issueRepository.findById(issueId);
  if (!issue) {
    throw { status: 404, message: 'Laporan tidak ditemukan', code: 'NOT_FOUND' };
  }

  await issueRepository.updateStatus(issueId, status as issueRepository.IssueStatus);

  if (user.idPengurus) {
    await issueRepository.updateFollowUp(issueId, issue.tanggapan || '', user.idPengurus);
  }

  return { message: 'Status laporan berhasil diperbarui.' };
}

export async function followUpIssue(issueId: string, user: AuthUser, tanggapan: string) {
  if (!tanggapan) {
    throw { status: 400, message: 'Tanggapan wajib diisi', code: 'VALIDATION_ERROR' };
  }

  const issue = await issueRepository.findById(issueId);
  if (!issue) {
    throw { status: 404, message: 'Laporan tidak ditemukan', code: 'NOT_FOUND' };
  }

  if (!user.idPengurus) {
    throw { status: 400, message: 'Anda tidak terdaftar sebagai pengurus', code: 'NOT_AN_OFFICER' };
  }

  await issueRepository.updateFollowUp(issueId, tanggapan, user.idPengurus);
  return { message: 'Tindak lanjut laporan berhasil disimpan.' };
}
