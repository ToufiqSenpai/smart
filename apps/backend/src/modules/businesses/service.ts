import { $Enums } from '../../generated/prisma/client.js';
import * as businessRepository from './repository.js';
import type { AuthUser } from '../../middleware/auth.js';

export async function listBusinesses(user: AuthUser, query: { keyword?: string; jenis_usaha?: string }) {
  return businessRepository.findAll(query.keyword, query.jenis_usaha);
}

export async function createBusiness(user: AuthUser, data: { nama_usaha: string; jenis_usaha: string; deskripsi_usaha: string; alamat_usaha: string; kontak_usaha: string; foto_usaha?: string }) {
  if (!data.nama_usaha || !data.jenis_usaha || !data.deskripsi_usaha || !data.alamat_usaha || !data.kontak_usaha) {
    throw { status: 400, message: 'nama_usaha, jenis_usaha, deskripsi_usaha, alamat_usaha, dan kontak_usaha wajib diisi', code: 'VALIDATION_ERROR' };
  }
  if (!user.idWarga) {
    throw { status: 400, message: 'Anda belum terdaftar sebagai warga', code: 'NOT_A_RESIDENT' };
  }

  await businessRepository.create({
    idWarga: user.idWarga,
    namaUsaha: data.nama_usaha,
    jenisUsaha: data.jenis_usaha,
    deskripsiUsaha: data.deskripsi_usaha,
    alamatUsaha: data.alamat_usaha,
    kontakUsaha: data.kontak_usaha,
    fotoUsaha: data.foto_usaha,
    statusVerifikasi: 'PENDING',
  });
  return { message: 'UMKM berhasil didaftarkan.' };
}

export async function getMyBusinesses(user: AuthUser) {
  if (!user.idWarga) {
    return [];
  }
  return businessRepository.findByWargaId(user.idWarga);
}

export async function getBusinessById(businessId: string, user: AuthUser) {
  const business = await businessRepository.findById(businessId);
  if (!business) {
    throw { status: 404, message: 'UMKM tidak ditemukan', code: 'NOT_FOUND' };
  }
  return business;
}

export async function updateBusiness(businessId: string, user: AuthUser, data: { nama_usaha?: string; jenis_usaha?: string; deskripsi_usaha?: string; alamat_usaha?: string; kontak_usaha?: string; foto_usaha?: string }) {
  const business = await businessRepository.findById(businessId);
  if (!business) {
    throw { status: 404, message: 'UMKM tidak ditemukan', code: 'NOT_FOUND' };
  }

  const myBusinesses = await businessRepository.findByWargaId(user.idWarga!);
  const owned = myBusinesses.some((b: { id: string }) => b.id === businessId);
  if (!owned) {
    throw { status: 401, message: 'Tidak memiliki hak akses', code: 'UNAUTHORIZED' };
  }

  await businessRepository.update(businessId, {
    ...(data.nama_usaha && { namaUsaha: data.nama_usaha }),
    ...(data.jenis_usaha && { jenisUsaha: data.jenis_usaha }),
    ...(data.deskripsi_usaha && { deskripsiUsaha: data.deskripsi_usaha }),
    ...(data.alamat_usaha && { alamatUsaha: data.alamat_usaha }),
    ...(data.kontak_usaha && { kontakUsaha: data.kontak_usaha }),
    ...(data.foto_usaha !== undefined && { fotoUsaha: data.foto_usaha }),
  });
  return { message: 'Data UMKM berhasil diperbarui.' };
}

export async function validateBusiness(businessId: string, user: AuthUser, status: string) {
  if (!['VERIFIED', 'REJECTED'].includes(status)) {
    throw { status: 400, message: 'Status verifikasi tidak valid', code: 'VALIDATION_ERROR' };
  }
  if (!user.idPengurus) {
    throw { status: 400, message: 'Anda tidak terdaftar sebagai pengurus', code: 'NOT_AN_OFFICER' };
  }

  const business = await businessRepository.findById(businessId);
  if (!business) {
    throw { status: 404, message: 'UMKM tidak ditemukan', code: 'NOT_FOUND' };
  }

  await businessRepository.updateStatus(businessId, status as $Enums.StatusVerifikasi, user.idPengurus);
  return { message: 'Status UMKM berhasil diperbarui.' };
}
