import { $Enums } from "../../generated/prisma/client.js";
import { prisma } from "../../db/prisma.js";

export async function findMasyarakatById(id: string) {
  return prisma.masyarakat.findUnique({
    where: { idMasyarakat: id },
    include: {
      warga: true,
      pengurusRt: true,
    },
  });
}

export async function countAllWarga() {
  return prisma.warga.count();
}

export async function countWargaByStatus(status: $Enums.StatusKeanggotaan) {
  return prisma.warga.count({ where: { statusKeanggotaan: status } });
}

export async function countAllUmkm() {
  return prisma.umkm.count();
}

export async function countUmkmByWargaId(idWarga: string) {
  return prisma.umkm.count({ where: { idWarga } });
}

export async function countAllLaporanKendala() {
  return prisma.laporanKendala.count();
}

export async function countLaporanByWargaId(idWarga: string) {
  return prisma.laporanKendala.count({ where: { idWarga } });
}

export async function countIuranAktif() {
  return prisma.iuran.count({ where: { statusAktif: true } });
}

export async function countPengumumanByStatus(status: $Enums.StatusPublikasi) {
  return prisma.pengumuman.count({ where: { statusPublikasi: status } });
}

export async function countUnpaidBills(idWarga: string) {
  const wargaId = idWarga;
  const activeIuran = await prisma.iuran.findMany({
    where: { statusAktif: true },
    select: { idIuran: true },
  });

  if (activeIuran.length === 0) return 0;

  const currentMonth = new Date().toISOString().slice(0, 7);
  const paidCount = await prisma.pembayaranIuran.count({
    where: {
      idWarga: wargaId,
      idIuran: { in: activeIuran.map((i) => i.idIuran) },
      periode: currentMonth,
      statusVerifikasi: "VERIFIED",
    },
  });

  return activeIuran.length - paidCount;
}

export async function sumPengeluaranKas() {
  const result = await prisma.pengeluaranKas.aggregate({
    _sum: { nominalPengeluaran: true },
  });
  return result._sum.nominalPengeluaran ? Number(result._sum.nominalPengeluaran) : 0;
}

export async function countUmkmPending() {
  return prisma.umkm.count({ where: { statusVerifikasi: "PENDING" } });
}

export async function countPaymentsPending() {
  return prisma.pembayaranIuran.count({ where: { statusVerifikasi: "PENDING" } });
}

export async function countIssuesByStatus(status: $Enums.StatusLaporan) {
  return prisma.laporanKendala.count({ where: { statusLaporan: status } });
}

export async function findRecentIssues(limit: number) {
  return prisma.laporanKendala.findMany({
    orderBy: { tanggalLapor: "desc" },
    take: limit,
  });
}

export async function findRecentPayments(limit: number) {
  return prisma.pembayaranIuran.findMany({
    orderBy: { tanggalBayar: "desc" },
    take: limit,
    include: {
      iuran: { select: { namaIuran: true } },
      warga: { include: { masyarakat: { select: { nama: true } } } },
    },
  });
}

export async function findRecentAnnouncements(limit: number) {
  return prisma.pengumuman.findMany({
    orderBy: { tanggalPengumuman: "desc" },
    take: limit,
  });
}