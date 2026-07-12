import { prisma } from "../../db/prisma.js";
import { Decimal } from "@prisma/client/runtime/client";

interface CreateExpenseBody {
  kategoriPengeluaran: string;
  nominalPengeluaran: number;
  tanggalKeluar: string;
  keterangan: string;
  buktiNota?: string | null;
}

interface UpdateExpenseBody {
  kategoriPengeluaran?: string;
  nominalPengeluaran?: number;
  tanggalKeluar?: string;
  keterangan?: string;
  buktiNota?: string | null;
}

// Get all expenses (no filter - accessible by officers)
export async function findAll() {
  return prisma.pengeluaranKas.findMany({
    include: {
      pengurus: {
        select: {
          idPengurus: true,
          jabatan: true,
          masyarakat: {
            select: {
              nama: true,
            },
          },
        },
      },
    },
    orderBy: { tanggalKeluar: "desc" },
  });
}

// Get specific expense by ID
export async function findById(id: string) {
  return prisma.pengeluaranKas.findUnique({
    where: { idPengeluaran: id },
    include: {
      pengurus: {
        select: {
          idPengurus: true,
          jabatan: true,
          masyarakat: {
            select: {
              nama: true,
            },
          },
        },
      },
    },
  });
}

// Create expense (chairperson only)
export async function create(idPengurus: string, payload: CreateExpenseBody) {
  return prisma.pengeluaranKas.create({
    data: {
      idPengurus,
      kategoriPengeluaran: payload.kategoriPengeluaran.trim(),
      nominalPengeluaran: new Decimal(payload.nominalPengeluaran),
      tanggalKeluar: new Date(payload.tanggalKeluar),
      keterangan: payload.keterangan.trim(),
      buktiNota: payload.buktiNota ?? null,
    },
    include: {
      pengurus: {
        select: {
          idPengurus: true,
          masyarakat: {
            select: {
              nama: true,
            },
          },
        },
      },
    },
  });
}

// Update expense (chairperson only - originally created by)
export async function update(id: string, payload: UpdateExpenseBody) {
  const data: Record<string, unknown> = {};

  if (payload.kategoriPengeluaran !== undefined)
    data.kategoriPengeluaran = payload.kategoriPengeluaran.trim();
  if (payload.nominalPengeluaran !== undefined)
    data.nominalPengeluaran = new Decimal(payload.nominalPengeluaran);
  if (payload.tanggalKeluar !== undefined)
    data.tanggalKeluar = new Date(payload.tanggalKeluar);
  if (payload.keterangan !== undefined)
    data.keterangan = payload.keterangan.trim();
  if (payload.buktiNota !== undefined)
    data.buktiNota = payload.buktiNota ?? null;

  return prisma.pengeluaranKas.update({
    where: { idPengeluaran: id },
    data,
    include: {
      pengurus: {
        select: {
          idPengurus: true,
          masyarakat: {
            select: {
              nama: true,
            },
          },
        },
      },
    },
  });
}

// Delete expense (chairperson only - originally created by)
export async function deleteExpense(id: string) {
  return prisma.pengeluaranKas.delete({
    where: { idPengeluaran: id },
  });
}
