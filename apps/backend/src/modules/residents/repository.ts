import { prisma } from '../../db/prisma.js';

export async function createMasyarakat(data: {
  nik: string; email: string; nama: string; alamat: string; noHp: string; username: string; password: string;
}) {
  return prisma.masyarakat.create({ data });
}

export async function createWarga(data: { idMasyarakat: string; statusKeanggotaan: string }) {
  return prisma.warga.create({ data });
}

export async function findMasyarakatByNik(nik: string) {
  return prisma.masyarakat.findUnique({ where: { nik } });
}

export async function findMasyarakatByEmail(email: string) {
  return prisma.masyarakat.findUnique({ where: { email } });
}

export async function findMasyarakatByUsername(username: string) {
  return prisma.masyarakat.findFirst({ where: { username } });
}

export async function findAllWarga(search?: string, status?: string) {
  const where: any = {};
  if (status) where.statusKeanggotaan = status;
  if (search) {
    where.masyarakat = {
      OR: [
        { nama: { contains: search } },
        { nik: { contains: search } },
      ],
    };
  }
  const data = await prisma.warga.findMany({
    where,
    include: { masyarakat: true },
    orderBy: { idWarga: 'desc' },
  });
  return data.map((w: any) => ({
    id: w.idWarga,
    nik: w.masyarakat.nik,
    nama: w.masyarakat.nama,
    alamat: w.masyarakat.alamat,
    no_hp: w.masyarakat.noHp,
    statusKeanggotaan: w.statusKeanggotaan,
  }));
}

export async function findWargaById(id: string) {
  const w = await prisma.warga.findUnique({
    where: { idWarga: id },
    include: { masyarakat: true },
  });
  if (!w) return null;
  return {
    id: w.idWarga,
    nik: w.masyarakat.nik,
    nama: w.masyarakat.nama,
    alamat: w.masyarakat.alamat,
    noHp: w.masyarakat.noHp,
    statusKeanggotaan: w.statusKeanggotaan,
  };
}

export async function updateWargaAndMasyarakat(wargaId: string, data: { nama?: string; alamat?: string; noHp?: string }) {
  const warga = await prisma.warga.findUnique({
    where: { idWarga: wargaId },
    include: { masyarakat: true },
  });
  if (!warga) return null;

  const updateData: any = {};
  if (data.nama) updateData.nama = data.nama;
  if (data.alamat) updateData.alamat = data.alamat;
  if (data.noHp) updateData.noHp = data.noHp;

  if (Object.keys(updateData).length > 0) {
    await prisma.masyarakat.update({
      where: { idMasyarakat: warga.idMasyarakat },
      data: updateData,
    });
  }
  return findWargaById(wargaId);
}

export async function findPendingVerifications() {
  const data = await prisma.warga.findMany({
    where: { statusKeanggotaan: 'PENDING' },
    include: { masyarakat: true },
    orderBy: { idWarga: 'desc' },
  });
  return data.map((w: any) => ({
    id: w.idWarga,
    nik: w.masyarakat.nik,
    nama: w.masyarakat.nama,
    alamat: w.masyarakat.alamat,
    no_hp: w.masyarakat.noHp,
  }));
}

export async function updateVerificationStatus(wargaId: string, status: string) {
  return prisma.warga.update({
    where: { idWarga: wargaId },
    data: { statusKeanggotaan: status },
  });
}

export async function findAllOfficers() {
  const data = await prisma.pengurusRt.findMany({
    include: { masyarakat: true },
  });
  return data.map((p: any) => ({
    id: p.idPengurus,
    nama: p.masyarakat.nama,
    nik: p.masyarakat.nik,
    jabatan: p.jabatan,
    periodeJabatan: p.periodeJabatan,
  }));
}

export async function upsertPengurusRt(idMasyarakat: string, data: { jabatan: string; periodeJabatan: string }) {
  return prisma.pengurusRt.upsert({
    where: { idMasyarakat },
    create: { idMasyarakat, ...data },
    update: data,
  });
}

export async function deletePengurusRt(idMasyarakat: string) {
  return prisma.pengurusRt.delete({ where: { idMasyarakat } });
}

export async function findMasyarakatById(id: string) {
  return prisma.masyarakat.findUnique({
    where: { idMasyarakat: id },
    include: { warga: true },
  });
}
