# Analisis Kesesuaian Program dengan DFD & ERD Final

**Proyek:** SMART - Sistem Manajemen RT
**Tanggal:** 19 Juli 2026
**Tujuan:** Memeriksa kesesuaian implementasi program (backend + frontend) terhadap DFD Level 1-3 dan ERD final yang telah disepakati.

---

## 1. Kesesuaian ERD / Prisma Schema dengan DFD

### 1.1 Entity yang Sudah Sesuai

| Entitas DFD | Model Prisma | Status |
|-------------|-------------|--------|
| D1 Data Masyarakat | `Masyarakat` | ✅ |
| D2 Data Warga | `Warga` | ✅ |
| D3 Data Pengurus RT | `PengurusRt` | ✅ |
| D4 Data Iuran | `Iuran` | ⚠️ (lihat di bawah) |
| D5 Data Pembayaran Iuran | `PembayaranIuran` | ✅ |
| D6 Data Pengumuman | `Pengumuman` | ✅ |
| D7 Data Laporan Kendala | `LaporanKendala` | ✅ |
| D8 Data UMKM | `Umkm` | ✅ |
| D9 Data Pengeluaran Kas | `PengeluaranKas` | ⚠️ (lihat di bawah) |

### 1.2 Ketidaksesuaian ERD vs Prisma

#### ❌ D4 Data Iuran — Field `jenis_iuran` TIDAK ADA di Prisma

| DFD D4 | Prisma `Iuran` |
|--------|----------------|
| `id_iuran` (PK) | `idIuran` ✅ |
| `nama_iuran` | `namaIuran` ✅ |
| **`jenis_iuran`** | **❌ TIDAK ADA** |
| `nominal` | `nominal` ✅ |
| `tanggal_jatuh_tempo` | `tanggalJatuhTempo` ✅ |
| `status_aktif` | `statusAktif` ✅ |

**Rekomendasi:** Field `jenis_iuran` ada di ERD/DFD tapi tidak ada di Prisma. Karena Prisma adalah turunan ERD yang sudah disepakati, perlu ditambahkan `jenisIuran` ke schema Prisma. **Atau** jika schema tidak boleh diubah, DFD/ERD perlu direvisi dengan menghapus `jenis_iuran`.

#### ⚠️ D9 Data Pengeluaran Kas — Nama field `tanggal`

| DFD D9 | Prisma `PengeluaranKas` |
|--------|------------------------|
| `tanggal_pengeluaran` | `tanggalKeluar` (berbeda nama) |

Hanya perbedaan penamaan, secara konsep sama. **Tidak perlu perubahan**, hanya konsistensi dokumentasi.

---

## 2. Kesesuaian Endpoint API dengan DFD Level 1-3

### 2.1 Proses 1: Kelola Data Pengguna

| DFD | Endpoint API | Backend | Status |
|-----|-------------|---------|--------|
| 1.1 Registrasi Warga | `POST /residents/register` | `residents/service.ts` — create Masyarakat + Warga | ✅ |
| 1.2 Verifikasi Warga | `PATCH /residents/{id}/verify` | `residents/service.ts` — verifyResident() | ✅ |
| 1.3 Login Pengguna | `POST /auth/login` | `auth/service.ts` — login() | ✅ |
| 1.4 Kelola Pengurus RT | `GET /residents/officers` | `residents/service.ts` — listOfficers() | ✅ |
| 1.4 Kelola Pengurus RT | `PATCH /residents/{id}/officer` | `residents/service.ts` — manageOfficerRole() | ✅ |

**READ Data Stores sesuai DFD:**
- Login: READ Data Masyarakat ✅ (`findByEmail`/`findByUsername`)
- Verifikasi: READ Data Warga ✅
- Kelola Pengurus: READ Data Warga + Data Pengurus RT ✅

### 2.2 Proses 2: Kelola UMKM

| DFD | Endpoint API | Backend | Status |
|-----|-------------|---------|--------|
| 2.1 Kelola Data UMKM | `POST /businesses` | `businesses/service.ts` — createBusiness() | ✅ |
| 2.1 Kelola Data UMKM | `PATCH /businesses/{id}` | `businesses/service.ts` — updateBusiness() | ✅ |
| 2.1 Kelola Data UMKM | `DELETE /businesses/{id}` | via controller, panggil service | ✅ |
| 2.2 Validasi UMKM | `PATCH /businesses/{id}/verify` | `businesses/service.ts` — validateBusiness() | ✅ |
| 2.3 Lihat UMKM | `GET /businesses` | `businesses/service.ts` — listBusinesses() | ✅ |
| 2.3 Lihat UMKM | `GET /businesses/{id}` | `businesses/service.ts` — getBusinessById() | ✅ |
| 2.3 Lihat UMKM | `GET /businesses/me` | `businesses/service.ts` — getMyBusinesses() | ✅ |

**READ Data Stores sesuai DFD:**
- Create UMKM: READ Data Warga (via `user.idWarga`) ✅
- Validasi: READ Data Pengurus RT (via `user.idPengurus`) ✅
- Update/List: READ Data UMKM ✅

### 2.3 Proses 3: Kelola Iuran

| DFD | Endpoint API | Backend | Status |
|-----|-------------|---------|--------|
| 3.1.1 Input Data Iuran | `POST /dues` | `dues/service.ts` — addIuran() | ✅ |
| 3.1.2 Perbarui Data Iuran | `PATCH /dues/{id}` | `dues/service.ts` — editIuran() | ✅ |
| 3.1.3 Nonaktifkan Iuran | `PATCH /dues/{id}/status` | `dues/service.ts` — toggleIuranStatus() | ✅ |
| 3.2.1 Lihat Tagihan Iuran | `GET /payments/bills` | `dues/service.ts` — getBills() | ✅ |
| 3.2.2 Kirim Pembayaran | `POST /payments` | `dues/service.ts` — addPayment() | ✅ |
| 3.2.3 Verifikasi Pembayaran | `PATCH /payments/{id}/verify` | `dues/service.ts` — verifyPayment() | ✅ |
| 3.3 Lihat Riwayat | `GET /payments/me` | `dues/service.ts` — getMyPayments() | ✅ |
| 3.3 Lihat Riwayat | `GET /payments/{id}` | `dues/service.ts` — getPaymentById() | ✅ |

**READ Data Stores sesuai DFD:**
- Create Iuran: READ Data Pengurus RT ✅
- Kirim Bayar: READ Data Warga + Data Iuran ✅
- Verifikasi Bayar: READ Data Pengurus RT + Data Pembayaran ✅

**⚠️ Issue: DFD 3.1 Kelola Data Iuran READ Data Iuran**
DFD Level 2 menunjukkan panah **READ dari Data Iuran** ke proses 3.1. Artinya, sebelum menulis iuran baru, sistem perlu membaca data iuran yang sudah ada (misal untuk validasi duplikasi nama, atau untuk update). Saat ini:
- `addIuran()` — langsung create, tidak ada READ Data Iuran terlebih dahulu. Ini **kurang sesuai** DFD. 
- `editIuran()` — READ via `findIuranById()` ✅
- `toggleIuranStatus()` — READ via `findIuranById()` ✅

### 2.4 Proses 4: Kelola Pengumuman

| DFD | Endpoint API | Backend | Status |
|-----|-------------|---------|--------|
| 4.1 Kelola Pengumuman | `POST /announcements` | `announcement/service.ts` — createAnnouncement() | ✅ |
| 4.1 Kelola Pengumuman | `PATCH /announcements/{id}` | `announcement/service.ts` — updateAnnouncement() | ✅ |
| 4.1 Kelola Pengumuman | `DELETE /announcements/{id}` | `announcement/service.ts` — deleteAnnouncement() | ✅ |
| 4.2 Lihat Pengumuman | `GET /announcements` | `announcement/service.ts` — listAnnouncements() | ✅ |
| 4.2 Lihat Pengumuman | `GET /announcements/{id}` | `announcement/service.ts` — getAnnouncementById() | ✅ |

**READ Data Stores:**
- Create: READ Data Pengurus RT (via `user.idPengurus`) ✅
- Update/Delete: READ Data Pengumuman ✅

### 2.5 Proses 5: Kelola Laporan Kendala

| DFD | Endpoint API | Backend | Status |
|-----|-------------|---------|--------|
| 5.1 Buat Laporan Kendala | `POST /issues` | `issues/service.ts` — createIssue() | ✅ |
| 5.2 Validasi Laporan | `PATCH /issues/{id}/verify` | `issues/service.ts` — updateIssueStatus() | ✅ |
| 5.3 Tindak Lanjut Laporan | `PATCH /issues/{id}/follow-up` | `issues/service.ts` — followUpIssue() | ✅ |
| 5.4 Monitoring Status | `GET /issues` | `issues/service.ts` — listIssues() | ✅ |
| 5.4 Monitoring Status | `GET /issues/me` | `issues/service.ts` — getMyIssues() | ✅ |
| 5.4 Monitoring Status | `GET /issues/{id}` | `issues/service.ts` — getIssueById() | ✅ |

**READ Data Stores:**
- Create: READ Data Warga (via `user.idWarga`) ✅
- Validasi: READ Data Pengurus RT (via `user.idPengurus`) ✅
- Tindak Lanjut: READ Data Pengurus RT ✅
- Monitoring: READ Data Laporan Kendala ✅

### 2.6 Proses 6: Kelola Pengeluaran Kas

| DFD | Endpoint API | Backend | Status |
|-----|-------------|---------|--------|
| 6.1 Kelola Pengeluaran Kas | `POST /finance/expenses` | `finance/service.ts` — addExpense() | ✅ |
| 6.1 Kelola Pengeluaran Kas | `PATCH /finance/expenses/{id}` | `finance/service.ts` — updateExpense() | ✅ |
| 6.1 Kelola Pengeluaran Kas | `DELETE /finance/expenses/{id}` | `finance/service.ts` — deleteExpense() | ✅ |
| 6.2 Lihat Pengeluaran Kas | `GET /finance/expenses` | `finance/service.ts` — getExpenses() | ✅ |
| 6.2 Lihat Pengeluaran Kas | `GET /finance/expenses/{id}` | `finance/service.ts` — getExpenseById() | ✅ |

**READ Data Stores:**
- Create: READ Data Pengurus RT ✅
- Update/Delete: READ Data Pengeluaran Kas ✅

---

## 3. Hal yang Belum Sesuai DFD

### 3.1 Field `jenis_iuran` di D4 Data Iuran

| Sumber | Ada `jenis_iuran`? |
|--------|-------------------|
| DFD / ERD | ✅ Ada |
| Prisma Schema | ❌ **Tidak ada** |
| OpenAPI v2 | ❌ Sudah dihapus (karena tidak ada di Prisma) |
| Frontend | ❌ Sudah dihapus |

**Status:** ❌ **BELUM SESUAI**
**Tindakan:** Jika ERD sudah menyepakati `jenis_iuran`, maka Prisma schema HARUS ditambahkan field ini. Atau sebaliknya — hapus dari ERD jika tidak diperlukan.

### 3.2 Proses 3.1.1 Input Data Iuran — Tidak READ Data Iuran Sebelumnya

DFD Level 3 (3.1.1 Input Data Iuran) menunjukkan:
- READ: Data Pengurus RT ✅ (via token)
- **Tidak ada panah READ dari Data Iuran** sebelum create

Ini sebenarnya **sudah sesuai** karena input data iuran baru tidak perlu membaca data iuran yang sudah ada. Hanya perlu READ Data Pengurus RT untuk mendapatkan `id_ketua_rt`. ✅

### 3.3 Proses 3.2.1 Lihat Tagihan Iuran — Perlu READ Data Iuran

DFD menunjukkan:
- READ: Data Iuran ✅ (untuk mendapatkan daftar iuran aktif)
- WRITE: tidak ada (hanya baca)

Backend: `getBills()` melakukan `findIuranAktif()` ✅

### 3.4 READ Data Warga di Pembayaran Iuran

DFD 3.2.2 Kirim Pembayaran:
- READ: Data Warga (ambil `id_warga`)
- READ: Data Iuran (ambil `id_iuran`)
- WRITE: Data Pembayaran Iuran

Backend: `addPayment()` menggunakan `user.idWarga` dari auth middleware ✅

---

## 4. Endpoint/Fitur yang Ada di Program Tapi Tidak Ada di DFD

| Fitur | Endpoint | Keterangan |
|-------|----------|------------|
| **Dashboard** | `GET /dashboard` | Tidak disebut di DFD Level 1-3, tapi merupakan kebutuhan UI. **Tidak masalah**, ini view agregat. |
| **Dashboard Activities** | `GET /dashboard/activities` | Sama seperti di atas — fitur tambahan untuk UI. |
| **Profile** | `GET/PATCH /profile/me` | Tidak disebut eksplisit di DFD. Bisa dianggap bagian dari 1.3 Login Pengguna. |
| **Logout** | `POST /auth/logout` | Tidak disebut di DFD. |
| **Laporan Keuangan** | `GET /finance/report` | Tidak disebut di DFD. Ini agregasi dari Pembayaran Iuran + Pengeluaran Kas. |

**Kesimpulan:** Fitur-fitur di atas adalah **tambahan yang wajar** untuk kebutuhan UI dan tidak melanggar DFD. Tapi jika ingin strict mengikuti DFD, perlu ditambahkan proses di DFD Level 1.

---

## 5. Hal yang Ada di DFD Tapi Belum di Program

Tidak ada. Semua proses di DFD Level 1-3 sudah diimplementasikan melalui endpoint API.

---

## 6. Ringkasan Ketidaksesuaian

| # | Issue | Tingkat | Saran |
|---|-------|---------|-------|
| 1 | `jenis_iuran` ada di ERD/DFD tapi tidak ada di Prisma | 🔴 **Tinggi** | Tambahkan `jenisIuran` ke schema Prisma, atau hapus dari ERD |
| 2 | Nama field `tanggal_pengeluaran` (DFD) vs `tanggalKeluar` (Prisma) | 🟡 Ringan | Hanya beda penamaan, tidak perlu perubahan |
| 3 | Dashboard, Activities, Profile, Logout, Laporan Keuangan ada di program tapi tidak di DFD | 🟢 Wajar | Bisa ditambahkan ke DFD jika ingin dokumentasi lengkap |
| 4 | `addIuran()` tidak melakukan READ Data Iuran sebelum create | 🟢 Sesuai DFD | DFD 3.1.1 hanya READ Data Pengurus RT untuk create |

---

## 7. Status Final

| Aspek | Kesesuaian |
|-------|-----------|
| ERD ↔ Prisma Schema | ⚠️ 1 ketidaksesuaian (`jenis_iuran`) |
| DFD Level 1-3 ↔ Endpoint API | ✅ Semua proses sudah punya endpoint |
| DFD READ/WRITE Data Store ↔ Backend Logic | ✅ Semua pola READ/WRITE sudah sesuai |
| Aturan DFD (FK via READ) ↔ Backend | ✅ Semua foreign key diperoleh dari READ storage, bukan dari input entitas |
| Frontend ↔ Backend API Contract | ✅ Sudah diselaraskan di openapiv2.json |

**Rekomendasi prioritas:**
1. Jika `jenis_iuran` memang ada di ERD final, tambahkan ke Prisma schema
2. Jika tidak, revisi ERD untuk menghapus `jenis_iuran`
3. Dokumentasi tambahan (Dashboard, Profile, dll) bisa ditambahkan ke DFD Level 1 nanti
