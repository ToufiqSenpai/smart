import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./components/auth/ProtectedRoute"

import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Dashboard from "./pages/dashboard/Dashboard"

// Manajemen Warga
import DataWarga from "./pages/manajemen-warga/DataWarga"
import VerifikasiWarga from "./pages/manajemen-warga/VerifikasiWarga"

// Manajemen Pengurus
import KelolaPengurus from "./pages/manajemen-pengurus/KelolaPengurus"
import TambahPengurus from "./pages/manajemen-pengurus/TambahPengurus"
import EditPengurus from "./pages/manajemen-pengurus/EditPengurus"

// UMKM
import UMKMSaya from "./pages/umkm/WargaUMKMSaya"
import TambahUMKM from "./pages/umkm/WargaTambahUMKM"
import EditUMKM from "./pages/umkm/EditUMKM"
import LihatUMKM from "./pages/umkm/WargaLihatUMKM"
import DetailUMKM from "./pages/umkm/WargaDetailUMKM"
import ValidasiUMKM from "./pages/umkm/KetuaValidasiUMKM"
import DetailValidasiUMKM from "./pages/umkm/KetuaDetailValidasiUMKM"
import KetuaLihatUMKM from "./pages/umkm/KetuaLihatUMKM"
import KetuaTambahUMKM from "./pages/umkm/KetuaTambahUMKM"

// Iuran
import KelolaIuran from "./pages/iuran/KetuaKelolaIuran"
import TambahIuran from "./pages/iuran/KetuaTambahIuran"
import EditIuran from "./pages/iuran/KetuaEditIuran"
import VerifikasiPembayaran from "./pages/iuran/KetuaVerifikasiPembayaran"
import DetailVerifikasi from "./pages/iuran/KetuaDetailVerifikasi"
import PembayaranIuran from "./pages/iuran/WargaPembayaranIuran"

// Pengumuman
import KelolaPengumuman from "./pages/pengumuman/KetuaPengumuman"
import TambahPengumuman from "./pages/pengumuman/KetuaTambahPengumuman"
import Pengumuman from "./pages/pengumuman/WargaPengumuman"
import EditPengumuman from "./pages/pengumuman/KetuaEditPengumuman"

// Laporan Kendala
import { useAuth } from "./context/AuthContext"
import BuatLaporan from "./pages/laporan/WargaLaporanBaru"
import WargaMonitoringLaporan from "./pages/laporan/WargaMonitoringLaporan"
import WargaDetailLaporan from "./pages/laporan/WargaDetailLaporan"
import ValidasiLaporan from "./pages/laporan/KetuaValidasiLaporan"
import DetailValidasiLaporan from "./pages/laporan/KetuaDetailValidasiLaporan"
import TindakLanjutLaporan from "./pages/laporan/KetuaTindakLanjutLaporan"
import DetailTindakLanjut from "./pages/laporan/KetuaDetailTindakLanjut"
import KetuaMonitoringLaporan from "./pages/laporan/KetuaMonitoringLaporan"

function MonitoringLaporan() {
  const { user } = useAuth()
  return user?.role === "warga" ? <WargaMonitoringLaporan /> : <KetuaMonitoringLaporan />
}

function DetailLaporan() {
  const { user } = useAuth()
  return user?.role === "warga" ? <WargaDetailLaporan /> : <DetailValidasiLaporan />
}

// Pengeluaran Kas
import KelolaPengeluaranKas from "./pages/kas/KetuaKelolaPengeluaranKas"
import TambahPengeluaranKas from "./pages/kas/KetuaTambahPengeluaranKas"
import EditPengeluaranKas from "./pages/kas/KetuaEditPengeluaranKas"

// Laporan Keuangan
import LaporanKeuangan from "./pages/keuangan/KetuaLaporanKeuangan"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard — all roles */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* All roles */}
      <Route path="/pengumuman" element={<ProtectedRoute roles={["warga","pengurus","ketua"]}><Pengumuman /></ProtectedRoute>} />
      <Route path="/buat-laporan" element={<ProtectedRoute roles={["warga","pengurus","ketua"]}><BuatLaporan /></ProtectedRoute>} />
      <Route path="/tambah-umkm" element={<ProtectedRoute roles={["warga","pengurus","ketua"]}><TambahUMKM /></ProtectedRoute>} />
      <Route path="/lihat-umkm" element={<ProtectedRoute roles={["warga","pengurus","ketua"]}><LihatUMKM /></ProtectedRoute>} />
      <Route path="/detail-umkm/:id" element={<ProtectedRoute roles={["warga","pengurus","ketua"]}><DetailUMKM /></ProtectedRoute>} />
      <Route path="/pembayaran-iuran" element={<ProtectedRoute roles={["warga","pengurus","ketua"]}><PembayaranIuran /></ProtectedRoute>} />
      <Route path="/umkm/edit/:id" element={<ProtectedRoute roles={["warga","pengurus","ketua"]}><EditUMKM /></ProtectedRoute>} />

      {/* Semua role — wrapper by role */}
      <Route path="/monitoring-laporan" element={<ProtectedRoute roles={["warga","pengurus","ketua"]}><MonitoringLaporan /></ProtectedRoute>} />
      <Route path="/detail-laporan/:id" element={<ProtectedRoute roles={["warga","pengurus","ketua"]}><DetailLaporan /></ProtectedRoute>} />
      <Route path="/umkm-saya" element={<ProtectedRoute roles={["warga","pengurus","ketua"]}><UMKMSaya /></ProtectedRoute>} />


      {/* Pengurus & Ketua */}
      <Route path="/data-warga" element={<ProtectedRoute roles={["pengurus","ketua"]}><DataWarga /></ProtectedRoute>} />
      <Route path="/validasi-umkm" element={<ProtectedRoute roles={["pengurus","ketua"]}><ValidasiUMKM /></ProtectedRoute>} />
      <Route path="/verifikasi-pembayaran" element={<ProtectedRoute roles={["pengurus","ketua"]}><VerifikasiPembayaran /></ProtectedRoute>} />
      <Route path="/validasi-laporan" element={<ProtectedRoute roles={["pengurus","ketua"]}><ValidasiLaporan /></ProtectedRoute>} />
      <Route path="/tindak-lanjut-laporan" element={<ProtectedRoute roles={["pengurus","ketua"]}><TindakLanjutLaporan /></ProtectedRoute>} />
      <Route path="/kelola-pengeluaran-kas" element={<ProtectedRoute roles={["pengurus","ketua"]}><KelolaPengeluaranKas /></ProtectedRoute>} />
      <Route path="/tambah-pengeluaran-kas" element={<ProtectedRoute roles={["pengurus","ketua"]}><TambahPengeluaranKas /></ProtectedRoute>} />
      <Route path="/detail-verifikasi/:id" element={<ProtectedRoute roles={["pengurus","ketua"]}><DetailVerifikasi /></ProtectedRoute>} />
      <Route path="/detail-validasi-laporan/:id" element={<ProtectedRoute roles={["pengurus","ketua"]}><DetailValidasiLaporan /></ProtectedRoute>} />
      <Route path="/detail-tindak-lanjut/:id" element={<ProtectedRoute roles={["pengurus","ketua"]}><DetailTindakLanjut /></ProtectedRoute>} />
      <Route path="/tambah-pengumuman" element={<ProtectedRoute roles={["pengurus","ketua"]}><TambahPengumuman /></ProtectedRoute>} />
      <Route path="/detail-validasi-umkm/:id" element={<ProtectedRoute roles={["pengurus","ketua"]}><DetailValidasiUMKM /></ProtectedRoute>} />
      <Route path="/kelola-pengumuman" element={<ProtectedRoute roles={["pengurus","ketua"]}><KelolaPengumuman /></ProtectedRoute>} />
      <Route path="/edit-pengumuman/:id" element={<ProtectedRoute roles={["pengurus","ketua"]}><EditPengumuman /></ProtectedRoute>} />
      <Route path="/edit-pengeluaran-kas/:id" element={<ProtectedRoute roles={["pengurus","ketua"]}><EditPengeluaranKas /></ProtectedRoute>} />
      <Route path="/lihat-umkm" element={<ProtectedRoute roles={["pengurus","ketua"]}><KetuaLihatUMKM /></ProtectedRoute>} />
      <Route path="/tambah-umkm" element={<ProtectedRoute roles={["pengurus","ketua"]}><KetuaTambahUMKM /></ProtectedRoute>} />

      {/* Ketua only */}
      <Route path="/verifikasi-warga" element={<ProtectedRoute roles={["ketua"]}><VerifikasiWarga /></ProtectedRoute>} />
      <Route path="/kelola-pengurus" element={<ProtectedRoute roles={["ketua"]}><KelolaPengurus /></ProtectedRoute>} />
      <Route path="/kelola-iuran" element={<ProtectedRoute roles={["ketua"]}><KelolaIuran /></ProtectedRoute>} />
      <Route path="/tambah-iuran" element={<ProtectedRoute roles={["ketua"]}><TambahIuran /></ProtectedRoute>} />
      <Route path="/laporan-keuangan" element={<ProtectedRoute roles={["ketua"]}><LaporanKeuangan /></ProtectedRoute>} />
      <Route path="/tambah-pengurus" element={<ProtectedRoute roles={["ketua"]}><TambahPengurus /></ProtectedRoute>} />
      <Route path="/edit-iuran/:id" element={<ProtectedRoute roles={["ketua"]}><EditIuran /></ProtectedRoute>} />
      <Route path="/edit-pengurus/:id" element={<ProtectedRoute roles={["ketua"]}><EditPengurus /></ProtectedRoute>} />

      <Route path="*" element={<div className="flex items-center justify-center min-h-screen">Halaman tidak ditemukan</div>} />
    </Routes>
  )
}
