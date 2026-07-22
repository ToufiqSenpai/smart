import * as profileRepository from './repository.js';
import type { AuthUser } from '../../middleware/auth.js';

export async function getProfile(user: AuthUser) {
  const masyarakat = await profileRepository.findMasyarakatById(user.id);
  if (!masyarakat) {
    throw { status: 404, message: 'Data tidak ditemukan', code: 'NOT_FOUND' };
  }

  return {
    id: masyarakat.idMasyarakat,
    nik: masyarakat.nik,
    nama: masyarakat.nama,
    alamat: masyarakat.alamat,
    noHp: masyarakat.noHp,
    username: masyarakat.username,
    role: user.role,
    statusKeanggotaan: masyarakat.warga?.statusKeanggotaan ?? null,
  };
}

export async function updateProfile(user: AuthUser, data: { nama?: string; alamat?: string; no_hp?: string }) {
  const allowedFields = ['nama', 'alamat', 'no_hp'];
  const invalidFields = Object.keys(data).filter((key) => !allowedFields.includes(key));
  if (invalidFields.length > 0) {
    throw { status: 400, message: `Field tidak valid: ${invalidFields.join(', ')}`, code: 'VALIDATION_ERROR' };
  }

  const updateData: { nama?: string; alamat?: string; noHp?: string } = {};
  if (data.nama !== undefined) updateData.nama = data.nama;
  if (data.alamat !== undefined) updateData.alamat = data.alamat;
  if (data.no_hp !== undefined) updateData.noHp = data.no_hp;

  if (Object.keys(updateData).length === 0) {
    throw { status: 400, message: 'Tidak ada data yang diupdate', code: 'VALIDATION_ERROR' };
  }

  await profileRepository.updateMasyarakat(user.id, updateData);
  return { message: 'Profil berhasil diperbarui.' };
}
