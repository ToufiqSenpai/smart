import bcrypt from 'bcrypt';
import * as residentRepository from './repository.js';
import type { AuthUser } from '../../middleware/auth.js';

export async function register(data: {
  nik: string; nama: string; alamat: string; no_hp: string; username: string; password: string;
}) {
  if (!data.nik || !data.nama || !data.alamat || !data.no_hp || !data.username || !data.password) {
    throw { status: 400, message: 'Semua field wajib diisi', code: 'VALIDATION_ERROR' };
  }

  const existingNik = await residentRepository.findMasyarakatByNik(data.nik);
  if (existingNik) {
    throw { status: 409, message: 'NIK sudah terdaftar', code: 'CONFLICT' };
  }

  const existingUsername = await residentRepository.findMasyarakatByUsername(data.username);
  if (existingUsername) {
    throw { status: 409, message: 'Username sudah terdaftar', code: 'CONFLICT' };
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const masyarakat = await residentRepository.createMasyarakat({
    nik: data.nik,
    nama: data.nama,
    alamat: data.alamat,
    noHp: data.no_hp,
    username: data.username,
    password: hashedPassword,
  });

  await residentRepository.createWarga({
    idMasyarakat: masyarakat.idMasyarakat,
    statusKeanggotaan: 'PENDING',
  });

  return { message: 'Registrasi berhasil. Menunggu verifikasi Ketua RT.' };
}

export async function listResidents(user: AuthUser, query: { search?: string; status?: string }) {
  return residentRepository.findAllWarga(query.search, query.status);
}

export async function getResidentById(residentId: string) {
  const warga = await residentRepository.findWargaById(residentId);
  if (!warga) {
    throw { status: 404, message: 'Data warga tidak ditemukan', code: 'NOT_FOUND' };
  }
  return warga;
}

export async function updateResident(residentId: string, data: { nama?: string; alamat?: string; no_hp?: string }) {
  const warga = await residentRepository.findWargaById(residentId);
  if (!warga) {
    throw { status: 404, message: 'Data warga tidak ditemukan', code: 'NOT_FOUND' };
  }

  const updateData: { nama?: string; alamat?: string; noHp?: string } = {};
  if (data.nama !== undefined) updateData.nama = data.nama;
  if (data.alamat !== undefined) updateData.alamat = data.alamat;
  if (data.no_hp !== undefined) updateData.noHp = data.no_hp;

  await residentRepository.updateWargaAndMasyarakat(residentId, updateData);
  return { message: 'Data warga berhasil diperbarui.' };
}

export async function getPendingVerifications() {
  return residentRepository.findPendingVerifications();
}

export async function verifyResident(residentId: string, status: string) {
  if (!['AKTIF', 'DITOLAK'].includes(status)) {
    throw { status: 400, message: 'Status keanggotaan tidak valid', code: 'VALIDATION_ERROR' };
  }

  const warga = await residentRepository.findWargaById(residentId);
  if (!warga) {
    throw { status: 404, message: 'Data warga tidak ditemukan', code: 'NOT_FOUND' };
  }

  await residentRepository.updateVerificationStatus(residentId, status);
  return { message: 'Status keanggotaan berhasil diperbarui.' };
}

export async function listOfficers() {
  return residentRepository.findAllOfficers();
}

export async function manageOfficerRole(residentId: string, data: { jabatan?: string | null; periodeJabatan?: string }) {
  const warga = await residentRepository.findWargaById(residentId);
  if (!warga) {
    throw { status: 404, message: 'Data warga tidak ditemukan', code: 'NOT_FOUND' };
  }

  const masyarakat = await residentRepository.findMasyarakatByNik(warga.nik);
  if (!masyarakat) {
    throw { status: 404, message: 'Data masyarakat tidak ditemukan', code: 'NOT_FOUND' };
  }

  if (data.jabatan === null || data.jabatan === undefined) {
    try {
      await residentRepository.deletePengurusRt(masyarakat.idMasyarakat);
    } catch {
      throw { status: 404, message: 'Warga ini tidak memiliki jabatan pengurus', code: 'NOT_FOUND' };
    }
  } else {
    await residentRepository.upsertPengurusRt(masyarakat.idMasyarakat, {
      jabatan: data.jabatan,
      periodeJabatan: data.periodeJabatan || '',
    });
  }

  return { message: 'Jabatan pengurus berhasil diperbarui.' };
}
