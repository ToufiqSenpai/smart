function delay(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function generateInitials(nama) {
  return nama.split(" ").map((k) => k.charAt(0).toUpperCase()).slice(0, 2).join("")
}

// ==================== DATA STORE ====================

const users = [
  { id: "u1", email: "admin@smartrt.local", password: "admin123", nama: "Budi Santoso", nik: "3275010101010001", alamat: "Jl. Mawar No. 1", noHp: "081234567890", role: "CHAIRPERSON", statusKeanggotaan: "AKTIF", jabatan: "KETUA_RT" },
  { id: "u2", email: "sekretaris@smartrt.local", password: "sekretaris123", nama: "Agus Saputra", nik: "3275010101010007", alamat: "Jl. Kenanga No. 1", noHp: "081234567896", role: "OFFICER", statusKeanggotaan: "AKTIF", jabatan: "SEKRETARIS" },
  { id: "u3", email: "warga@smartrt.local", password: "warga123", nama: "Ani Wijaya", nik: "3275010101010002", alamat: "Jl. Mawar No. 2", noHp: "081234567891", role: "RESIDENT", statusKeanggotaan: "AKTIF", jabatan: null },
]

let wargaData = [
  { id: "w1", idMasyarakat: "u1", nik: "3275010101010001", nama: "Budi Santoso", alamat: "Jl. Mawar No. 1", noHp: "081234567890", statusKeanggotaan: "AKTIF" },
  { id: "w2", idMasyarakat: "u2", nik: "3275010101010007", nama: "Agus Saputra", alamat: "Jl. Kenanga No. 1", noHp: "081234567896", statusKeanggotaan: "AKTIF" },
  { id: "w3", idMasyarakat: "u3", nik: "3275010101010002", nama: "Ani Wijaya", alamat: "Jl. Mawar No. 2", noHp: "081234567891", statusKeanggotaan: "AKTIF" },
  { id: "w4", nik: "3275010101010003", nama: "Siti Rahayu", alamat: "Jl. Mawar No. 3", noHp: "081234567892", statusKeanggotaan: "AKTIF" },
  { id: "w5", nik: "3275010101010004", nama: "Joko Prasetyo", alamat: "Jl. Melati No. 1", noHp: "081234567893", statusKeanggotaan: "AKTIF" },
  { id: "w6", nik: "3275010101010005", nama: "Eko Prabowo", alamat: "Jl. Melati No. 2", noHp: "081234567894", statusKeanggotaan: "AKTIF" },
  { id: "w7", nik: "3275010101010006", nama: "Dewi Lestari", alamat: "Jl. Melati No. 3", noHp: "081234567895", statusKeanggotaan: "AKTIF" },
  { id: "w8", nik: "3275010101010008", nama: "Rina Marlina", alamat: "Jl. Kenanga No. 2", noHp: "081234567897", statusKeanggotaan: "AKTIF" },
  { id: "w9", nik: "3275010101010009", nama: "Hendra Gunawan", alamat: "Jl. Anggrek No. 1", noHp: "081234567898", statusKeanggotaan: "AKTIF" },
  { id: "w10", nik: "3275010101010010", nama: "Fitri Handayani", alamat: "Jl. Anggrek No. 2", noHp: "081234567899", statusKeanggotaan: "AKTIF" },
  { id: "w11", nik: "3275010101010013", nama: "Rudi Hartono", alamat: "Jl. Flamboyan No. 1", noHp: "081234567802", statusKeanggotaan: "MENUNGGU" },
  { id: "w12", nik: "3275010101010014", nama: "Mega Sari", alamat: "Jl. Flamboyan No. 2", noHp: "081234567803", statusKeanggotaan: "MENUNGGU" },
]

let pengurusData = [
  { id: "p1", idMasyarakat: "u1", nama: "Budi Santoso", nik: "3275010101010001", jabatan: "KETUA_RT", periodeJabatan: "2026-2028" },
  { id: "p2", idMasyarakat: "u2", nama: "Agus Saputra", nik: "3275010101010007", jabatan: "SEKRETARIS", periodeJabatan: "2026-2028" },
]

let iuranData = [
  { id: "i1", nama_iuran: "Iuran RT", jenis_iuran: "Wajib", nominal: 50000, tanggal_jatuh_tempo: "2026-07-31", status_aktif: true },
  { id: "i2", nama_iuran: "Iuran Keamanan", jenis_iuran: "Keamanan", nominal: 30000, tanggal_jatuh_tempo: "2026-07-31", status_aktif: true },
  { id: "i3", nama_iuran: "Iuran Sosial", jenis_iuran: "Sosial", nominal: 20000, tanggal_jatuh_tempo: "2026-06-30", status_aktif: true },
  { id: "i4", nama_iuran: "Iuran Kebersihan", jenis_iuran: "Kebersihan", nominal: 15000, tanggal_jatuh_tempo: "2026-06-30", status_aktif: false },
]

let pembayaranData = [
  { id: "b1", id_warga: "w1", warga: "Budi Santoso", id_iuran: "i1", iuran: "Iuran RT", jenis_iuran: "Wajib", periode: "Juli 2026", nominal: 50000, metode_bayar: "Transfer Bank", tanggal_bayar: "2026-07-14", bukti_pembayaran: null, status_verifikasi: "VERIFIED" },
  { id: "b2", id_warga: "w3", warga: "Ani Wijaya", id_iuran: "i2", iuran: "Iuran Keamanan", jenis_iuran: "Keamanan", periode: "Juli 2026", nominal: 30000, metode_bayar: "Tunai", tanggal_bayar: "2026-07-13", bukti_pembayaran: null, status_verifikasi: "PENDING" },
  { id: "b3", id_warga: "w4", warga: "Siti Rahayu", id_iuran: "i1", iuran: "Iuran RT", jenis_iuran: "Wajib", periode: "Juli 2026", nominal: 50000, metode_bayar: "QRIS", tanggal_bayar: "2026-07-12", bukti_pembayaran: null, status_verifikasi: "PENDING" },
  { id: "b4", id_warga: "w5", warga: "Joko Prasetyo", id_iuran: "i3", iuran: "Iuran Sosial", jenis_iuran: "Sosial", periode: "Juni 2026", nominal: 20000, metode_bayar: "Transfer Bank", tanggal_bayar: "2026-06-28", bukti_pembayaran: null, status_verifikasi: "REJECTED" },
  { id: "b5", id_warga: "w6", warga: "Eko Prabowo", id_iuran: "i2", iuran: "Iuran Keamanan", jenis_iuran: "Keamanan", periode: "Juli 2026", nominal: 30000, metode_bayar: "Tunai", tanggal_bayar: "2026-07-11", bukti_pembayaran: null, status_verifikasi: "VERIFIED" },
]

let pengumumanData = [
  { id: "a1", judul: "Kerja Bakti RT 08", isi_pengumuman: "Kerja bakti sosial akan dilaksanakan pada hari Minggu, 20 Juli 2026 pukul 07.00 WIB. Diharapkan seluruh warga RT 08 berpartisipasi.", lampiran: "jadwal-kerja-bakti.pdf", tanggal_pengumuman: "2026-07-14", status_publikasi: "PUBLISHED", author: "Ketua RT" },
  { id: "a2", judul: "Perubahan Jadwal Ronda Malam", isi_pengumuman: "Terhitung mulai bulan Agustus 2026, jadwal ronda malam mengalami perubahan. Silakan cek jadwal terbaru di papan pengumuman.", lampiran: null, tanggal_pengumuman: "2026-07-12", status_publikasi: "PUBLISHED", author: "Humas RT" },
  { id: "a3", judul: "Pendaftaran UMKM", isi_pengumuman: "Pendaftaran UMKM Binaan RT 08 dibuka hingga 31 Juli 2026. Silakan daftar melalui aplikasi SMART RT.", lampiran: "formulir-umkm.pdf", tanggal_pengumuman: "2026-07-10", status_publikasi: "DRAFT", author: "Bendahara" },
  { id: "a4", judul: "Laporan Keuangan", isi_pengumuman: "Laporan pertanggungjawaban keuangan semester I 2026 telah terbit. Warga dapat melihat di aplikasi SMART RT.", lampiran: "laporan-keuangan-semester1-2026.pdf", tanggal_pengumuman: "2026-07-08", status_publikasi: "PUBLISHED", author: "Bendahara" },
  { id: "a5", judul: "Pembagian Sembako", isi_pengumuman: "Pembagian sembako untuk warga kurang mampu akan dilaksanakan hari Sabtu, 19 Juli 2026 di Balai RT.", lampiran: null, tanggal_pengumuman: "2026-07-15", status_publikasi: "PUBLISHED", author: "Ketua RT" },
]

let laporanData = [
  { id: "l1", id_warga: "w1", pelapor: "Budi Santoso", kategori_kendala: "Lampu Jalan Mati", deskripsi: "Lampu jalan di depan rumah nomor 12 mati sejak 3 hari lalu.", foto_kendala: null, tanggal_lapor: "2026-07-14", status_laporan: "PENDING", tanggapan: null },
  { id: "l2", id_warga: "w3", pelapor: "Ani Wijaya", kategori_kendala: "Saluran Air Tersumbat", deskripsi: "Saluran air di belakang rumah tersumbat dan mengeluarkan bau.", foto_kendala: null, tanggal_lapor: "2026-07-12", status_laporan: "VERIFIED", tanggapan: null },
  { id: "l3", id_warga: "w4", pelapor: "Siti Rahayu", kategori_kendala: "Sampah Menumpuk", deskripsi: "Tempat sampah di ujung jalan tidak diangkut selama 3 hari.", foto_kendala: null, tanggal_lapor: "2026-07-10", status_laporan: "IN_PROGRESS", tanggapan: "Sedang dalam penanganan. Akan diangkut hari ini." },
  { id: "l4", id_warga: "w5", pelapor: "Joko Prasetyo", kategori_kendala: "Keamanan", deskripsi: "Ada aktivitas mencurigakan di pos ronda tengah malam.", foto_kendala: null, tanggal_lapor: "2026-07-08", status_laporan: "REJECTED", tanggapan: "Laporan tidak terbukti setelah dilakukan pengecekan." },
  { id: "l5", id_warga: "w6", pelapor: "Eko Prabowo", kategori_kendala: "Jalan Rusak", deskripsi: "Jalan di depan gang Melati rusak dan berlubang, berbahaya bagi pengendara.", foto_kendala: null, tanggal_lapor: "2026-07-05", status_laporan: "COMPLETED", tanggapan: "Jalan sudah diperbaiki pada tanggal 10 Juli 2026." },
]

let umkmData = [
  { id: "m1", id_warga: "w1", nama_usaha: "Warung Makan Sari", jenis_usaha: "Kuliner", pemilik: "Budi Santoso", deskripsi_usaha: "Warung makan dengan menu nasi dan lauk pauk khas Indonesia.", alamat_usaha: "Jl. Mawar No. 12, RT 08/RW 03", kontak_usaha: "081234567890", foto_usaha: null, status_verifikasi: "VERIFIED" },
  { id: "m2", id_warga: "w3", nama_usaha: "Laundry Bersih", jenis_usaha: "Jasa", pemilik: "Ani Wijaya", deskripsi_usaha: "Menerima cuci kiloan dan setrika dengan harga terjangkau.", alamat_usaha: "Jl. Melati No. 5, RT 08/RW 03", kontak_usaha: "081234567891", foto_usaha: null, status_verifikasi: "PENDING" },
  { id: "m3", id_warga: "w4", nama_usaha: "Toko Sembako Makmur", jenis_usaha: "Perdagangan", pemilik: "Siti Rahayu", deskripsi_usaha: "Menyediakan kebutuhan pokok sehari-hari.", alamat_usaha: "Jl. Kenanga No. 3, RT 08/RW 03", kontak_usaha: "081234567892", foto_usaha: null, status_verifikasi: "VERIFIED" },
  { id: "m4", id_warga: "w5", nama_usaha: "Bengkel Jaya", jenis_usaha: "Otomotif", pemilik: "Joko Prasetyo", deskripsi_usaha: "Servis motor dan mobil lengkap.", alamat_usaha: "Jl. Melati No. 10", kontak_usaha: "081234567893", foto_usaha: null, status_verifikasi: "VERIFIED" },
  { id: "m5", id_warga: "w6", nama_usaha: "Katering Nikmat", jenis_usaha: "Kuliner", pemilik: "Eko Prabowo", deskripsi_usaha: "Katering untuk acara keluarga dan perkantoran.", alamat_usaha: "Jl. Melati No. 2", kontak_usaha: "081234567894", foto_usaha: null, status_verifikasi: "REJECTED" },
]

let pengeluaranData = [
  { id: "e1", kategori_pengeluaran: "Operasional", nominal_pengeluaran: 150000, tanggal_keluar: "2026-07-14", keterangan: "Pembelian ATK", bukti_nota: null },
  { id: "e2", kategori_pengeluaran: "Kegiatan", nominal_pengeluaran: 1000000, tanggal_keluar: "2026-07-13", keterangan: "Dana 17-an", bukti_nota: null },
  { id: "e3", kategori_pengeluaran: "Kebersihan", nominal_pengeluaran: 250000, tanggal_keluar: "2026-07-12", keterangan: "Pembelian alat kebersihan", bukti_nota: null },
  { id: "e4", kategori_pengeluaran: "Keamanan", nominal_pengeluaran: 300000, tanggal_keluar: "2026-07-11", keterangan: "Perbaikan lampu pos ronda", bukti_nota: null },
  { id: "e5", kategori_pengeluaran: "Sosial", nominal_pengeluaran: 500000, tanggal_keluar: "2026-07-10", keterangan: "Sumbangan warga kurang mampu", bukti_nota: null },
  { id: "e6", kategori_pengeluaran: "Perbaikan", nominal_pengeluaran: 750000, tanggal_keluar: "2026-07-09", keterangan: "Perbaikan jalan lingkungan", bukti_nota: null },
]

// ==================== AUTH ====================

export async function loginApi({ email, password }) {
  await delay(400)
  const found = users.find((u) => u.email === email && u.password === password)
  if (!found) throw { status: 401, message: "Email atau password salah", code: "INVALID_CREDENTIALS" }
  return {
    accessToken: "mock-token-" + found.role,
    user: {
      id: found.id,
      nama: found.nama,
      username: found.username,
      role: found.role,
      statusKeanggotaan: found.statusKeanggotaan,
      jabatan: found.jabatan,
      initials: generateInitials(found.nama),
    },
  }
}

export async function getProfileApi(userId) {
  await delay(200)
  const u = users.find((x) => x.id === userId)
  if (!u) throw { status: 404, message: "Pengguna tidak ditemukan", code: "NOT_FOUND" }
  // eslint-disable-next-line no-unused-vars
  const { password, ...rest } = u
  return rest
}

// ==================== DASHBOARD ====================

export async function getDashboardApi(role, userId) {
  await delay(300)
  const totalWarga = wargaData.length
  const totalUMKM = umkmData.length
  const totalLaporan = laporanData.length
  const pengumumanAktif = pengumumanData.filter((a) => a.status_publikasi === "PUBLISHED").length
  const totalPengeluaran = pengeluaranData.reduce((s, e) => s + e.nominal_pengeluaran, 0)
  const myUmkm = umkmData.filter((m) => m.id_warga === userId).length
  const myLaporan = laporanData.filter((l) => l.id_warga === userId).length

  const pendingCounts = {
    umkmMenunggu: umkmData.filter((m) => m.status_verifikasi === "PENDING").length,
    pembayaranMenunggu: pembayaranData.filter((p) => p.status_verifikasi === "PENDING").length,
    laporanMenungguValidasi: laporanData.filter((l) => l.status_laporan === "PENDING").length,
    laporanMenungguTindakLanjut: laporanData.filter((l) => l.status_laporan === "VERIFIED").length,
    wargaMenungguVerifikasi: wargaData.filter((w) => w.statusKeanggotaan === "MENUNGGU").length,
  }

  if (role === "CHAIRPERSON") {
    return {
      profil: { nama: users.find((u) => u.id === userId)?.nama, statusKeanggotaan: "AKTIF" },
      totalWarga,
      wargaMenungguVerifikasi: pendingCounts.wargaMenungguVerifikasi,
      totalIuranAktif: iuranData.filter((i) => i.status_aktif).length,
      totalUMKM,
      totalLaporanKendala: totalLaporan,
      pengumumanAktif,
      totalPengeluaranKas: totalPengeluaran,
      pendingCounts,
    }
  }
  if (role === "OFFICER") {
    return {
      totalWarga,
      totalUMKM,
      totalLaporanKendala: totalLaporan,
      pengumumanAktif,
      totalPengeluaranKas: totalPengeluaran,
      pendingCounts,
    }
  }
  return {
    profil: { nama: users.find((u) => u.id === userId)?.nama, statusKeanggotaan: "AKTIF" },
    jumlahUMKM: myUmkm,
    jumlahTagihanBelumDibayar: iuranData.filter((i) => i.status_aktif).length - pembayaranData.filter((p) => p.id_warga === userId && p.status_verifikasi === "VERIFIED").length,
    jumlahLaporanSaya: myLaporan,
    pengumumanTerbaru: pengumumanAktif,
  }
}

// ==================== RESIDENTS ====================

export async function getResidentsApi({ search, status } = {}) {
  await delay(300)
  let data = [...wargaData]
  if (search) data = data.filter((w) => w.nama.toLowerCase().includes(search.toLowerCase()) || w.nik.includes(search))
  if (status && status !== "all") data = data.filter((w) => w.statusKeanggotaan === status)
  return data.map(({ id, nik, nama, alamat, noHp, statusKeanggotaan }) => ({ id, nik, nama, alamat, noHp, statusKeanggotaan }))
}

export async function getPendingVerificationsApi() {
  await delay(300)
  return wargaData.filter((w) => w.statusKeanggotaan === "MENUNGGU").map(({ id, nik, nama, alamat, noHp }) => ({ id, nik, nama, alamat, no_hp: noHp }))
}

export async function verifyResidentApi(id, status) {
  await delay(300)
  const w = wargaData.find((x) => x.id === id)
  if (!w) throw { status: 404, message: "Data warga tidak ditemukan", code: "NOT_FOUND" }
  w.statusKeanggotaan = status
  return { message: "Status keanggotaan berhasil diperbarui." }
}

export async function getOfficersApi() {
  await delay(300)
  return [...pengurusData]
}

// ==================== BUSINESSES ====================

export async function getBusinessesApi({ keyword, status } = {}) {
  await delay(300)
  let data = [...umkmData]
  if (keyword) data = data.filter((m) => m.nama_usaha.toLowerCase().includes(keyword.toLowerCase()))
  if (status && status !== "all") data = data.filter((m) => m.status_verifikasi === status)
  return data
}

export async function getMyBusinessesApi(userId) {
  await delay(300)
  return umkmData.filter((m) => m.id_warga === userId)
}

export async function getBusinessByIdApi(id) {
  await delay(200)
  const item = umkmData.find((m) => m.id === id)
  if (!item) throw { status: 404, message: "UMKM tidak ditemukan", code: "NOT_FOUND" }
  return item
}

// ==================== DUES ====================

export async function getDuesApi() {
  await delay(300)
  return [...iuranData]
}

export async function createDueApi(data) {
  await delay(300)
  const item = { id: "i" + Date.now(), ...data, status_aktif: true }
  iuranData.unshift(item)
  return item
}

export async function updateDueApi(id, data) {
  await delay(300)
  const idx = iuranData.findIndex((i) => i.id === id)
  if (idx === -1) throw { status: 404, message: "Data iuran tidak ditemukan", code: "NOT_FOUND" }
  iuranData[idx] = { ...iuranData[idx], ...data }
  return iuranData[idx]
}

export async function toggleDueStatusApi(id, status) {
  await delay(300)
  const item = iuranData.find((i) => i.id === id)
  if (!item) throw { status: 404, message: "Data iuran tidak ditemukan", code: "NOT_FOUND" }
  item.status_aktif = status === "ACTIVE"
  return item
}

// ==================== BILLS & PAYMENTS ====================

export async function getBillsApi(userId) {
  await delay(300)
  const activeIuran = iuranData.filter((i) => i.status_aktif)
  const myPayments = pembayaranData.filter((p) => p.id_warga === userId)
  const currentMonth = "Juli 2026"
  return activeIuran.map((i) => {
    const paid = myPayments.find((p) => p.id_iuran === i.id && p.periode === currentMonth)
    return {
      id: i.id,
      id_iuran: i.id,
      nama_iuran: i.nama_iuran,
      jenis_iuran: i.jenis_iuran,
      periode: currentMonth,
      nominal: i.nominal,
      tanggal_jatuh_tempo: i.tanggal_jatuh_tempo,
      status: paid ? paid.status_verifikasi : "BELUM_DIBAYAR",
    }
  })
}

export async function getPaymentsApi() {
  await delay(300)
  return [...pembayaranData]
}

export async function getPaymentByIdApi(id) {
  await delay(200)
  const item = pembayaranData.find((p) => p.id === id)
  if (!item) throw { status: 404, message: "Data pembayaran tidak ditemukan", code: "NOT_FOUND" }
  return item
}

export async function submitPaymentApi(data) {
  await delay(400)
  const item = { id: "b" + Date.now(), ...data, status_verifikasi: "PENDING" }
  pembayaranData.unshift(item)
  return { message: "Pembayaran berhasil dikirim.", id: item.id }
}

export async function verifyPaymentApi(id, status) {
  await delay(300)
  const item = pembayaranData.find((p) => p.id === id)
  if (!item) throw { status: 404, message: "Data pembayaran tidak ditemukan", code: "NOT_FOUND" }
  item.status_verifikasi = status
  return { message: "Status pembayaran berhasil diperbarui." }
}

// ==================== ANNOUNCEMENTS ====================

export async function getAnnouncementsApi() {
  await delay(300)
  return [...pengumumanData]
}

export async function getAnnouncementByIdApi(id) {
  await delay(200)
  const item = pengumumanData.find((a) => a.id === id)
  if (!item) throw { status: 404, message: "Pengumuman tidak ditemukan", code: "NOT_FOUND" }
  return item
}

export async function createAnnouncementApi(data) {
  await delay(300)
  const item = { id: "a" + Date.now(), ...data, tanggal_pengumuman: new Date().toISOString().split("T")[0], author: "Pengurus RT" }
  pengumumanData.unshift(item)
  return { message: "Pengumuman berhasil ditambahkan." }
}

export async function updateAnnouncementApi(id, data) {
  await delay(300)
  const idx = pengumumanData.findIndex((a) => a.id === id)
  if (idx === -1) throw { status: 404, message: "Pengumuman tidak ditemukan", code: "NOT_FOUND" }
  pengumumanData[idx] = { ...pengumumanData[idx], ...data }
  return { message: "Pengumuman berhasil diperbarui." }
}

export async function deleteAnnouncementApi(id) {
  await delay(300)
  pengumumanData = pengumumanData.filter((a) => a.id !== id)
  return { message: "Pengumuman berhasil dihapus." }
}

// ==================== ISSUES ====================

export async function getIssuesApi() {
  await delay(300)
  return [...laporanData]
}

export async function getMyIssuesApi(userId) {
  await delay(300)
  return laporanData.filter((l) => l.id_warga === userId)
}

export async function getIssueByIdApi(id) {
  await delay(200)
  const item = laporanData.find((l) => l.id === id)
  if (!item) throw { status: 404, message: "Laporan tidak ditemukan", code: "NOT_FOUND" }
  return item
}

export async function createIssueApi(data) {
  await delay(400)
  const item = { id: "l" + Date.now(), ...data, status_laporan: "PENDING", tanggapan: null }
  laporanData.unshift(item)
  return { message: "Laporan berhasil dikirim.", id: item.id }
}

export async function verifyIssueApi(id, status) {
  await delay(300)
  const item = laporanData.find((l) => l.id === id)
  if (!item) throw { status: 404, message: "Laporan tidak ditemukan", code: "NOT_FOUND" }
  item.status_laporan = status
  return { message: "Status laporan berhasil diperbarui." }
}

export async function followUpIssueApi(id, tanggapan, status) {
  await delay(300)
  const item = laporanData.find((l) => l.id === id)
  if (!item) throw { status: 404, message: "Laporan tidak ditemukan", code: "NOT_FOUND" }
  item.tanggapan = tanggapan
  if (status) item.status_laporan = status
  return { message: "Tindak lanjut laporan berhasil disimpan." }
}

// ==================== FINANCE ====================

export async function getExpensesApi() {
  await delay(300)
  return [...pengeluaranData]
}

export async function createExpenseApi(data) {
  await delay(300)
  const item = { id: "e" + Date.now(), ...data }
  pengeluaranData.unshift(item)
  return item
}

export async function updateExpenseApi(id, data) {
  await delay(300)
  const idx = pengeluaranData.findIndex((e) => e.id === id)
  if (idx === -1) throw { status: 404, message: "Data pengeluaran tidak ditemukan", code: "NOT_FOUND" }
  pengeluaranData[idx] = { ...pengeluaranData[idx], ...data }
  return pengeluaranData[idx]
}

export async function deleteExpenseApi(id) {
  await delay(300)
  pengeluaranData = pengeluaranData.filter((e) => e.id !== id)
  return { message: "Data pengeluaran berhasil dihapus." }
}

export async function getFinanceReportApi() {
  await delay(300)
  const pemasukan = pembayaranData.filter((p) => p.status_verifikasi === "VERIFIED")
  const pengeluaran = [...pengeluaranData]
  const totalPemasukan = pemasukan.reduce((s, p) => s + p.nominal, 0)
  const totalPengeluaran = pengeluaran.reduce((s, e) => s + e.nominal_pengeluaran, 0)
  return {
    totalPemasukan,
    totalPengeluaran,
    saldoAkhir: totalPemasukan - totalPengeluaran,
    jumlahTransaksi: pemasukan.length + pengeluaran.length,
    pemasukan: pemasukan.map((p) => ({ warga: p.warga, iuran: p.iuran, periode: p.periode, tanggal: p.tanggal_bayar, nominal: p.nominal })),
    pengeluaran: pengeluaran.map((e) => ({ kategori: e.kategori_pengeluaran, keterangan: e.keterangan, tanggal: e.tanggal_keluar, nominal: e.nominal_pengeluaran })),
  }
}

// ==================== ACTIVITIES ====================

export async function getDashboardActivitiesApi() {
  await delay(200)
  const items = [
    { tipe: "LAPORAN", judul: "Lampu Jalan Mati", status: "SELESAI", meta: "Budi Santoso • 14/07/2026" },
    { tipe: "LAPORAN", judul: "Saluran Air Tersumbat", status: "DIPROSES", meta: "Ani Wijaya • 12/07/2026" },
    { tipe: "LAPORAN", judul: "Sampah Menumpuk", status: "MENUNGGU", meta: "Siti Rahayu • 10/07/2026" },
    { tipe: "PEMBAYARAN", judul: "Iuran RT — Ani Wijaya", status: "PENDING", meta: "13/07/2026" },
    { tipe: "PEMBAYARAN", judul: "Iuran Keamanan — Eko Prabowo", status: "VERIFIED", meta: "11/07/2026" },
    { tipe: "PENGUMUMAN", judul: "Kerja Bakti RT 08", status: "PUBLISHED", meta: "14/07/2026" },
  ]
  return items
}