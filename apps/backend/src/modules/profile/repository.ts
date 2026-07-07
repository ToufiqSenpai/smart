import { prisma } from '../../db/prisma.js';

export async function findMasyarakatById(id: string) {
  return prisma.masyarakat.findUnique({
    where: { idMasyarakat: id },
    include: { warga: true, pengurusRt: true },
  });
}

export async function updateMasyarakat(id: string, data: { nama?: string; alamat?: string; noHp?: string }) {
  return prisma.masyarakat.update({
    where: { idMasyarakat: id },
    data,
  });
}
