import * as dashboardRepository from "./repository.js";
import type { AuthUser } from "../../middleware/auth.js";

export async function getDashboard(user: AuthUser) {
  const masyarakat = await dashboardRepository.findMasyarakatById(user.id);
  if (!masyarakat) {
    throw { status: 404, message: "Data tidak ditemukan", code: "NOT_FOUND" };
  }

  if (user.role === "CHAIRPERSON") {
    const totalWarga = await dashboardRepository.countAllWarga();
    const wargaMenungguVerifikasi = await dashboardRepository.countWargaByStatus(
      "PENDING",
    );
    const totalIuranAktif = await dashboardRepository.countIuranAktif();
    const totalUMKM = await dashboardRepository.countAllUmkm();
    const totalLaporanKendala = await dashboardRepository.countAllLaporanKendala();
    const pengumumanAktif = await dashboardRepository.countPengumumanByStatus(
      "Publish",
    );
    const totalPengeluaranKas = await dashboardRepository.sumPengeluaranKas();

    return {
      totalWarga,
      wargaMenungguVerifikasi,
      totalIuranAktif,
      totalUMKM,
      totalLaporanKendala,
      pengumumanAktif,
      totalPengeluaranKas,
    };
  }

  if (user.role === "OFFICER") {
    const totalWarga = await dashboardRepository.countAllWarga();
    const totalUMKM = await dashboardRepository.countAllUmkm();
    const totalLaporanKendala = await dashboardRepository.countAllLaporanKendala();
    const pengumumanAktif = await dashboardRepository.countPengumumanByStatus(
      "Publish",
    );
    const totalPengeluaranKas = await dashboardRepository.sumPengeluaranKas();

    return {
      totalWarga,
      totalUMKM,
      totalLaporanKendala,
      pengumumanAktif,
      totalPengeluaranKas,
    };
  }

  const idWarga = user.idWarga;
  if (!idWarga) {
    return {
      profil: {
        nama: masyarakat.nama,
        statusKeanggotaan: null,
      },
      jumlahUMKM: 0,
      jumlahTagihanBelumDibayar: 0,
      jumlahLaporanSaya: 0,
      pengumumanTerbaru: 0,
    };
  }

  const profil = {
    nama: masyarakat.nama,
    statusKeanggotaan: masyarakat.warga?.statusKeanggotaan ?? null,
  };
  const jumlahUMKM = await dashboardRepository.countUmkmByWargaId(idWarga);
  const jumlahTagihanBelumDibayar =
    await dashboardRepository.countUnpaidBills(idWarga);
  const jumlahLaporanSaya =
    await dashboardRepository.countLaporanByWargaId(idWarga);
  const pengumumanTerbaru = await dashboardRepository.countPengumumanByStatus(
    "Publish",
  );

  return {
    profil,
    jumlahUMKM,
    jumlahTagihanBelumDibayar,
    jumlahLaporanSaya,
    pengumumanTerbaru,
  };
}