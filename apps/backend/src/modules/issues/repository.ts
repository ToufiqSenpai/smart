import { $Enums } from '../../generated/prisma/client.js';
import { prisma } from '../../db/prisma.js';

export type IssueStatus = $Enums.StatusLaporan;

interface CreateIssueData {
  idWarga: string;
  kategoriKendala: string;
  deskripsi: string;
  fotoKendala?: string;
  tanggalLapor: Date;
  statusLaporan: $Enums.StatusLaporan;
}

interface UpdateIssueData {
  kategoriKendala?: string;
  deskripsi?: string;
  fotoKendala?: string;
}

export async function findAll() {
  const data = await prisma.laporanKendala.findMany({
    include: { warga: { include: { masyarakat: true } } },
    orderBy: { tanggalLapor: 'desc' },
  });
  return data.map((item: any) => ({
    id: item.idLaporan,
    pelapor: item.warga.masyarakat.nama,
    kategori_kendala: item.kategoriKendala,
    deskripsi: item.deskripsi,
    foto_kendala: item.fotoKendala,
    tanggal_lapor: item.tanggalLapor,
    status_laporan: item.statusLaporan,
    tanggapan: item.tanggapan,
  }));
}

export async function findById(id: string) {
  const item = await prisma.laporanKendala.findUnique({
    where: { idLaporan: id },
    include: { warga: { include: { masyarakat: true } } },
  });
  if (!item) return null;
  return {
    id: item.idLaporan,
    pelapor: item.warga.masyarakat.nama,
    kategori_kendala: item.kategoriKendala,
    deskripsi: item.deskripsi,
    foto_kendala: item.fotoKendala,
    tanggal_lapor: item.tanggalLapor,
    status_laporan: item.statusLaporan,
    tanggapan: item.tanggapan,
  };
}

export async function findByWargaId(wargaId: string) {
  const data = await prisma.laporanKendala.findMany({
    where: { idWarga: wargaId },
    orderBy: { tanggalLapor: 'desc' },
  });
  return data.map((item: any) => ({
    id: item.idLaporan,
    kategori_kendala: item.kategoriKendala,
    deskripsi: item.deskripsi,
    foto_kendala: item.fotoKendala,
    tanggal_lapor: item.tanggalLapor,
    status_laporan: item.statusLaporan,
    tanggapan: item.tanggapan,
  }));
}

export async function create(data: CreateIssueData) {
  const item = await prisma.laporanKendala.create({ data });
  return item;
}

export async function update(id: string, data: UpdateIssueData) {
  const item = await prisma.laporanKendala.update({
    where: { idLaporan: id },
    data,
  });
  return item;
}

export async function updateStatus(id: string, statusLaporan: $Enums.StatusLaporan) {
  const item = await prisma.laporanKendala.update({
    where: { idLaporan: id },
    data: { statusLaporan },
  });
  return item;
}

export async function updateFollowUp(id: string, tanggapan: string, idPengurus: string) {
  const item = await prisma.laporanKendala.update({
    where: { idLaporan: id },
    data: { tanggapan, idPengurus },
  });
  return item;
}
