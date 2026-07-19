const ICONS = {
  dashboard: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  warga: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  umkm: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21h16" /><path d="M6 21V8.5a3.5 3.5 0 0 1 7 0V21" /><path d="M18 21v-6a4 4 0 0 0-4-4h-2" /><path d="M10 11h2" /></svg>,
  iuran: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v6l2 3" /><path d="M7 15h10" /></svg>,
  pengumuman: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" /><line x1="8" y1="8" x2="16" y2="8" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="8" y1="16" x2="13" y2="16" /></svg>,
  laporan: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="15" x2="12" y2="15.01" /></svg>,
  kas: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
  keuangan: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>,
}

export const wargaNav = [
  { type: "link", label: "Dashboard", icon: ICONS.dashboard, path: "/dashboard" },
  { type: "link", label: "Pengumuman", icon: ICONS.pengumuman, path: "/pengumuman" },
  { type: "link", label: "Monitoring Laporan", icon: ICONS.laporan, path: "/monitoring-laporan" },
  {
    type: "dropdown", label: "UMKM", icon: ICONS.umkm,
    children: [
      { label: "UMKM Saya", path: "/umkm-saya" },
      { label: "Lihat UMKM", path: "/lihat-umkm" },
    ],
  },
  { type: "link", label: "Pembayaran Iuran", icon: ICONS.iuran, path: "/pembayaran-iuran" },
]

export const pengurusNav = [
  { type: "link", label: "Dashboard", icon: ICONS.dashboard, path: "/dashboard" },
  { type: "link", label: "Data Warga", icon: ICONS.warga, path: "/data-warga" },
  {
    type: "dropdown", label: "UMKM", icon: ICONS.umkm,
    children: [
      { label: "UMKM Saya", path: "/umkm-saya" },
      { label: "Validasi UMKM", path: "/validasi-umkm" },
      { label: "Lihat UMKM", path: "/lihat-umkm" },
    ],
  },
  {
    type: "dropdown", label: "Iuran", icon: ICONS.iuran,
    children: [
      { label: "Pembayaran Iuran", path: "/pembayaran-iuran" },
      { label: "Verifikasi Pembayaran", path: "/verifikasi-pembayaran" },
    ],
  },
  { type: "link", label: "Pengumuman", icon: ICONS.pengumuman, path: "/kelola-pengumuman" },
  {
    type: "dropdown", label: "Laporan Kendala", icon: ICONS.laporan,
    children: [
      { label: "Monitoring", path: "/monitoring-laporan" },
      { label: "Validasi Laporan", path: "/validasi-laporan" },
      { label: "Tindak Lanjut", path: "/tindak-lanjut-laporan" },
    ],
  },
  { type: "link", label: "Pengeluaran Kas", icon: ICONS.kas, path: "/kelola-pengeluaran-kas" },
  { type: "link", label: "Laporan Keuangan", icon: ICONS.keuangan, path: "/laporan-keuangan" },
]

export const ketuaNav = [
  { type: "link", label: "Dashboard", icon: ICONS.dashboard, path: "/dashboard" },
  {
    type: "dropdown", label: "Warga", icon: ICONS.warga,
    children: [
      { label: "Verifikasi Warga", path: "/verifikasi-warga" },
      { label: "Data Warga", path: "/data-warga" },
      { label: "Kelola Pengurus RT", path: "/kelola-pengurus" },
    ],
  },
  {
    type: "dropdown", label: "UMKM", icon: ICONS.umkm,
    children: [
      { label: "UMKM Saya", path: "/umkm-saya" },
      { label: "Validasi UMKM", path: "/validasi-umkm" },
      { label: "Lihat UMKM", path: "/lihat-umkm" },
    ],
  },
  {
    type: "dropdown", label: "Iuran", icon: ICONS.iuran,
    children: [
      { label: "Pembayaran Iuran", path: "/pembayaran-iuran" },
      { label: "Kelola Iuran", path: "/kelola-iuran" },
      { label: "Verifikasi Pembayaran", path: "/verifikasi-pembayaran" },
    ],
  },
  { type: "link", label: "Pengumuman", icon: ICONS.pengumuman, path: "/kelola-pengumuman" },
  {
    type: "dropdown", label: "Laporan Kendala", icon: ICONS.laporan,
    children: [
      { label: "Monitoring", path: "/monitoring-laporan" },
      { label: "Validasi Laporan", path: "/validasi-laporan" },
      { label: "Tindak Lanjut", path: "/tindak-lanjut-laporan" },
    ],
  },
  { type: "link", label: "Pengeluaran Kas", icon: ICONS.kas, path: "/kelola-pengeluaran-kas" },
  { type: "link", label: "Laporan Keuangan", icon: ICONS.keuangan, path: "/laporan-keuangan" },
]