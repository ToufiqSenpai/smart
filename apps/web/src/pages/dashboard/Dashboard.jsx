import { useState, useEffect } from "react"
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
import { getDashboard, getDashboardActivities } from "../../api/dashboard.api"
import { getAnnouncements } from "../../api/announcements.api"
import { getPendingVerifications } from "../../api/residents.api"
import { getCurrentBills } from "../../api/dues.api"
import { getMyBusinesses } from "../../api/businesses.api"

function generateInitials(nama) {
  return nama.split(" ").map(k => k.charAt(0).toUpperCase()).slice(0, 2).join("")
}

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(angka)
}

function mapAnnouncement(a) {
  return {
    title: a.judul,
    date: a.tanggal_pengumuman ? a.tanggal_pengumuman.split('-').reverse().join('/') : '',
    excerpt: a.isi_pengumuman?.substring(0, 80) + '...',
    status: a.status_publikasi === 'PUBLISHED' ? 'Publik' : 'Draft',
    statusColor: a.status_publikasi === 'PUBLISHED' ? 'text-success' : 'text-warning',
  }
}

function mapActivity(a) {
  const statusMap = {
    SELESAI: { badge: 'Selesai', variant: 'success' },
    COMPLETED: { badge: 'Selesai', variant: 'success' },
    DIPROSES: { badge: 'Dalam Proses', variant: 'teal' },
    IN_PROGRESS: { badge: 'Dalam Proses', variant: 'teal' },
    MENUNGGU: { badge: 'Menunggu', variant: 'warning' },
    PENDING: { badge: 'Menunggu', variant: 'warning' },
    PUBLISHED: { badge: 'Publik', variant: 'success' },
    VERIFIED: { badge: 'Terverifikasi', variant: 'success' },
    REJECTED: { badge: 'Ditolak', variant: 'danger' },
  }
  const s = statusMap[a.status] || { badge: a.status, variant: 'warning' }
  const iconMap = {
    LAPORAN: a.status === 'COMPLETED' ? Icons.CheckCircle : a.status === 'IN_PROGRESS' ? Icons.Clock : Icons.AlertCircle,
    PEMBAYARAN: a.status === 'VERIFIED' ? Icons.CheckCircle : Icons.Clock,
    PENGUMUMAN: Icons.FileText,
  }
  return {
    icon: iconMap[a.tipe] || Icons.FileText,
    title: a.judul,
    badge: s.badge,
    badgeVariant: s.variant,
    meta: a.meta,
  }
}

function WargaSection({ user, dashboard, announcements, activities, bills, myBusinesses }) {
  const nama = user?.nama || ''
  return (
    <>
      <WelcomeBanner initials={generateInitials(nama)} name={nama} roleBadge="Warga" subtitle="Berikut ringkasan aktivitas dan layanan Anda hari ini." />
      <div className="mb-8" />
      <StatsGrid stats={[
        { number: String(dashboard?.jumlahUMKM || 0), label: "UMKM Saya", meta: `${dashboard?.jumlahUMKM || 0} usaha terdaftar`, icon: <Icons.TrendingUp className="w-5 h-5" /> },
        { number: String(dashboard?.jumlahTagihanBelumDibayar || 0), label: "Tagihan Belum Dibayar", meta: "Perlu tindakan Anda", accent: "bg-warning/10 text-warning", icon: <Icons.Clock className="w-5 h-5" /> },
        { number: String(dashboard?.jumlahLaporanSaya || 0), label: "Laporan Kendala Saya", meta: "Lihat laporan Anda", icon: <Icons.FileText className="w-5 h-5" /> },
      ]} />
      <div className="mb-8" />
      <BentoGrid sections={[
        {
          title: "Status Iuran",
          subtitle: "Pembayaran iuran periode berjalan",
          pill: `${bills.filter(b => b.status === 'VERIFIED').length} dari ${bills.length} lunas`,
          rows: bills.map(b => ({
            label: `${b.nama_iuran} (${b.periode})`,
            badge: b.status === 'VERIFIED' ? 'Lunas' : b.status === 'PENDING' ? 'Menunggu' : b.status === 'REJECTED' ? 'Ditolak' : 'Belum Dibayar',
            badgeVariant: b.status === 'VERIFIED' ? 'success' : b.status === 'REJECTED' ? 'danger' : 'warning',
          })),
          footer: { label: "Bayar iuran sekarang", href: "/pembayaran-iuran" },
        },
        {
          title: "Status UMKM Saya",
          rows: (myBusinesses.length > 0 ? myBusinesses : []).map(m => ({
            label: m.nama_usaha,
            badge: m.status_verifikasi === 'VERIFIED' ? 'Terverifikasi' : m.status_verifikasi === 'PENDING' ? 'Menunggu' : 'Ditolak',
            badgeVariant: m.status_verifikasi === 'VERIFIED' ? 'success' : 'warning',
          })),
          footer: { label: "Kelola UMKM", href: "/umkm-saya" },
        },
      ]} />
      <div className="mb-8" />
      <AnnouncementList announcements={announcements.slice(0, 3).map(mapAnnouncement)} />
      <div className="mb-8" />
      <ActivitySection activities={activities.slice(0, 3).map(mapActivity)} />
    </>
  )
}

function PengurusSection({ user, dashboard, announcements, activities, bills, myBusinesses }) {
  const nama = user?.nama || ''
  const jabatan = user?.jabatan || 'Pengurus'
  return (
    <>
      <WelcomeBanner initials={generateInitials(nama)} name={nama} roleBadge={jabatan} roleBadgeColor="teal" subtitle="Berikut ringkasan data dan aktivitas RT 08." />
      <div className="mb-8" />
      <StatsGrid stats={[
        { number: String(dashboard?.totalWarga || 0), label: "Total Warga", meta: `${dashboard?.totalWarga || 0} warga`, icon: <Icons.Users className="w-5 h-5" /> },
        { number: String(dashboard?.totalUMKM || 0), label: "Total UMKM", meta: `${dashboard?.totalUMKM || 0} UMKM`, icon: <Icons.TrendingUp className="w-5 h-5" /> },
        { number: String(dashboard?.totalLaporanKendala || 0), label: "Total Laporan", meta: `${dashboard?.pendingCounts?.laporanMenungguValidasi || 0} menunggu validasi`, icon: <Icons.FileText className="w-5 h-5" /> },
        { number: formatRupiah(dashboard?.totalPengeluaranKas || 0), label: "Pengeluaran Kas", meta: "Periode berjalan", icon: <Icons.Calendar className="w-5 h-5" /> },
      ]} />
      <SectionDivider icon={Icons.Users} label="Sebagai Pengurus" />
      <BentoGrid sections={[
        {
          title: "Tugas Pengurus",
          subtitle: "Aksi yang perlu segera ditindaklanjuti",
          rows: [
            { label: "UMKM Menunggu Validasi", badge: `${dashboard?.pendingCounts?.umkmMenunggu || 0} menunggu`, badgeVariant: "warning" },
            { label: "Pembayaran Menunggu Verifikasi", badge: `${dashboard?.pendingCounts?.pembayaranMenunggu || 0} menunggu`, badgeVariant: "warning" },
            { label: "Laporan Menunggu Validasi", badge: `${dashboard?.pendingCounts?.laporanMenungguValidasi || 0} menunggu`, badgeVariant: "warning" },
            { label: "Laporan Menunggu Tindak Lanjut", badge: `${dashboard?.pendingCounts?.laporanMenungguTindakLanjut || 0} menunggu`, badgeVariant: "teal" },
          ],
          footer: { label: "Lihat semua tugas", href: "/dashboard" },
        },
        {
          title: "Ringkasan Layanan",
          rows: [
            { label: "Pengumuman Aktif", badge: `${dashboard?.pengumumanAktif || 0} publik`, badgeVariant: "success" },
            { label: "Laporan Kendala Aktif", badge: `${(dashboard?.pendingCounts?.laporanMenungguValidasi || 0) + (dashboard?.pendingCounts?.laporanMenungguTindakLanjut || 0)} dalam proses`, badgeVariant: "teal" },
            { label: "Iuran Aktif", badge: `${dashboard?.totalIuranAktif || 0} aktif`, badgeVariant: "success" },
            { label: "Warga Aktif", badge: `${dashboard?.totalWarga || 0} warga`, badgeVariant: "success" },
          ],
          footer: { label: "Kelola pengumuman", href: "/pengumuman" },
        },
      ]} />
      <TaskGrid tasks={[
        { icon: Icons.TrendingUp, title: "Validasi UMKM", count: `${dashboard?.pendingCounts?.umkmMenunggu || 0} menunggu`, countNum: dashboard?.pendingCounts?.umkmMenunggu || 0, href: "/validasi-umkm" },
        { icon: Icons.CheckCircle, title: "Verifikasi Pembayaran", count: `${dashboard?.pendingCounts?.pembayaranMenunggu || 0} menunggu`, countNum: dashboard?.pendingCounts?.pembayaranMenunggu || 0, href: "/verifikasi-pembayaran" },
        { icon: Icons.Shield, title: "Validasi Laporan", count: `${dashboard?.pendingCounts?.laporanMenungguValidasi || 0} menunggu`, countNum: dashboard?.pendingCounts?.laporanMenungguValidasi || 0, href: "/validasi-laporan" },
        { icon: Icons.FileText, title: "Tindak Lanjut", count: `${dashboard?.pendingCounts?.laporanMenungguTindakLanjut || 0} menunggu`, countNum: dashboard?.pendingCounts?.laporanMenungguTindakLanjut || 0, href: "/tindak-lanjut-laporan" },
      ]} />
      <SectionDivider icon={Icons.Users} label="Sebagai Warga" />
      <StatsGrid stats={[
        { number: String(myBusinesses?.length || 0), label: "UMKM Saya", meta: `${myBusinesses?.length || 0} usaha terdaftar`, icon: <Icons.TrendingUp className="w-5 h-5" /> },
        { number: String(bills?.filter(b => b.status !== 'VERIFIED').length || 0), label: "Tagihan Belum Dibayar", meta: "Perlu tindakan Anda", accent: "bg-warning/10 text-warning", icon: <Icons.Clock className="w-5 h-5" /> },
        { number: "0", label: "Laporan Kendala Saya", meta: "0 laporan", icon: <Icons.FileText className="w-5 h-5" /> },
      ]} />
      <div className="mb-8" />
      <BentoGrid sections={[
        {
          title: "Status Iuran Saya",
          subtitle: "Pembayaran iuran periode berjalan",
          pill: `${bills.filter(b => b.status === 'VERIFIED').length} dari ${bills.length} lunas`,
          rows: (bills.length > 0 ? bills : []).map(b => ({
            label: `${b.nama_iuran} (${b.periode})`,
            badge: b.status === 'VERIFIED' ? 'Lunas' : b.status === 'PENDING' ? 'Menunggu' : 'Belum Dibayar',
            badgeVariant: b.status === 'VERIFIED' ? 'success' : 'warning',
          })),
          footer: { label: "Bayar iuran sekarang", href: "/dashboard" },
        },
        {
          title: "Status UMKM Saya",
          rows: (myBusinesses.length > 0 ? myBusinesses : []).map(m => ({
            label: m.nama_usaha,
            badge: m.status_verifikasi === 'VERIFIED' ? 'Terverifikasi' : m.status_verifikasi === 'PENDING' ? 'Menunggu' : 'Ditolak',
            badgeVariant: m.status_verifikasi === 'VERIFIED' ? 'success' : 'warning',
          })),
          footer: { label: "Kelola UMKM", href: "/dashboard" },
        },
      ]} />
      <div className="mb-8" />
      <AnnouncementList announcements={announcements.slice(0, 3).map(mapAnnouncement)} />
      <div className="mb-8" />
      <ActivitySection activities={activities.slice(0, 3).map(mapActivity)} />
    </>
  )
}

function KetuaSection({ user, dashboard, announcements, activities, pendingWarga, bills, myBusinesses }) {
  const nama = user?.nama || ''
  const jabatan = user?.jabatan || 'Ketua RT'
  return (
    <>
      <WelcomeBanner initials={generateInitials(nama)} name={nama} roleBadge={jabatan} subtitle="Berikut ringkasan data dan aktivitas RT 08." />
      <div className="mb-8" />
      <StatsGrid stats={[
        { number: String(dashboard?.wargaMenungguVerifikasi || dashboard?.pendingCounts?.wargaMenungguVerifikasi || 0), label: "Warga Menunggu Verifikasi", meta: "Perlu tindakan segera", accent: "bg-warning/10 text-warning", icon: <Icons.Users className="w-5 h-5" /> },
        { number: String(dashboard?.totalWarga || 0), label: "Total Warga", meta: `${dashboard?.totalWarga || 0} warga`, icon: <Icons.Users className="w-5 h-5" /> },
        { number: formatRupiah(dashboard?.totalPengeluaranKas || 0), label: "Total Pengeluaran Kas", meta: "Periode berjalan", icon: <Icons.Calendar className="w-5 h-5" /> },
      ]} />
      <SectionDivider icon={Icons.Users} label="Sebagai Ketua" />
      <BentoGrid sections={[
        {
          title: "Verifikasi Warga",
          subtitle: "Warga baru menunggu persetujuan",
          pill: `${pendingWarga.length} menunggu`,
          pillVariant: "warning",
          rows: (pendingWarga.length > 0 ? pendingWarga : []).map(w => ({
            label: w.nama,
            badge: "Menunggu",
            badgeVariant: "warning",
          })),
          footer: { label: "Verifikasi warga sekarang", href: "/verifikasi-warga" },
        },
        {
          title: "Ringkasan Layanan",
          rows: [
            { label: "UMKM Terdaftar", badge: `${dashboard?.totalUMKM || 0} UMKM`, badgeVariant: "success" },
            { label: "Iuran Aktif", badge: `${dashboard?.totalIuranAktif || 0} aktif`, badgeVariant: "success" },
            { label: "Laporan Kendala Aktif", badge: `${dashboard?.totalLaporanKendala || 0} laporan`, badgeVariant: "teal" },
            { label: "Pengumuman Aktif", badge: `${dashboard?.pengumumanAktif || 0} publik`, badgeVariant: "success" },
          ],
          footer: { label: "Kelola pengurus RT", href: "/kelola-pengurus" },
        },
      ]} />
      <TaskGrid tasks={[
        { icon: Icons.Users, title: "Verifikasi Warga", count: `${pendingWarga.length} menunggu`, countNum: pendingWarga.length, href: "/verifikasi-warga" },
        { icon: Icons.Users, title: "Kelola Pengurus", count: "Pengurus aktif", href: "/kelola-pengurus" },
        { icon: Icons.Clock, title: "Kelola Iuran", count: `${dashboard?.totalIuranAktif || 0} iuran aktif`, href: "/kelola-iuran" },
        { icon: Icons.TrendingUp, title: "Laporan Keuangan", count: "Lihat laporan", href: "/laporan-keuangan" },
      ]} />
      <SectionDivider icon={Icons.Users} label="Sebagai Warga" />
      <StatsGrid stats={[
        { number: String(myBusinesses?.length || 0), label: "UMKM Saya", meta: `${myBusinesses?.length || 0} usaha terdaftar`, icon: <Icons.TrendingUp className="w-5 h-5" /> },
        { number: String(bills?.filter(b => b.status !== 'VERIFIED').length || 0), label: "Tagihan Belum Dibayar", meta: "Perlu tindakan Anda", accent: "bg-warning/10 text-warning", icon: <Icons.Clock className="w-5 h-5" /> },
        { number: "0", label: "Laporan Kendala Saya", meta: "0 laporan", icon: <Icons.FileText className="w-5 h-5" /> },
      ]} />
      <div className="mb-8" />
      <BentoGrid sections={[
        {
          title: "Status Iuran Saya",
          subtitle: "Pembayaran iuran periode berjalan",
          pill: `${bills.filter(b => b.status === 'VERIFIED').length} dari ${bills.length} lunas`,
          rows: (bills.length > 0 ? bills : []).map(b => ({
            label: `${b.nama_iuran} (${b.periode})`,
            badge: b.status === 'VERIFIED' ? 'Lunas' : b.status === 'PENDING' ? 'Menunggu' : b.status === 'REJECTED' ? 'Ditolak' : 'Belum Dibayar',
            badgeVariant: b.status === 'VERIFIED' ? 'success' : b.status === 'REJECTED' ? 'danger' : 'warning',
          })),
          footer: { label: "Bayar iuran sekarang", href: "/verifikasi-pembayaran" },
        },
        {
          title: "Status UMKM Saya",
          rows: (myBusinesses.length > 0 ? myBusinesses : []).map(m => ({
            label: m.nama_usaha,
            badge: m.status_verifikasi === 'VERIFIED' ? 'Terverifikasi' : m.status_verifikasi === 'PENDING' ? 'Menunggu' : 'Ditolak',
            badgeVariant: m.status_verifikasi === 'VERIFIED' ? 'success' : 'warning',
          })),
          footer: { label: "Kelola UMKM", href: "/lihat-umkm" },
        },
      ]} />
      <div className="mb-8" />
      <AnnouncementList announcements={announcements.slice(0, 3).map(mapAnnouncement)} />
      <div className="mb-8" />
      <ActivitySection activities={activities.slice(0, 3).map(mapActivity)} />
    </>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const role = user?.role || "RESIDENT"
  const userId = user?.id
  const [dashboard, setDashboard] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [activities, setActivities] = useState([])
  const [pendingWarga, setPendingWarga] = useState([])
  const [bills, setBills] = useState([])
  const [myBusinesses, setMyBusinesses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [dash, anns, acts] = await Promise.all([
          getDashboard(),
          getAnnouncements(),
          getDashboardActivities(),
        ])
        setDashboard(dash.data)
        // Hanya tampilkan pengumuman yang PUBLISHED di dashboard
        setAnnouncements((anns.data || []).filter(a => a.status_publikasi === 'PUBLISHED'))
        setActivities(acts.data)

        if (role === "CHAIRPERSON") {
          const pw = await getPendingVerifications()
          setPendingWarga(pw.data)
        }

        if (role === "CHAIRPERSON" || role === "OFFICER") {
          const [bl, mb] = await Promise.all([
            getCurrentBills(),
            getMyBusinesses(),
          ])
          setBills(bl.data)
          setMyBusinesses(mb.data)
        } else {
          const [bl, mb] = await Promise.all([
            getCurrentBills(),
            getMyBusinesses(),
          ])
          setBills(bl.data)
          setMyBusinesses(mb.data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [role, userId])

  if (loading) {
    return <DashboardLayout><div className="text-center py-16 text-text-muted">Memuat data...</div></DashboardLayout>
  }

  return (
    <DashboardLayout>
      {role === "RESIDENT" && <WargaSection dashboard={dashboard} announcements={announcements} activities={activities} bills={bills} myBusinesses={myBusinesses} />}
      {role === "OFFICER" && <PengurusSection user={user} dashboard={dashboard} announcements={announcements} activities={activities} bills={bills} myBusinesses={myBusinesses} />}
      {role === "CHAIRPERSON" && <KetuaSection user={user} dashboard={dashboard} announcements={announcements} activities={activities} pendingWarga={pendingWarga} bills={bills} myBusinesses={myBusinesses} />}
    </DashboardLayout>
  )
}
