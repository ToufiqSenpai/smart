import { prisma } from '../../db/prisma.js';

interface CreateAnnouncementData {
  idPengurus: string;
  judul: string;
  isiPengumuman: string;
  lampiran?: string;
  tanggalPengumuman: Date;
  statusPublikasi: string;
}

interface UpdateAnnouncementData {
  judul?: string;
  isiPengumuman?: string;
  lampiran?: string;
  statusPublikasi?: string;
}

export async function findAll() {
  const data = await prisma.pengumuman.findMany({
    include: { pengurus: { include: { masyarakat: true } } },
    orderBy: { tanggalPengumuman: 'desc' },
  });
  return data.map((item: { idPengumuman: string; judul: string; tanggalPengumuman: Date; statusPublikasi: string; pengurus: { masyarakat: { nama: string } } }) => ({
    id: item.idPengumuman,
    judul: item.judul,
    tanggal_pengumuman: item.tanggalPengumuman,
    status_publikasi: item.statusPublikasi,
    nama_pembuat: item.pengurus.masyarakat.nama,
  }));
}

export async function findById(id: string) {
  const item = await prisma.pengumuman.findUnique({
    where: { idPengumuman: id },
    include: { pengurus: { include: { masyarakat: true } } },
  });
  if (!item) return null;
  return {
    id: item.idPengumuman,
    judul: item.judul,
    isi_pengumuman: item.isiPengumuman,
    lampiran: item.lampiran,
    tanggal_pengumuman: item.tanggalPengumuman,
    status_publikasi: item.statusPublikasi,
    nama_pembuat: item.pengurus.masyarakat.nama,
  };
}

export async function findByPengurusId(pengurusId: string) {
  const data = await prisma.pengumuman.findMany({
    where: { idPengurus: pengurusId },
    orderBy: { tanggalPengumuman: 'desc' },
  });
  return data.map((item: { idPengumuman: string; judul: string; tanggalPengumuman: Date; statusPublikasi: string }) => ({
    id: item.idPengumuman,
    judul: item.judul,
    tanggal_pengumuman: item.tanggalPengumuman,
    status_publikasi: item.statusPublikasi,
  }));
}

export async function create(data: CreateAnnouncementData) {
  return prisma.pengumuman.create({ data });
}

export async function update(id: string, data: UpdateAnnouncementData) {
  return prisma.pengumuman.update({
    where: { idPengumuman: id },
    data,
  });
}

export async function remove(id: string) {
  return prisma.pengumuman.delete({
    where: { idPengumuman: id },
  });
}
