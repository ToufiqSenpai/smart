// Mock API untuk testing berbagai role
// Dummy users:
const users = [
  { username: "admin", password: "admin123", role: "ketua", name: "Budi Santoso", initials: "BS" },
  { username: "sekretaris", password: "sekretaris123", role: "pengurus", name: "Agus Saputra", initials: "AS" },
  { username: "warga", password: "warga123", role: "warga", name: "Ani Wijaya", initials: "AW" },
]

export function mockLogin({ username, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(u => u.username === username && u.password === password)
      if (user) {
        resolve({ user: { ...user }, token: "mock-token-" + user.role })
      } else {
        reject(new Error("Username atau password salah"))
      }
    }, 500)
  })
}

export function getRoleConfig(role) {
  const configs = {
    warga: { nav: "wargaNav", userName: "Ani Wijaya", userRole: "Warga", initials: "AW" },
    pengurus: { nav: "pengurusNav", userName: "Agus Saputra", userRole: "Sekretaris", initials: "AS" },
    ketua: { nav: "ketuaNav", userName: "Budi Santoso", userRole: "Ketua RT", initials: "BS" },
  }
  return configs[role] || configs.warga
}

// Mock data functions
export function fetchDashboardData(role) {
  const data = {
    warga: {
      stats: [
        { number: "2", label: "UMKM Saya", meta: "2 usaha terdaftar", icon: "umkm" },
        { number: "1", label: "Tagihan Belum Dibayar", meta: "Perlu tindakan Anda", accent: true },
        { number: "3", label: "Laporan Kendala Saya", meta: "1 dalam proses", icon: "laporan" },
      ],
      bento: [], tasks: [], announcements: [], activities: []
    },
    pengurus: {
      stats: [
        { number: "47", label: "Total Warga", meta: "44 aktif, 3 menunggu", icon: "users" },
        { number: "6", label: "Total UMKM", meta: "6 terverifikasi", icon: "umkm" },
        { number: "5", label: "Total Laporan", meta: "2 menunggu validasi", icon: "laporan" },
        { number: "Rp 6.5 Jt", label: "Pengeluaran Kas", meta: "Periode Juli 2026", icon: "kas" },
      ],
    },
    ketua: {
      stats: [
        { number: "3", label: "Warga Menunggu Verifikasi", meta: "Perlu tindakan segera", accent: true },
        { number: "47", label: "Total Warga", meta: "44 aktif, 3 menunggu", icon: "users" },
        { number: "Rp 6.5 Jt", label: "Total Pengeluaran Kas", meta: "Periode Juli 2026", icon: "kas" },
      ],
      wargaStats: [
        { number: "2", label: "UMKM Saya", meta: "2 usaha terdaftar", icon: "umkm" },
        { number: "1", label: "Tagihan Belum Dibayar", meta: "Perlu tindakan Anda", accent: true },
        { number: "3", label: "Laporan Kendala Saya", meta: "1 dalam proses", icon: "laporan" },
      ],
    },
  }
  return data[role] || data.warga
}
