import { $Enums } from "../../generated/prisma/client.js";
import * as duesRepository from "./repository.js";
import type { AuthUser } from "../../middleware/auth.js";
import { Decimal } from "@prisma/client/runtime/client";

// ===================== Iuran (Master) =====================

export async function listIuran() {
  const data = await duesRepository.findAllIuran();
  return data.map((i) => ({
    id: i.idIuran,
    nama_iuran: i.namaIuran,
    jenis_iuran: i.jenisIuran,
    nominal: Number(i.nominal),
    tanggal_jatuh_tempo: i.tanggalJatuhTempo.toISOString().split("T")[0],
    status_aktif: i.statusAktif,
    created_by: i.idKetuaRt,
  }));
}

export async function getIuranById(id: string) {
  if (!id || typeof id !== "string" || id.trim() === "") {
    throw {
      status: 400,
      message: "Invalid iuran ID",
      code: "INVALID_ID",
    };
  }

  const iuran = await duesRepository.findIuranById(id);
  if (!iuran) {
    throw {
      status: 404,
      message: "Data iuran tidak ditemukan",
      code: "NOT_FOUND",
    };
  }
  return {
    id: iuran.idIuran,
    nama_iuran: iuran.namaIuran,
    jenis_iuran: iuran.jenisIuran,
    nominal: Number(iuran.nominal),
    tanggal_jatuh_tempo: iuran.tanggalJatuhTempo.toISOString().split("T")[0],
    status_aktif: iuran.statusAktif,
    created_by: iuran.idKetuaRt,
  };
}

export async function addIuran(
  user: AuthUser,
  payload: {
    nama_iuran: string;
    jenis_iuran: string;
    nominal: number;
    tanggal_jatuh_tempo: string;
  },
) {
  // Authorization check
  if (user.role !== "CHAIRPERSON" || !user.idPengurus) {
    throw {
      status: 403,
      message: "Only chairperson can create iuran",
      code: "FORBIDDEN",
    };
  }

  const { nama_iuran, jenis_iuran, nominal, tanggal_jatuh_tempo } = payload;
  const errors: string[] = [];

  if (!nama_iuran || !nama_iuran.trim()) {
    errors.push("nama_iuran is required");
  } else if (nama_iuran.trim().length > 40) {
    errors.push("nama_iuran must be at most 40 characters");
  }

  if (!jenis_iuran || !jenis_iuran.trim()) {
    errors.push("jenis_iuran is required");
  } else if (jenis_iuran.trim().length > 15) {
    errors.push("jenis_iuran must be at most 15 characters");
  }

  if (
    nominal === undefined ||
    nominal === null ||
    isNaN(Number(nominal)) ||
    Number(nominal) <= 0
  ) {
    errors.push("nominal must be a valid positive number");
  }

  if (!tanggal_jatuh_tempo || isNaN(Date.parse(tanggal_jatuh_tempo))) {
    errors.push("tanggal_jatuh_tempo must be a valid date (YYYY-MM-DD)");
  } else {
    // Validate date is not in the past
    const inputDate = new Date(tanggal_jatuh_tempo);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (inputDate < today) {
      errors.push("tanggal_jatuh_tempo cannot be in the past");
    }
  }

  if (errors.length > 0) {
    throw {
      status: 400,
      message: errors.join(", "),
      code: "VALIDATION_ERROR",
    };
  }

  const result = await duesRepository.createIuran(user.idPengurus, {
    namaIuran: nama_iuran.trim(),
    jenisIuran: jenis_iuran.trim(),
    nominal: new Decimal(nominal),
    tanggalJatuhTempo: new Date(tanggal_jatuh_tempo),
  });

  return {
    message: "Data iuran berhasil ditambahkan.",
    data: {
      id: result.idIuran,
      nama_iuran: result.namaIuran,
      jenis_iuran: result.jenisIuran,
      nominal: Number(result.nominal),
      tanggal_jatuh_tempo: result.tanggalJatuhTempo.toISOString().split("T")[0],
      status_aktif: result.statusAktif,
    },
  };
}

export async function editIuran(
  user: AuthUser,
  id: string,
  payload: {
    nama_iuran?: string;
    jenis_iuran?: string;
    nominal?: number;
    tanggal_jatuh_tempo?: string;
  },
) {
  // Authorization check
  if (user.role !== "CHAIRPERSON" || !user.idPengurus) {
    throw {
      status: 403,
      message: "Only chairperson can update iuran",
      code: "FORBIDDEN",
    };
  }

  if (!id || typeof id !== "string" || id.trim() === "") {
    throw {
      status: 400,
      message: "Invalid iuran ID",
      code: "INVALID_ID",
    };
  }

  const existing = await duesRepository.findIuranById(id);
  if (!existing) {
    throw {
      status: 404,
      message: "Data iuran tidak ditemukan",
      code: "NOT_FOUND",
    };
  }

  // Verify ownership - only creator can edit
  if (existing.idKetuaRt !== user.idPengurus) {
    throw {
      status: 403,
      message: "You can only edit your own iuran",
      code: "FORBIDDEN",
    };
  }

  if (Object.keys(payload).length === 0) {
    throw {
      status: 400,
      message: "at least one field must be provided",
      code: "VALIDATION_ERROR",
    };
  }

  const data: {
    namaIuran?: string;
    jenisIuran?: string;
    nominal?: Decimal;
    tanggalJatuhTempo?: Date;
  } = {};
  const errors: string[] = [];

  if (payload.nama_iuran !== undefined) {
    if (!payload.nama_iuran.trim()) {
      errors.push("nama_iuran cannot be empty");
    } else if (payload.nama_iuran.trim().length > 40) {
      errors.push("nama_iuran must be at most 40 characters");
    } else {
      data.namaIuran = payload.nama_iuran.trim();
    }
  }

  if (payload.jenis_iuran !== undefined) {
    if (!payload.jenis_iuran.trim()) {
      errors.push("jenis_iuran cannot be empty");
    } else if (payload.jenis_iuran.trim().length > 15) {
      errors.push("jenis_iuran must be at most 15 characters");
    } else {
      data.jenisIuran = payload.jenis_iuran.trim();
    }
  }

  if (payload.nominal !== undefined) {
    if (isNaN(Number(payload.nominal)) || Number(payload.nominal) <= 0) {
      errors.push("nominal must be a valid positive number");
    } else {
      data.nominal = new Decimal(payload.nominal);
    }
  }

  if (payload.tanggal_jatuh_tempo !== undefined) {
    if (isNaN(Date.parse(payload.tanggal_jatuh_tempo))) {
      errors.push("tanggal_jatuh_tempo must be a valid date (YYYY-MM-DD)");
    } else {
      const inputDate = new Date(payload.tanggal_jatuh_tempo);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (inputDate < today) {
        errors.push("tanggal_jatuh_tempo cannot be in the past");
      } else {
        data.tanggalJatuhTempo = inputDate;
      }
    }
  }

  if (errors.length > 0) {
    throw {
      status: 400,
      message: errors.join(", "),
      code: "VALIDATION_ERROR",
    };
  }

  const result = await duesRepository.updateIuran(id, data);
  return {
    message: "Data iuran berhasil diperbarui.",
    data: {
      id: result.idIuran,
      nama_iuran: result.namaIuran,
      jenis_iuran: result.jenisIuran,
      nominal: Number(result.nominal),
      tanggal_jatuh_tempo: result.tanggalJatuhTempo.toISOString().split("T")[0],
      status_aktif: result.statusAktif,
    },
  };
}

export async function toggleIuranStatus(
  user: AuthUser,
  id: string,
  status: string,
) {
  // Authorization check
  if (user.role !== "CHAIRPERSON" || !user.idPengurus) {
    throw {
      status: 403,
      message: "Only chairperson can toggle iuran status",
      code: "FORBIDDEN",
    };
  }

  if (!id || typeof id !== "string" || id.trim() === "") {
    throw {
      status: 400,
      message: "Invalid iuran ID",
      code: "INVALID_ID",
    };
  }

  if (!["ACTIVE", "INACTIVE"].includes(status)) {
    throw {
      status: 400,
      message: "Status must be ACTIVE or INACTIVE",
      code: "VALIDATION_ERROR",
    };
  }

  const existing = await duesRepository.findIuranById(id);
  if (!existing) {
    throw {
      status: 404,
      message: "Data iuran tidak ditemukan",
      code: "NOT_FOUND",
    };
  }

  // Verify ownership
  if (existing.idKetuaRt !== user.idPengurus) {
    throw {
      status: 403,
      message: "You can only toggle your own iuran status",
      code: "FORBIDDEN",
    };
  }

  const result = await duesRepository.updateIuranStatus(
    id,
    status === "ACTIVE",
  );
  return {
    message: "Status iuran berhasil diperbarui.",
    data: {
      id: result.idIuran,
      status_aktif: result.statusAktif,
    },
  };
}

// ===================== Bills (Tagihan) =====================

export async function getBills(user: AuthUser) {
  if (!user.idWarga) {
    return [];
  }

  const activeIuran = await duesRepository.findIuranAktif();
  const payments = await duesRepository.findPaymentsByWargaId(user.idWarga);

  const statusMap = new Map<string, string>();
  for (const p of payments) {
    const key = `${p.idIuran}-${p.periode}`;
    const s = p.statusVerifikasi;
    if (s === "VERIFIED") {
      statusMap.set(key, "VERIFIED");
    } else if (s === "PENDING") {
      if (!statusMap.has(key)) statusMap.set(key, "PENDING");
    } else if (s === "REJECTED") {
      statusMap.set(key, "REJECTED");
    }
  }

  const currentMonth = new Date().toISOString().slice(0, 7);
  const periods = [currentMonth];

  const bills: Array<{
    id_iuran: string;
    nama_iuran: string;
    jenis_iuran: string;
    periode: string;
    nominal: number;
    tanggal_jatuh_tempo: string;
    status: string;
  }> = [];

  for (const iuran of activeIuran) {
    for (const periode of periods) {
      const key = `${iuran.idIuran}-${periode}`;
      const status = statusMap.get(key) || "BELUM_DIBAYAR";

      bills.push({
        id_iuran: iuran.idIuran,
        nama_iuran: iuran.namaIuran,
        jenis_iuran: iuran.jenisIuran,
        periode,
        nominal: Number(iuran.nominal),
        tanggal_jatuh_tempo: iuran.tanggalJatuhTempo.toISOString().split("T")[0],
        status,
      });
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
    throw {
      status: 403,
      message: "Hanya warga yang dapat melakukan pembayaran",
      code: "FORBIDDEN",
    };
  }

  const { id_iuran, periode, metode_bayar, jumlah_bayar, bukti_pembayaran } =
    payload;
  const errors: string[] = [];

  // Validate all required fields
  if (!id_iuran || typeof id_iuran !== "string" || id_iuran.trim() === "") {
    errors.push("id_iuran is required and must be valid");
  }

  if (!periode || typeof periode !== "string" || periode.trim() === "") {
    errors.push("periode is required");
  } else if (!/^\d{4}-\d{2}$/.test(periode)) {
    errors.push("periode must be in YYYY-MM format");
  }

  if (
    !metode_bayar ||
    typeof metode_bayar !== "string" ||
    metode_bayar.trim() === ""
  ) {
    errors.push("metode_bayar is required");
  } else if (metode_bayar.trim().length > 15) {
    errors.push("metode_bayar must be at most 15 characters");
  }

  if (
    jumlah_bayar === undefined ||
    jumlah_bayar === null ||
    isNaN(Number(jumlah_bayar)) ||
    Number(jumlah_bayar) <= 0
  ) {
    errors.push("jumlah_bayar must be a valid positive number");
  }

  if (!bukti_pembayaran || typeof bukti_pembayaran !== "string") {
    errors.push("bukti_pembayaran is required");
  }

  if (errors.length > 0) {
    throw {
      status: 400,
      message: errors.join(", "),
      code: "VALIDATION_ERROR",
    };
  }

  const iuran = await duesRepository.findIuranById(id_iuran);
  if (!iuran) {
    throw {
      status: 404,
      message: "Data iuran tidak ditemukan",
      code: "NOT_FOUND",
    };
  }

  // Verify amount matches iuran nominal
  if (Number(jumlah_bayar) !== Number(iuran.nominal)) {
    throw {
      status: 400,
      message: `jumlah_bayar must match iuran nominal (${Number(iuran.nominal)})`,
      code: "VALIDATION_ERROR",
    };
  }

  // Check if payment already exists
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

  let statusVerifikasi: $Enums.StatusVerifikasi = "PENDING";

  if (user.idPengurus) {
    const otherOfficers = await duesRepository.countOtherOfficers(user.idPengurus);
    if (otherOfficers === 0) {
      statusVerifikasi = "VERIFIED";
    }
  }

  const result = await duesRepository.createPayment({
    idWarga: user.idWarga,
    idIuran: id_iuran,
    periode,
    idPengurus: iuran.idKetuaRt,
    tanggalBayar: new Date(),
    metodeBayar: metode_bayar.trim(),
    jumlahBayar: new Decimal(jumlah_bayar),
    buktiPembayaran: bukti_pembayaran.trim(),
    statusVerifikasi,
  });

  return {
    message: statusVerifikasi === "VERIFIED" ? "Pembayaran berhasil." : "Pembayaran berhasil dikirim.",
    data: {
      id_pembayaran: result.idPembayaran,
      periode: result.periode,
      jumlah_bayar: Number(result.jumlahBayar),
      status_verifikasi: result.statusVerifikasi,
    },
  };
}

export async function listPayments(user: AuthUser) {
  // Authorization check - only officers and chairperson can view all payments
  if (
    !user.idPengurus ||
    (user.role !== "OFFICER" && user.role !== "CHAIRPERSON")
  ) {
    throw {
      status: 403,
      message: "Only officers can view all payments",
      code: "FORBIDDEN",
    };
  }

  const data = await duesRepository.findAllPayments();
  return data.map((p) => ({
    id_pembayaran: p.idPembayaran,
    nama_warga: p.warga.masyarakat.nama,
    nama_iuran: p.iuran.namaIuran,
    jenis_iuran: p.iuran.jenisIuran,
    periode: p.periode,
    jumlah_bayar: Number(p.jumlahBayar),
    tanggal_bayar: p.tanggalBayar.toISOString().split("T")[0],
    metode_bayar: p.metodeBayar,
    status_verifikasi: p.statusVerifikasi,
  }));
}

export async function getPaymentById(id: string, user: AuthUser) {
  if (!id || typeof id !== "string" || id.trim() === "") {
    throw {
      status: 400,
      message: "Invalid payment ID",
      code: "INVALID_ID",
    };
  }

  const payment = await duesRepository.findPaymentById(id);
  if (!payment) {
    throw {
      status: 404,
      message: "Data pembayaran tidak ditemukan",
      code: "NOT_FOUND",
    };
  }

  // Residents can only view their own payments
  // Officers/Chairpersons can view any payment
  if (user.role === "RESIDENT" && payment.idWarga !== user.idWarga) {
    throw {
      status: 403,
      message: "Tidak memiliki akses",
      code: "FORBIDDEN",
    };
  }

  return {
    id_pembayaran: payment.idPembayaran,
    nama_warga: payment.warga.masyarakat.nama,
    nama_iuran: payment.iuran.namaIuran,
    jenis_iuran: payment.iuran.jenisIuran,
    periode: payment.periode,
    tanggal_bayar: payment.tanggalBayar.toISOString().split("T")[0],
    metode_bayar: payment.metodeBayar,
    jumlah_bayar: Number(payment.jumlahBayar),
    bukti_pembayaran: payment.buktiPembayaran,
    status_verifikasi: payment.statusVerifikasi,
  };
}

export async function verifyPayment(
  user: AuthUser,
  id: string,
  status: string,
) {
  // Authorization check - only officers and chairperson can verify
  if (
    !user.idPengurus ||
    (user.role !== "OFFICER" && user.role !== "CHAIRPERSON")
  ) {
    throw {
      status: 403,
      message: "Only officers can verify payments",
      code: "FORBIDDEN",
    };
  }

  if (!id || typeof id !== "string" || id.trim() === "") {
    throw {
      status: 400,
      message: "Invalid payment ID",
      code: "INVALID_ID",
    };
  }

  if (!["VERIFIED", "REJECTED"].includes(status)) {
    throw {
      status: 400,
      message: "Status must be VERIFIED or REJECTED",
      code: "VALIDATION_ERROR",
    };
  }

  const payment = await duesRepository.findPaymentById(id);
  if (!payment) {
    throw {
      status: 404,
      message: "Data pembayaran tidak ditemukan",
      code: "NOT_FOUND",
    };
  }

  if (payment.idWarga === user.idWarga) {
    const otherOfficers = await duesRepository.countOtherOfficers(user.idPengurus!);
    if (otherOfficers > 0) {
      throw {
        status: 403,
        message: "Tidak bisa memverifikasi pembayaran sendiri",
        code: "FORBIDDEN",
      };
    }
  }

  const result = await duesRepository.updatePaymentStatus(id, status as $Enums.StatusVerifikasi);

  return {
    message: "Status pembayaran berhasil diperbarui.",
    data: {
      id_pembayaran: result.idPembayaran,
      status_verifikasi: result.statusVerifikasi,
    },
  };
}

export async function getMyPayments(user: AuthUser) {
  if (!user.idWarga) {
    throw {
      status: 403,
      message: "Hanya warga yang dapat melihat riwayat pembayaran",
      code: "FORBIDDEN",
    };
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
