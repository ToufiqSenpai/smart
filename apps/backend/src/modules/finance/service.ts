import * as financeRepository from "./repository.js";
import type { AuthUser } from "../../middleware/auth.js";

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

const KATEGORI_MAX_LENGTH = 15;
const KETERANGAN_MAX_LENGTH = 30;

function validateCreatePayload(payload: CreateExpenseBody) {
  const errors: string[] = [];

  if (!payload.kategoriPengeluaran || !payload.kategoriPengeluaran.trim()) {
    errors.push("kategoriPengeluaran is required");
  } else if (payload.kategoriPengeluaran.trim().length > KATEGORI_MAX_LENGTH) {
    errors.push(
      `kategoriPengeluaran must be at most ${KATEGORI_MAX_LENGTH} characters`,
    );
  }

  if (
    payload.nominalPengeluaran === undefined ||
    payload.nominalPengeluaran === null ||
    isNaN(Number(payload.nominalPengeluaran))
  ) {
    errors.push("nominalPengeluaran must be a valid number");
  } else if (Number(payload.nominalPengeluaran) <= 0) {
    errors.push("nominalPengeluaran must be greater than 0");
  }

  if (!payload.tanggalKeluar || isNaN(Date.parse(payload.tanggalKeluar))) {
    errors.push("tanggalKeluar must be a valid date string (YYYY-MM-DD)");
  } else {
    // Validate date is not in the future
    const inputDate = new Date(payload.tanggalKeluar);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (inputDate > today) {
      errors.push("tanggalKeluar cannot be in the future");
    }
  }

  if (!payload.keterangan || !payload.keterangan.trim()) {
    errors.push("keterangan is required");
  } else if (payload.keterangan.trim().length > KETERANGAN_MAX_LENGTH) {
    errors.push(
      `keterangan must be at most ${KETERANGAN_MAX_LENGTH} characters`,
    );
  }

  if (errors.length > 0) {
    throw { status: 400, message: errors.join(", "), code: "VALIDATION_ERROR" };
  }
}

function validateUpdatePayload(payload: UpdateExpenseBody) {
  const errors: string[] = [];

  if (
    payload.kategoriPengeluaran !== undefined &&
    payload.kategoriPengeluaran.trim().length > KATEGORI_MAX_LENGTH
  ) {
    errors.push(
      `kategoriPengeluaran must be at most ${KATEGORI_MAX_LENGTH} characters`,
    );
  }

  if (payload.nominalPengeluaran !== undefined) {
    if (isNaN(Number(payload.nominalPengeluaran))) {
      errors.push("nominalPengeluaran must be a valid number");
    } else if (Number(payload.nominalPengeluaran) <= 0) {
      errors.push("nominalPengeluaran must be greater than 0");
    }
  }

  if (payload.tanggalKeluar !== undefined) {
    if (isNaN(Date.parse(payload.tanggalKeluar))) {
      errors.push("tanggalKeluar must be a valid date string (YYYY-MM-DD)");
    } else {
      // Validate date is not in the future
      const inputDate = new Date(payload.tanggalKeluar);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (inputDate > today) {
        errors.push("tanggalKeluar cannot be in the future");
      }
    }
  }

  if (
    payload.keterangan !== undefined &&
    payload.keterangan.trim().length > KETERANGAN_MAX_LENGTH
  ) {
    errors.push(
      `keterangan must be at most ${KETERANGAN_MAX_LENGTH} characters`,
    );
  }

  if (Object.keys(payload).length === 0) {
    errors.push("at least one field must be provided to update");
  }

  if (errors.length > 0) {
    throw { status: 400, message: errors.join(", "), code: "VALIDATION_ERROR" };
  }
}

// Get all expenses (accessible by OFFICER and CHAIRPERSON)
export async function getExpenses(user: AuthUser) {
  if (
    !user.idPengurus ||
    (user.role !== "OFFICER" && user.role !== "CHAIRPERSON")
  ) {
    throw {
      status: 403,
      message: "You don't have permission to view expenses",
      code: "FORBIDDEN",
    };
  }
  return financeRepository.findAll();
}

// Get specific expense by ID
export async function getExpenseById(user: AuthUser, id: string) {
  if (
    !user.idPengurus ||
    (user.role !== "OFFICER" && user.role !== "CHAIRPERSON")
  ) {
    throw {
      status: 403,
      message: "You don't have permission to view expenses",
      code: "FORBIDDEN",
    };
  }

  const expense = await financeRepository.findById(id);
  if (!expense) {
    throw {
      status: 404,
      message: "Expense not found",
      code: "EXPENSE_NOT_FOUND",
    };
  }
  return expense;
}

// Create expense (CHAIRPERSON only)
export async function addExpense(user: AuthUser, payload: CreateExpenseBody) {
  if (user.role !== "CHAIRPERSON" || !user.idPengurus) {
    throw {
      status: 403,
      message: "Only chairperson can create expenses",
      code: "FORBIDDEN",
    };
  }

  validateCreatePayload(payload);
  return financeRepository.create(user.idPengurus, payload);
}

// Update expense (CHAIRPERSON only - must be original creator)
export async function updateExpense(
  user: AuthUser,
  id: string,
  payload: UpdateExpenseBody,
) {
  if (user.role !== "CHAIRPERSON" || !user.idPengurus) {
    throw {
      status: 403,
      message: "Only chairperson can update expenses",
      code: "FORBIDDEN",
    };
  }

  const existing = await financeRepository.findById(id);
  if (!existing) {
    throw {
      status: 404,
      message: "Expense not found",
      code: "EXPENSE_NOT_FOUND",
    };
  }

  // Verify that the current user created this expense
  if (existing.idPengurus !== user.idPengurus) {
    throw {
      status: 403,
      message: "You can only update your own expenses",
      code: "FORBIDDEN",
    };
  }

  validateUpdatePayload(payload);

  try {
    return await financeRepository.update(id, payload);
  } catch (err: any) {
    // Race condition: data terhapus tepat setelah findById tapi sebelum update
    if (err.code === "P2025") {
      throw {
        status: 404,
        message: "Expense not found",
        code: "EXPENSE_NOT_FOUND",
      };
    }
    throw err;
  }
}

// Get finance report (income + expense summary)
export async function getFinanceReport(user: AuthUser, periode?: string) {
  if (
    !user.idPengurus ||
    (user.role !== "OFFICER" && user.role !== "CHAIRPERSON")
  ) {
    throw {
      status: 403,
      message: "You don't have permission to view finance report",
      code: "FORBIDDEN",
    };
  }

  const report = await financeRepository.getReport(periode);

  const totalPemasukan = report.pemasukan.reduce(
    (sum: number, p: any) => sum + Number(p.jumlah_bayar),
    0,
  );
  const totalPengeluaran = report.pengeluaran.reduce(
    (sum: number, p: any) => sum + Number(p.nominal_pengeluaran),
    0,
  );

  return {
    totalPemasukan,
    totalPengeluaran,
    saldoAkhir: totalPemasukan - totalPengeluaran,
    jumlahTransaksi: report.pemasukan.length + report.pengeluaran.length,
    pemasukan: report.pemasukan,
    pengeluaran: report.pengeluaran,
  };
}

// Delete expense (CHAIRPERSON only - must be original creator)
export async function deleteExpense(user: AuthUser, id: string) {
  if (user.role !== "CHAIRPERSON" || !user.idPengurus) {
    throw {
      status: 403,
      message: "Only chairperson can delete expenses",
      code: "FORBIDDEN",
    };
  }

  const existing = await financeRepository.findById(id);
  if (!existing) {
    throw {
      status: 404,
      message: "Expense not found",
      code: "EXPENSE_NOT_FOUND",
    };
  }

  // Verify that the current user created this expense
  if (existing.idPengurus !== user.idPengurus) {
    throw {
      status: 403,
      message: "You can only delete your own expenses",
      code: "FORBIDDEN",
    };
  }

  try {
    return await financeRepository.deleteExpense(id);
  } catch (err: any) {
    if (err.code === "P2025") {
      throw {
        status: 404,
        message: "Expense not found",
        code: "EXPENSE_NOT_FOUND",
      };
    }
    throw err;
  }
}
