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
  const data = await prisma.pengeluaranKas.findMany({
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
  return data.map((item: any) => ({
    id: item.idPengeluaran,
    idPengurus: item.idPengurus,
    kategori_pengeluaran: item.kategoriPengeluaran,
    nominal_pengeluaran: Number(item.nominalPengeluaran),
    tanggal_keluar: item.tanggalKeluar.toISOString().split("T")[0],
    keterangan: item.keterangan,
    bukti_nota: item.buktiNota,
    dibuat_oleh: item.pengurus.masyarakat.nama,
  }));
}

// Get specific expense by ID
export async function findById(id: string) {
  const item = await prisma.pengeluaranKas.findUnique({
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
  if (!item) return null;
  return {
    id: item.idPengeluaran,
    idPengurus: item.idPengurus,
    kategori_pengeluaran: item.kategoriPengeluaran,
    nominal_pengeluaran: Number(item.nominalPengeluaran),
    tanggal_keluar: item.tanggalKeluar.toISOString().split("T")[0],
    keterangan: item.keterangan,
    bukti_nota: item.buktiNota,
    dibuat_oleh: item.pengurus.masyarakat.nama,
  };
}

// Create expense (chairperson only)
export async function create(idPengurus: string, payload: CreateExpenseBody) {
  const item = await prisma.pengeluaranKas.create({
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
  return {
    id: item.idPengeluaran,
    kategori_pengeluaran: item.kategoriPengeluaran,
    nominal_pengeluaran: Number(item.nominalPengeluaran),
    tanggal_keluar: item.tanggalKeluar.toISOString().split("T")[0],
    keterangan: item.keterangan,
    bukti_nota: item.buktiNota,
    dibuat_oleh: item.pengurus.masyarakat.nama,
  };
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

  const item = await prisma.pengeluaranKas.update({
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
  return {
    id: item.idPengeluaran,
    kategori_pengeluaran: item.kategoriPengeluaran,
    nominal_pengeluaran: Number(item.nominalPengeluaran),
    tanggal_keluar: item.tanggalKeluar.toISOString().split("T")[0],
    keterangan: item.keterangan,
    bukti_nota: item.buktiNota,
    dibuat_oleh: item.pengurus.masyarakat.nama,
  };
}

// Delete expense (chairperson only - originally created by)
export async function deleteExpense(id: string) {
  return prisma.pengeluaranKas.delete({
    where: { idPengeluaran: id },
  });
}

// Get finance report grouped by period
export async function getReport(periode?: string) {
  // Filter verified payments as income
  const wherePembayaran: any = {
    statusVerifikasi: "VERIFIED",
  };

  // Filter expenses
  const wherePengeluaran: any = {};

  if (periode && periode !== "all") {
    const [year, month] = periode.split("-");
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0);

    wherePembayaran.tanggalBayar = { gte: startDate, lte: endDate };
    wherePengeluaran.tanggalKeluar = { gte: startDate, lte: endDate };
  }

  const [payments, expenses] = await Promise.all([
    prisma.pembayaranIuran.findMany({
      where: wherePembayaran,
      include: {
        warga: { include: { masyarakat: { select: { nama: true } } } },
        iuran: { select: { namaIuran: true } },
      },
      orderBy: { tanggalBayar: "desc" },
    }),
    prisma.pengeluaranKas.findMany({
      where: wherePengeluaran,
      include: {
        pengurus: {
          include: { masyarakat: { select: { nama: true } } },
        },
      },
      orderBy: { tanggalKeluar: "desc" },
    }),
  ]);

  const pemasukan = payments.map((p: any) => ({
    warga: p.warga?.masyarakat?.nama ?? "Warga",
    iuran: p.iuran?.namaIuran ?? "Iuran",
    periode: p.periode,
    tanggal: p.tanggalBayar.toISOString().split("T")[0],
    nominal: Number(p.jumlahBayar),
  }));

  const pengeluaran = expenses.map((e: any) => ({
    kategori: e.kategoriPengeluaran,
    keterangan: e.keterangan,
    tanggal: e.tanggalKeluar.toISOString().split("T")[0],
    nominal: Number(e.nominalPengeluaran),
  }));

  return { pemasukan, pengeluaran };
}
