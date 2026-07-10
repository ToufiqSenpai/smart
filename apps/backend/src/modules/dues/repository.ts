import { prisma } from "../../db/prisma.js";

// ===================== Iuran (Master) =====================

export async function findAllIuran() {
  return prisma.iuran.findMany({
    orderBy: { tanggalJatuhTempo: "desc" },
  });
}

export async function findIuranById(id: string) {
  return prisma.iuran.findUnique({
    where: { idIuran: id },
  });
}

export async function createIuran(
  idKetuaRt: string,
  data: { namaIuran: string; nominal: number; tanggalJatuhTempo: Date },
) {
  return prisma.iuran.create({
    data: {
      namaIuran: data.namaIuran,
      nominal: data.nominal,
      tanggalJatuhTempo: data.tanggalJatuhTempo,
      statusAktif: true,
      idKetuaRt,
    },
  });
}

export async function updateIuran(
  id: string,
  data: { namaIuran?: string; nominal?: number; tanggalJatuhTempo?: Date },
) {
  return prisma.iuran.update({
    where: { idIuran: id },
    data,
  });
}

export async function updateIuranStatus(id: string, statusAktif: boolean) {
  return prisma.iuran.update({
    where: { idIuran: id },
    data: { statusAktif },
  });
}

export async function findIuranAktif() {
  return prisma.iuran.findMany({
    where: { statusAktif: true },
  });
}

// ===================== Pembayaran Iuran (Payments) =====================

export async function createPayment(data: {
  idWarga: string;
  idIuran: string;
  periode: string;
  idPengurus: string;
  tanggalBayar: Date;
  metodeBayar: string;
  jumlahBayar: number;
  buktiPembayaran: string;
  statusVerifikasi: string;
}) {
  return prisma.pembayaranIuran.create({ data });
}

export async function findAllPayments() {
  return prisma.pembayaranIuran.findMany({
    include: {
      warga: { include: { masyarakat: true } },
      iuran: true,
    },
    orderBy: { tanggalBayar: "desc" },
  });
}

export async function findPaymentById(id: string) {
  return prisma.pembayaranIuran.findUnique({
    where: { idPembayaran: id },
    include: {
      warga: { include: { masyarakat: true } },
      iuran: true,
    },
  });
}

export async function updatePaymentStatus(id: string, statusVerifikasi: string) {
  return prisma.pembayaranIuran.update({
    where: { idPembayaran: id },
    data: { statusVerifikasi },
  });
}

export async function findPaymentsByWargaId(idWarga: string) {
  return prisma.pembayaranIuran.findMany({
    where: { idWarga },
    include: { iuran: true },
    orderBy: { tanggalBayar: "desc" },
  });
}

export async function findPaymentByWargaAndIuranAndPeriode(
  idWarga: string,
  idIuran: string,
  periode: string,
) {
  return prisma.pembayaranIuran.findFirst({
    where: { idWarga, idIuran, periode },
  });
}
