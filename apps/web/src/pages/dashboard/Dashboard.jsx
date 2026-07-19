import { useAuth } from "../../context/AuthContext"
import DashboardLayout from "../../components/layout/DashboardLayout"
import WelcomeBanner from "../../components/dashboard/WelcomeBanner"
import StatsGrid from "../../components/dashboard/StatsGrid"
import SectionDivider from "../../components/dashboard/SectionDivider"
import BentoGrid from "../../components/dashboard/BentoGrid"
import TaskGrid from "../../components/dashboard/TaskGrid"
import AnnouncementList from "../../components/dashboard/AnnouncementList"
import ActivitySection from "../../components/dashboard/ActivitySection"
import * as Icons from "../../components/ui/Icons"

const announcements = [
  { title: "Kerja Bakti RT 08", date: "14/07/2026", excerpt: "Kerja bakti akan dilaksanakan hari Minggu, 19 Juli 2026 pukul 07.00 WIB...", status: "Publik", statusColor: "text-success" },
  { title: "Perubahan Jadwal Ronda Malam", date: "12/07/2026", excerpt: "Jadwal ronda malam mengalami perubahan mulai pekan ini...", status: "Publik", statusColor: "text-success" },
  { title: "Pendaftaran UMKM Binaan", date: "10/07/2026", excerpt: "Pendaftaran UMKM binaan RT 08 dibuka hingga 31 Juli 2026...", status: "Draft", statusColor: "text-warning" },
]

const activities = [
  { icon: Icons.CheckCircle, title: "Lampu Jalan Mati", badge: "Selesai", badgeVariant: "success", meta: "Budi Santoso \u2022 14/07/2026" },
  { icon: Icons.Clock, title: "Saluran Air Tersumbat", badge: "Dalam Proses", badgeVariant: "teal", meta: "Ani Wijaya \u2022 12/07/2026" },
  { icon: Icons.AlertCircle, title: "Sampah Menumpuk", badge: "Menunggu", badgeVariant: "warning", meta: "Siti Rahayu \u2022 10/07/2026" },
]

function WargaSection() {
  return (
    <>
      <WelcomeBanner initials="AW" name="Ani Wijaya" roleBadge="Warga" subtitle="Berikut ringkasan aktivitas dan layanan Anda hari ini." />
      <div className="mb-8" />
      <StatsGrid stats={[
        { number: "2", label: "UMKM Saya", meta: "2 usaha terdaftar", icon: <Icons.TrendingUp className="w-5 h-5" /> },
        { number: "1", label: "Tagihan Belum Dibayar", meta: "Perlu tindakan Anda", accent: "bg-warning/10 text-warning", icon: <Icons.Clock className="w-5 h-5" /> },
        { number: "3", label: "Laporan Kendala Saya", meta: "1 dalam proses", icon: <Icons.FileText className="w-5 h-5" /> },
      ]} />
      <div className="mb-8" />
      <BentoGrid sections={[
        {
          title: "Status Iuran",
          subtitle: "Pembayaran iuran periode berjalan",
          pill: "2 dari 3 lunas",
          rows: [
            { label: "Iuran RT (Juli 2026)", badge: "Lunas", badgeVariant: "success" },
            { label: "Iuran Keamanan (Juli 2026)", badge: "Menunggu", badgeVariant: "warning" },
            { label: "Iuran Sosial (Juni 2026)", badge: "Lunas", badgeVariant: "success" },
          ],
          footer: { label: "Bayar iuran sekarang", href: "/pembayaran-iuran" },
        },
        {
          title: "Status UMKM Saya",
          rows: [
            { label: "Warung Makan Budi", badge: "Terverifikasi", badgeVariant: "success" },
            { label: "Laundry Bersih", badge: "Menunggu", badgeVariant: "warning" },
          ],
          footer: { label: "Kelola UMKM", href: "/umkm-saya" },
        },
      ]} />
      <div className="mb-8" />
      <AnnouncementList announcements={announcements} />
      <div className="mb-8" />
      <ActivitySection activities={activities} />
    </>
  )
}

function PengurusSection() {
  return (
    <>
      <WelcomeBanner initials="AS" name="Agus Saputra" roleBadge="Sekretaris" roleBadgeColor="teal" subtitle="Berikut ringkasan data dan aktivitas RT 08." />
      <div className="mb-8" />
      <StatsGrid stats={[
        { number: "47", label: "Total Warga", meta: "44 aktif, 3 menunggu", icon: <Icons.Users className="w-5 h-5" /> },
        { number: "6", label: "Total UMKM", meta: "6 terverifikasi", icon: <Icons.TrendingUp className="w-5 h-5" /> },
        { number: "5", label: "Total Laporan", meta: "2 menunggu validasi", icon: <Icons.FileText className="w-5 h-5" /> },
        { number: "Rp 6.5 Jt", label: "Pengeluaran Kas", meta: "Periode Juli 2026", icon: <Icons.Calendar className="w-5 h-5" /> },
      ]} />
      <SectionDivider icon={Icons.Users} label="Sebagai Pengurus" />
      <BentoGrid sections={[
        {
          title: "Tugas Pengurus",
          subtitle: "Aksi yang perlu segera ditindaklanjuti",
          rows: [
            { label: "UMKM Menunggu Validasi", badge: "2 menunggu", badgeVariant: "warning" },
            { label: "Pembayaran Menunggu Verifikasi", badge: "2 menunggu", badgeVariant: "warning" },
            { label: "Laporan Menunggu Validasi", badge: "2 menunggu", badgeVariant: "warning" },
            { label: "Laporan Menunggu Tindak Lanjut", badge: "1 menunggu", badgeVariant: "teal" },
          ],
          footer: { label: "Lihat semua tugas", href: "/dashboard" },
        },
        {
          title: "Ringkasan Layanan",
          rows: [
            { label: "Pengumuman Aktif", badge: "4 publik", badgeVariant: "success" },
            { label: "Laporan Kendala Aktif", badge: "3 dalam proses", badgeVariant: "teal" },
            { label: "Iuran Aktif", badge: "5 aktif", badgeVariant: "success" },
            { label: "Warga Aktif", badge: "44 warga", badgeVariant: "success" },
          ],
          footer: { label: "Kelola pengumuman", href: "/pengumuman" },
        },
      ]} />
      <TaskGrid tasks={[
        { icon: Icons.TrendingUp, title: "Validasi UMKM", count: "2 menunggu", countNum: 2, href: "/validasi-umkm" },
        { icon: Icons.CheckCircle, title: "Verifikasi Pembayaran", count: "2 menunggu", countNum: 2, href: "/verifikasi-pembayaran" },
        { icon: Icons.Shield, title: "Validasi Laporan", count: "2 menunggu", countNum: 2, href: "/validasi-laporan" },
        { icon: Icons.FileText, title: "Tindak Lanjut", count: "1 menunggu", countNum: 1, href: "/tindak-lanjut-laporan" },
      ]} />
      <SectionDivider icon={Icons.Users} label="Sebagai Warga" />
      <StatsGrid stats={[
        { number: "1", label: "UMKM Saya", meta: "1 usaha terdaftar", icon: <Icons.TrendingUp className="w-5 h-5" /> },
        { number: "1", label: "Tagihan Belum Dibayar", meta: "Perlu tindakan Anda", accent: "bg-warning/10 text-warning", icon: <Icons.Clock className="w-5 h-5" /> },
        { number: "2", label: "Laporan Kendala Saya", meta: "1 dalam proses", icon: <Icons.FileText className="w-5 h-5" /> },
      ]} />
      <div className="mb-8" />
      <BentoGrid sections={[
        {
          title: "Status Iuran Saya",
          subtitle: "Pembayaran iuran periode berjalan",
          pill: "1 dari 2 lunas",
          rows: [
            { label: "Iuran RT (Juli 2026)", badge: "Lunas", badgeVariant: "success" },
            { label: "Iuran Keamanan (Juli 2026)", badge: "Menunggu", badgeVariant: "warning" },
          ],
          footer: { label: "Bayar iuran sekarang", href: "/dashboard" },
        },
        {
          title: "Status UMKM Saya",
          rows: [
            { label: "Laundry Bersih", badge: "Terverifikasi", badgeVariant: "success" },
          ],
          footer: { label: "Kelola UMKM", href: "/dashboard" },
        },
      ]} />
      <div className="mb-8" />
      <AnnouncementList announcements={announcements} />
      <div className="mb-8" />
      <ActivitySection activities={activities} />
    </>
  )
}

function KetuaSection() {
  return (
    <>
      <WelcomeBanner initials="BS" name="Budi Santoso" roleBadge="Ketua RT" subtitle="Berikut ringkasan data dan aktivitas RT 08." />
      <div className="mb-8" />
      <StatsGrid stats={[
        { number: "3", label: "Warga Menunggu Verifikasi", meta: "Perlu tindakan segera", accent: "bg-warning/10 text-warning", icon: <Icons.Users className="w-5 h-5" /> },
        { number: "47", label: "Total Warga", meta: "44 aktif, 3 menunggu", icon: <Icons.Users className="w-5 h-5" /> },
        { number: "Rp 6.5 Jt", label: "Total Pengeluaran Kas", meta: "Periode Juli 2026", icon: <Icons.Calendar className="w-5 h-5" /> },
      ]} />
      <SectionDivider icon={Icons.Users} label="Sebagai Ketua" />
      <BentoGrid sections={[
        {
          title: "Verifikasi Warga",
          subtitle: "Warga baru menunggu persetujuan",
          pill: "3 menunggu",
          pillVariant: "warning",
          rows: [
            { label: "Ani Wijaya", badge: "Menunggu", badgeVariant: "warning" },
            { label: "Siti Rahayu", badge: "Menunggu", badgeVariant: "warning" },
            { label: "Joko Prasetyo", badge: "Menunggu", badgeVariant: "warning" },
          ],
          footer: { label: "Verifikasi warga sekarang", href: "/verifikasi-warga" },
        },
        {
          title: "Ringkasan Layanan",
          rows: [
            { label: "UMKM Terdaftar", badge: "6 terverifikasi", badgeVariant: "success" },
            { label: "Iuran Aktif", badge: "5 aktif", badgeVariant: "success" },
            { label: "Laporan Kendala Aktif", badge: "3 dalam proses", badgeVariant: "teal" },
            { label: "Pengumuman Aktif", badge: "4 publik", badgeVariant: "success" },
          ],
          footer: { label: "Kelola pengurus RT", href: "/kelola-pengurus" },
        },
      ]} />
      <TaskGrid tasks={[
        { icon: Icons.Users, title: "Verifikasi Warga", count: "3 menunggu", countNum: 3, href: "/verifikasi-warga" },
        { icon: Icons.Users, title: "Kelola Pengurus", count: "5 pengurus aktif", href: "/kelola-pengurus" },
        { icon: Icons.Clock, title: "Kelola Iuran", count: "5 iuran aktif", href: "/kelola-iuran" },
        { icon: Icons.TrendingUp, title: "Laporan Keuangan", count: "Lihat laporan", href: "/laporan-keuangan" },
      ]} />
      <SectionDivider icon={Icons.Users} label="Sebagai Warga" />
      <StatsGrid stats={[
        { number: "2", label: "UMKM Saya", meta: "2 usaha terdaftar", icon: <Icons.TrendingUp className="w-5 h-5" /> },
        { number: "1", label: "Tagihan Belum Dibayar", meta: "Perlu tindakan Anda", accent: "bg-warning/10 text-warning", icon: <Icons.Clock className="w-5 h-5" /> },
        { number: "3", label: "Laporan Kendala Saya", meta: "1 dalam proses", icon: <Icons.FileText className="w-5 h-5" /> },
      ]} />
      <div className="mb-8" />
      <BentoGrid sections={[
        {
          title: "Status Iuran Saya",
          subtitle: "Pembayaran iuran periode berjalan",
          pill: "2 dari 3 lunas",
          rows: [
            { label: "Iuran RT (Juli 2026)", badge: "Lunas", badgeVariant: "success" },
            { label: "Iuran Keamanan (Juli 2026)", badge: "Menunggu", badgeVariant: "warning" },
            { label: "Iuran Sosial (Juni 2026)", badge: "Lunas", badgeVariant: "success" },
          ],
          footer: { label: "Bayar iuran sekarang", href: "/verifikasi-pembayaran" },
        },
        {
          title: "Status UMKM Saya",
          rows: [
            { label: "Warung Makan Budi", badge: "Terverifikasi", badgeVariant: "success" },
            { label: "Laundry Bersih", badge: "Menunggu", badgeVariant: "warning" },
          ],
          footer: { label: "Kelola UMKM", href: "/lihat-umkm" },
        },
      ]} />
      <div className="mb-8" />
      <AnnouncementList announcements={announcements} />
      <div className="mb-8" />
      <ActivitySection activities={activities} />
    </>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const role = user?.role || "ketua"

  return (
    <DashboardLayout>
      {role === "warga" && <WargaSection />}
      {role === "pengurus" && <PengurusSection />}
      {role === "ketua" && <KetuaSection />}
    </DashboardLayout>
  )
}
