import { $Enums } from "../../generated/prisma/client.js";
import { prisma } from "../../db/prisma.js";
import { Decimal } from "@prisma/client/runtime/client";

// ===================== Iuran (Master) =====================

export async function findAllIuran() {
  return prisma.iuran.findMany({
    select: {
      idIuran: true,
      namaIuran: true,
      jenisIuran: true,
      nominal: true,
      tanggalJatuhTempo: true,
      statusAktif: true,
      idKetuaRt: true,
    },
    orderBy: { tanggalJatuhTempo: "desc" },
  });
}

export async function findIuranById(id: string) {
  return prisma.iuran.findUnique({
    where: { idIuran: id },
    select: {
      idIuran: true,
      namaIuran: true,
      jenisIuran: true,
      nominal: true,
      tanggalJatuhTempo: true,
      statusAktif: true,
      idKetuaRt: true,
    },
  });
}

export async function createIuran(
  idKetuaRt: string,
  data: { namaIuran: string; jenisIuran: string; nominal: Decimal; tanggalJatuhTempo: Date },
) {
  return prisma.iuran.create({
    data: {
      namaIuran: data.namaIuran,
      jenisIuran: data.jenisIuran,
      nominal: data.nominal,
      tanggalJatuhTempo: data.tanggalJatuhTempo,
      statusAktif: true,
      idKetuaRt,
    },
    select: {
      idIuran: true,
      namaIuran: true,
      jenisIuran: true,
      nominal: true,
      tanggalJatuhTempo: true,
      statusAktif: true,
    },
  });
}

export async function updateIuran(
  id: string,
  data: {
    namaIuran?: string;
    jenisIuran?: string;
    nominal?: Decimal;
    tanggalJatuhTempo?: Date;
  },
) {
  return prisma.iuran.update({
    where: { idIuran: id },
    data,
    select: {
      idIuran: true,
      namaIuran: true,
      jenisIuran: true,
      nominal: true,
      tanggalJatuhTempo: true,
      statusAktif: true,
    },
  });
}

export async function updateIuranStatus(id: string, statusAktif: boolean) {
  return prisma.iuran.update({
    where: { idIuran: id },
    data: { statusAktif },
    select: {
      idIuran: true,
      statusAktif: true,
    },
  });
}

export async function findIuranAktif() {
  return prisma.iuran.findMany({
    where: { statusAktif: true },
    select: {
      idIuran: true,
      namaIuran: true,
      jenisIuran: true,
      nominal: true,
      tanggalJatuhTempo: true,
      statusAktif: true,
    },
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
  jumlahBayar: Decimal;
  buktiPembayaran: string;
  statusVerifikasi: $Enums.StatusVerifikasi;
}) {
  return prisma.pembayaranIuran.create({
    data,
    select: {
      idPembayaran: true,
      periode: true,
      jumlahBayar: true,
      statusVerifikasi: true,
    },
  });
}

export async function findAllPayments() {
  return prisma.pembayaranIuran.findMany({
    include: {
      warga: {
        include: {
          masyarakat: {
            select: {
              nama: true,
            },
          },
        },
      },
      iuran: {
        select: {
          namaIuran: true,
          jenisIuran: true,
        },
      },
    },
    orderBy: { tanggalBayar: "desc" },
  });
}

export async function findPaymentById(id: string) {
  return prisma.pembayaranIuran.findUnique({
    where: { idPembayaran: id },
    include: {
      warga: {
        include: {
          masyarakat: {
            select: {
              nama: true,
            },
          },
        },
      },
      iuran: {
        select: {
          namaIuran: true,
          jenisIuran: true,
        },
      },
    },
  });
}

export async function updatePaymentStatus(
  id: string,
  statusVerifikasi: $Enums.StatusVerifikasi,
) {
  return prisma.pembayaranIuran.update({
    where: { idPembayaran: id },
    data: { statusVerifikasi },
    select: {
      idPembayaran: true,
      statusVerifikasi: true,
    },
  });
}

export async function findPaymentsByWargaId(idWarga: string) {
  return prisma.pembayaranIuran.findMany({
    where: { idWarga },
    include: {
      iuran: {
        select: {
          namaIuran: true,
        },
      },
    },
    orderBy: { tanggalBayar: "desc" },
  });
}

export async function countOtherOfficers(excludeIdPengurus: string) {
  return prisma.pengurusRt.count({
    where: { idPengurus: { not: excludeIdPengurus } },
  });
}

export async function findPaymentByWargaAndIuranAndPeriode(
  idWarga: string,
  idIuran: string,
  periode: string,
) {
  return prisma.pembayaranIuran.findFirst({
    where: { idWarga, idIuran, periode },
    select: {
      idPembayaran: true,
      statusVerifikasi: true,
    },
  });
}
