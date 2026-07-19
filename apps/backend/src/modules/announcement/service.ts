import * as announcementRepository from './repository.js';
import type { AuthUser } from '../../middleware/auth.js';

export async function listAnnouncements(user: AuthUser) {
  const all = await announcementRepository.findAll();
  if (user.role === 'RESIDENT') {
    return all.filter((a: { status_publikasi: string }) => a.status_publikasi === 'PUBLISHED');
  }
  return all;
}

export async function createAnnouncement(user: AuthUser, data: { judul: string; isi_pengumuman: string; lampiran?: string; status_publikasi: string }) {
  if (!data.judul || !data.isi_pengumuman || !data.status_publikasi) {
    throw { status: 400, message: 'judul, isi_pengumuman, dan status_publikasi wajib diisi', code: 'VALIDATION_ERROR' };
  }
  if (data.judul.length > 15) {
    throw { status: 400, message: 'judul maksimal 15 karakter', code: 'VALIDATION_ERROR' };
  }
  if (!['PUBLISHED', 'DRAFT'].includes(data.status_publikasi)) {
    throw { status: 400, message: 'status_publikasi harus PUBLISHED atau DRAFT', code: 'VALIDATION_ERROR' };
  }
  if (!user.idPengurus) {
    throw { status: 400, message: 'Anda tidak terdaftar sebagai pengurus', code: 'NOT_AN_OFFICER' };
  }

  await announcementRepository.create({
    idPengurus: user.idPengurus,
    judul: data.judul,
    isiPengumuman: data.isi_pengumuman,
    lampiran: data.lampiran,
    tanggalPengumuman: new Date(),
    statusPublikasi: data.status_publikasi,
  });
  return { message: 'Pengumuman berhasil ditambahkan.' };
}

export async function getAnnouncementById(announcementId: string, user: AuthUser) {
  const announcement = await announcementRepository.findById(announcementId);
  if (!announcement) {
    throw { status: 404, message: 'Pengumuman tidak ditemukan', code: 'NOT_FOUND' };
  }
  if (user.role === 'RESIDENT' && announcement.status_publikasi === 'DRAFT') {
    throw { status: 401, message: 'Tidak memiliki hak akses', code: 'UNAUTHORIZED' };
  }
  return announcement;
}

export async function updateAnnouncement(announcementId: string, user: AuthUser, data: { judul?: string; isi_pengumuman?: string; lampiran?: string; status_publikasi?: string }) {
  const announcement = await announcementRepository.findById(announcementId);
  if (!announcement) {
    throw { status: 404, message: 'Pengumuman tidak ditemukan', code: 'NOT_FOUND' };
  }
  if (data.status_publikasi && !['PUBLISHED', 'DRAFT'].includes(data.status_publikasi)) {
    throw { status: 400, message: 'status_publikasi harus PUBLISHED atau DRAFT', code: 'VALIDATION_ERROR' };
  }

  await announcementRepository.update(announcementId, {
    ...(data.judul && { judul: data.judul }),
    ...(data.isi_pengumuman && { isiPengumuman: data.isi_pengumuman }),
    ...(data.lampiran !== undefined && { lampiran: data.lampiran }),
    ...(data.status_publikasi && { statusPublikasi: data.status_publikasi }),
  });
  return { message: 'Pengumuman berhasil diperbarui.' };
}

export async function deleteAnnouncement(announcementId: string, user: AuthUser) {
  const announcement = await announcementRepository.findById(announcementId);
  if (!announcement) {
    throw { status: 404, message: 'Pengumuman tidak ditemukan', code: 'NOT_FOUND' };
  }
  await announcementRepository.remove(announcementId);
  return { message: 'Pengumuman berhasil dihapus.' };
}
