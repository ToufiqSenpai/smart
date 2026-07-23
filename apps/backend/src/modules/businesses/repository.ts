import { $Enums } from '../../generated/prisma/client.js';
import { prisma } from '../../db/prisma.js';

interface CreateBusinessData {
  idWarga: string;
  namaUsaha: string;
  jenisUsaha: string;
  deskripsiUsaha: string;
  alamatUsaha: string;
  kontakUsaha: string;
  fotoUsaha?: string;
  statusVerifikasi: $Enums.StatusVerifikasi;
}

interface UpdateBusinessData {
  namaUsaha?: string;
  jenisUsaha?: string;
  deskripsiUsaha?: string;
  alamatUsaha?: string;
  kontakUsaha?: string;
  fotoUsaha?: string;
}

export async function findAll(keyword?: string, jenisUsaha?: string) {
  const where: any = {};
  if (keyword) {
    where.namaUsaha = { contains: keyword, mode: 'insensitive' };
  }
  if (jenisUsaha) {
    where.jenisUsaha = jenisUsaha;
  }

  const data = await prisma.umkm.findMany({
    where,
    include: { warga: { include: { masyarakat: true } } },
    orderBy: { idUmkm: 'desc' },
  });
  return data.map((item: { idUmkm: string; namaUsaha: string; jenisUsaha: string; alamatUsaha: string; statusVerifikasi: string; warga: { masyarakat: { nama: string } } }) => ({
    id: item.idUmkm,
    nama_usaha: item.namaUsaha,
    jenis_usaha: item.jenisUsaha,
    alamat_usaha: item.alamatUsaha,
    status_verifikasi: item.statusVerifikasi,
    pemilik: item.warga.masyarakat.nama,
  }));
}

export async function findById(id: string) {
  const item = await prisma.umkm.findUnique({
    where: { idUmkm: id },
    include: { warga: { include: { masyarakat: true } } },
  });
  if (!item) return null;
  return {
    id: item.idUmkm,
    nama_usaha: item.namaUsaha,
    jenis_usaha: item.jenisUsaha,
    deskripsi_usaha: item.deskripsiUsaha,
    alamat_usaha: item.alamatUsaha,
    kontak_usaha: item.kontakUsaha,
    foto_usaha: item.fotoUsaha,
    status_verifikasi: item.statusVerifikasi,
    pemilik: item.warga.masyarakat.nama,
  };
}

export async function findByWargaId(wargaId: string) {
  const data = await prisma.umkm.findMany({
    where: { idWarga: wargaId },
    include: { warga: { include: { masyarakat: { select: { nama: true } } } } },
    orderBy: { idUmkm: 'desc' },
  });
  return data.map((item: any) => ({
    id: item.idUmkm,
    nama_usaha: item.namaUsaha,
    jenis_usaha: item.jenisUsaha,
    status_verifikasi: item.statusVerifikasi,
    pemilik: item.warga.masyarakat.nama,
  }));
}

export async function create(data: CreateBusinessData) {
  return prisma.umkm.create({ data });
}

export async function update(id: string, data: UpdateBusinessData) {
  return prisma.umkm.update({
    where: { idUmkm: id },
    data,
  });
}

export async function updateStatus(id: string, statusVerifikasi: $Enums.StatusVerifikasi, idPengurus: string) {
  return prisma.umkm.update({
    where: { idUmkm: id },
    data: { statusVerifikasi, idPengurus },
  });
}
