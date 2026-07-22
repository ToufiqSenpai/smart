import * as dashboardRepository from "./repository.js";
import type { AuthUser } from "../../middleware/auth.js";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export async function getDashboardActivities(user: AuthUser) {
  const activities: Array<{
    tipe: string;
    judul: string;
    status: string;
    meta: string;
    tanggal: string;
  }> = [];

  // Ambil aktivitas dari laporan kendala terbaru
  const recentIssues = await dashboardRepository.findRecentIssues(5);
  for (const issue of recentIssues) {
    activities.push({
      tipe: "LAPORAN",
      judul: `Laporan: ${issue.kategoriKendala}`,
      status: issue.statusLaporan,
      meta: issue.deskripsi.substring(0, 60),
      tanggal: formatDate(issue.tanggalLapor),
    });
  }

  // Ambil aktivitas dari pembayaran iuran terbaru
  if (user.role === "OFFICER" || user.role === "CHAIRPERSON") {
    const recentPayments =
      await dashboardRepository.findRecentPayments(5);
    for (const payment of recentPayments) {
      activities.push({
        tipe: "PEMBAYARAN",
        judul: `Pembayaran: ${payment.iuran?.namaIuran ?? "Iuran"}`,
        status: payment.statusVerifikasi,
        meta: `${payment.warga?.masyarakat?.nama ?? "Warga"} - ${payment.periode}`,
        tanggal: formatDate(payment.tanggalBayar),
      });
    }
  }

  // Ambil aktivitas dari pengumuman terbaru
  const recentAnnouncements =
    await dashboardRepository.findRecentAnnouncements(5);
  for (const announcement of recentAnnouncements) {
    activities.push({
      tipe: "PENGUMUMAN",
      judul: announcement.judul,
      status: announcement.statusPublikasi,
      meta: announcement.isiPengumuman.substring(0, 60),
      tanggal: formatDate(announcement.tanggalPengumuman),
    });
  }

  // Urutkan berdasarkan tanggal terbaru, ambil 10 teratas
  activities.sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime(),
  );
  return activities.slice(0, 10);
}

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
      "PUBLISHED",
    );
    const totalPengeluaranKas = await dashboardRepository.sumPengeluaranKas();

    const pendingCounts = {
      umkmMenunggu: await dashboardRepository.countUmkmPending(),
      pembayaranMenunggu: await dashboardRepository.countPaymentsPending(),
      laporanMenungguValidasi: await dashboardRepository.countIssuesByStatus("PENDING"),
      laporanMenungguTindakLanjut: await dashboardRepository.countIssuesByStatus("VERIFIED"),
    };

    return {
      totalWarga,
      wargaMenungguVerifikasi,
      totalIuranAktif,
      totalUMKM,
      totalLaporanKendala,
      pengumumanAktif,
      totalPengeluaranKas,
      pendingCounts,
    };
  }

  if (user.role === "OFFICER") {
    const totalWarga = await dashboardRepository.countAllWarga();
    const totalUMKM = await dashboardRepository.countAllUmkm();
    const totalLaporanKendala = await dashboardRepository.countAllLaporanKendala();
    const pengumumanAktif = await dashboardRepository.countPengumumanByStatus(
      "PUBLISHED",
    );
    const totalPengeluaranKas = await dashboardRepository.sumPengeluaranKas();

    const pendingCounts = {
      umkmMenunggu: await dashboardRepository.countUmkmPending(),
      pembayaranMenunggu: await dashboardRepository.countPaymentsPending(),
      laporanMenungguValidasi: await dashboardRepository.countIssuesByStatus("PENDING"),
      laporanMenungguTindakLanjut: await dashboardRepository.countIssuesByStatus("VERIFIED"),
    };

    return {
      totalWarga,
      totalUMKM,
      totalLaporanKendala,
      pengumumanAktif,
      totalPengeluaranKas,
      pendingCounts,
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
    "PUBLISHED",
  );

  return {
    profil,
    jumlahUMKM,
    jumlahTagihanBelumDibayar,
    jumlahLaporanSaya,
    pengumumanTerbaru,
  };
}