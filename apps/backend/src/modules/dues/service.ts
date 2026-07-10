import * as duesRepository from "./repository.js";
import type { AuthUser } from "../../middleware/auth.js";

// ===================== Iuran (Master) =====================

export async function listIuran() {
  const data = await duesRepository.findAllIuran();
  return data.map((i) => ({
    id: i.idIuran,
    nama_iuran: i.namaIuran,
    nominal: Number(i.nominal),
    tanggal_jatuh_tempo: i.tanggalJatuhTempo.toISOString().split("T")[0],
    status_aktif: i.statusAktif,
  }));
}

export async function getIuranById(id: string) {
  const iuran = await duesRepository.findIuranById(id);
  if (!iuran) {
    throw { status: 404, message: "Data iuran tidak ditemukan", code: "NOT_FOUND" };
  }
  return {
    id: iuran.idIuran,
    nama_iuran: iuran.namaIuran,
    nominal: Number(iuran.nominal),
    tanggal_jatuh_tempo: iuran.tanggalJatuhTempo.toISOString().split("T")[0],
    status_aktif: iuran.statusAktif,
  };
}

export async function addIuran(
  user: AuthUser,
  payload: { nama_iuran: string; nominal: number; tanggal_jatuh_tempo: string },
) {
  const { nama_iuran, nominal, tanggal_jatuh_tempo } = payload;

  if (!nama_iuran) {
    throw { status: 400, message: "nama_iuran is required", code: "VALIDATION_ERROR" };
  }
  if (nominal === undefined || nominal === null || isNaN(Number(nominal)) || Number(nominal) < 0) {
    throw { status: 400, message: "nominal must be a valid positive number", code: "VALIDATION_ERROR" };
  }
  if (!tanggal_jatuh_tempo || isNaN(Date.parse(tanggal_jatuh_tempo))) {
    throw { status: 400, message: "tanggal_jatuh_tempo must be a valid date", code: "VALIDATION_ERROR" };
  }

  await duesRepository.createIuran(user.idPengurus!, {
    namaIuran: nama_iuran,
    nominal: Number(nominal),
    tanggalJatuhTempo: new Date(tanggal_jatuh_tempo),
  });

  return { message: "Data iuran berhasil ditambahkan." };
}

export async function editIuran(
  id: string,
  payload: { nama_iuran?: string; nominal?: number; tanggal_jatuh_tempo?: string },
) {
  const existing = await duesRepository.findIuranById(id);
  if (!existing) {
    throw { status: 404, message: "Data iuran tidak ditemukan", code: "NOT_FOUND" };
  }

  if (Object.keys(payload).length === 0) {
    throw { status: 400, message: "at least one field must be provided", code: "VALIDATION_ERROR" };
  }

  const data: { namaIuran?: string; nominal?: number; tanggalJatuhTempo?: Date } = {};
  if (payload.nama_iuran !== undefined) data.namaIuran = payload.nama_iuran;
  if (payload.nominal !== undefined) {
    if (isNaN(Number(payload.nominal)) || Number(payload.nominal) < 0) {
      throw { status: 400, message: "nominal must be a valid positive number", code: "VALIDATION_ERROR" };
    }
    data.nominal = Number(payload.nominal);
  }
  if (payload.tanggal_jatuh_tempo !== undefined) {
    if (isNaN(Date.parse(payload.tanggal_jatuh_tempo))) {
      throw { status: 400, message: "tanggal_jatuh_tempo must be a valid date", code: "VALIDATION_ERROR" };
    }
    data.tanggalJatuhTempo = new Date(payload.tanggal_jatuh_tempo);
  }

  await duesRepository.updateIuran(id, data);
  return { message: "Data iuran berhasil diperbarui." };
}

export async function toggleIuranStatus(id: string, status: string) {
  if (!["ACTIVE", "INACTIVE"].includes(status)) {
    throw { status: 400, message: "Status must be ACTIVE or INACTIVE", code: "VALIDATION_ERROR" };
  }

  const existing = await duesRepository.findIuranById(id);
  if (!existing) {
    throw { status: 404, message: "Data iuran tidak ditemukan", code: "NOT_FOUND" };
  }

  await duesRepository.updateIuranStatus(id, status === "ACTIVE");
  return { message: "Status iuran berhasil diperbarui." };
}

// ===================== Bills (Tagihan) =====================

export async function getBills(user: AuthUser) {
  if (!user.idWarga) {
    throw { status: 400, message: "Hanya warga yang dapat melihat tagihan", code: "FORBIDDEN" };
  }

  const activeIuran = await duesRepository.findIuranAktif();
  const payments = await duesRepository.findPaymentsByWargaId(user.idWarga);

  const paidKeys = new Set(
    payments.map((p) => `${p.idIuran}-${p.periode}`),
  );

  const statusMap = new Map<string, string>();
  for (const p of payments) {
    const key = `${p.idIuran}-${p.periode}`;
    if (p.statusVerifikasi === "Terverifikasi") {
      statusMap.set(key, "VERIFIED");
    } else if (p.statusVerifikasi === "Menunggu") {
      if (!statusMap.has(key)) statusMap.set(key, "PENDING");
    } else if (p.statusVerifikasi === "Ditolak") {
      if (!statusMap.has(key)) statusMap.set(key, "REJECTED");
    }
  }

  const currentMonth = new Date().toISOString().slice(0, 7);
  const periods = [currentMonth];

  const bills: Array<{
    id_iuran: string;
    nama_iuran: string;
    periode: string;
    nominal: number;
    status: string;
  }> = [];

  for (const iuran of activeIuran) {
    for (const periode of periods) {
      const key = `${iuran.idIuran}-${periode}`;
      if (paidKeys.has(key)) {
        bills.push({
          id_iuran: iuran.idIuran,
          nama_iuran: iuran.namaIuran,
          periode,
          nominal: Number(iuran.nominal),
          status: statusMap.get(key) || "BELUM_DIBAYAR",
        });
      } else {
        bills.push({
          id_iuran: iuran.idIuran,
          nama_iuran: iuran.namaIuran,
          periode,
          nominal: Number(iuran.nominal),
          status: "BELUM_DIBAYAR",
        });
      }
    }
  }

  return bills;
}

// ===================== Payments (Pembayaran) =====================

export async function addPayment(
  user: AuthUser,
  payload: {
    id_iuran: string;
    periode: string;
    metode_bayar: string;
    jumlah_bayar: number;
    bukti_pembayaran: string;
  },
) {
  if (!user.idWarga) {
    throw { status: 400, message: "Hanya warga yang dapat melakukan pembayaran", code: "FORBIDDEN" };
  }

  const { id_iuran, periode, metode_bayar, jumlah_bayar, bukti_pembayaran } = payload;

  if (!id_iuran || !periode || !metode_bayar || !jumlah_bayar || !bukti_pembayaran) {
    throw { status: 400, message: "Semua field wajib diisi", code: "VALIDATION_ERROR" };
  }

  const iuran = await duesRepository.findIuranById(id_iuran);
  if (!iuran) {
    throw { status: 404, message: "Data iuran tidak ditemukan", code: "NOT_FOUND" };
  }

  const existing = await duesRepository.findPaymentByWargaAndIuranAndPeriode(
    user.idWarga,
    id_iuran,
    periode,
  );
  if (existing) {
    throw {
      status: 409,
      message: "Pembayaran untuk iuran dan periode ini sudah ada",
      code: "CONFLICT",
    };
  }

  await duesRepository.createPayment({
    idWarga: user.idWarga,
    idIuran: id_iuran,
    periode,
    idPengurus: iuran.idKetuaRt,
    tanggalBayar: new Date(),
    metodeBayar: metode_bayar,
    jumlahBayar: Number(jumlah_bayar),
    buktiPembayaran: bukti_pembayaran,
    statusVerifikasi: "Menunggu",
  });

  return { message: "Pembayaran berhasil dikirim." };
}

export async function listPayments() {
  const data = await duesRepository.findAllPayments();
  return data.map((p) => ({
    id_pembayaran: p.idPembayaran,
    nama_warga: p.warga.masyarakat.nama,
    nama_iuran: p.iuran.namaIuran,
    periode: p.periode,
    jumlah_bayar: Number(p.jumlahBayar),
    status_verifikasi: p.statusVerifikasi,
  }));
}

export async function getPaymentById(id: string, user: AuthUser) {
  const payment = await duesRepository.findPaymentById(id);
  if (!payment) {
    throw { status: 404, message: "Data pembayaran tidak ditemukan", code: "NOT_FOUND" };
  }

  if (user.role === "RESIDENT" && payment.idWarga !== user.idWarga) {
    throw { status: 403, message: "Tidak memiliki akses", code: "FORBIDDEN" };
  }

  return {
    id_pembayaran: payment.idPembayaran,
    nama_warga: payment.warga.masyarakat.nama,
    nama_iuran: payment.iuran.namaIuran,
    periode: payment.periode,
    tanggal_bayar: payment.tanggalBayar.toISOString().split("T")[0],
    metode_bayar: payment.metodeBayar,
    jumlah_bayar: Number(payment.jumlahBayar),
    bukti_pembayaran: payment.buktiPembayaran,
    status_verifikasi: payment.statusVerifikasi,
  };
}

export async function verifyPayment(id: string, status: string) {
  if (!["VERIFIED", "REJECTED"].includes(status)) {
    throw { status: 400, message: "Status must be VERIFIED or REJECTED", code: "VALIDATION_ERROR" };
  }

  const payment = await duesRepository.findPaymentById(id);
  if (!payment) {
    throw { status: 404, message: "Data pembayaran tidak ditemukan", code: "NOT_FOUND" };
  }

  const mappedStatus = status === "VERIFIED" ? "Terverifikasi" : "Ditolak";
  await duesRepository.updatePaymentStatus(id, mappedStatus);
  return { message: "Status pembayaran berhasil diperbarui." };
}

export async function getMyPayments(user: AuthUser) {
  if (!user.idWarga) {
    throw { status: 400, message: "Hanya warga yang dapat melihat riwayat pembayaran", code: "FORBIDDEN" };
  }

  const data = await duesRepository.findPaymentsByWargaId(user.idWarga);
  return data.map((p) => ({
    id_iuran: p.idIuran,
    nama_iuran: p.iuran.namaIuran,
    periode: p.periode,
    tanggal_bayar: p.tanggalBayar.toISOString().split("T")[0],
    jumlah_bayar: Number(p.jumlahBayar),
    status_verifikasi: p.statusVerifikasi,
  }));
}
