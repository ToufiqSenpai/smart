# Laporan Sinkronisasi OpenAPI dengan Frontend

**Proyek:** SMART - Sistem Manajemen RT
**Tanggal:** 19 Juli 2026
**Tujuan:** Memeriksa kesesuaian antara kontrak API (`openapi.json`) dengan implementasi frontend (`apps/web`).

---

## Ringkasan Eksekutif

Frontend saat ini **belum terhubung sama sekali dengan backend**. Seluruh data yang ditampilkan adalah *hardcoded mock data* di masing-masing komponen halaman. Tidak ada HTTP client (Axios/fetch) yang dikonfigurasi, dan tidak ada satupun *real API call* yang dibuat. Oleh karena itu, **sinkronisasi antara openapi.json dan frontend masih 0%** — seluruh integrasi API perlu dibangun dari awal.

---

## 1. API Contract (`openapi.json`)

### Base URL
```
/api
```

Backend memasang seluruh route di bawah prefix `/api/v1`.

### Daftar Endpoint

| # | Method | Path | Tags | Deskripsi |
|---|--------|------|------|-----------|
| 1 | POST | `/auth/login` | Authentication | Login |
| 2 | POST | `/auth/logout` | Authentication | Logout |
| 3 | GET | `/dashboard` | Dashboard | Dashboard by role |
| 4 | POST | `/residents/register` | Residents | Registrasi warga |
| 5 | GET | `/residents` | Residents | Daftar warga |
| 6 | GET | `/residents/{id}` | Residents | Detail warga |
| 7 | PATCH | `/residents/{id}` | Residents | Ubah data warga |
| 8 | GET | `/residents/pending-verifications` | Residents | Warga menunggu verifikasi |
| 9 | PATCH | `/residents/{id}/verification-status` | Residents | Verifikasi warga |
| 10 | GET | `/residents/officers` | Residents | Daftar pengurus RT |
| 11 | PATCH | `/residents/{id}/officer-role` | Residents | Kelola jabatan pengurus |
| 12 | GET | `/businesses` | Businesses | Daftar UMKM |
| 13 | POST | `/businesses` | Businesses | Tambah UMKM |
| 14 | GET | `/businesses/me` | Businesses | UMKM saya |
| 15 | GET | `/businesses/{id}` | Businesses | Detail UMKM |
| 16 | PATCH | `/businesses/{id}` | Businesses | Ubah UMKM |
| 17 | PATCH | `/businesses/{id}/status` | Businesses | Validasi UMKM |
| 18 | GET | `/dues` | Dues - Master | Daftar iuran |
| 19 | POST | `/dues` | Dues - Master | Tambah iuran |
| 20 | GET | `/dues/{id}` | Dues - Master | Detail iuran |
| 21 | PATCH | `/dues/{id}` | Dues - Master | Perbarui iuran |
| 22 | PATCH | `/dues/{id}/status` | Dues - Master | Ubah status iuran |
| 23 | GET | `/dues/bills` | Dues - Payments | Tagihan saya |
| 24 | POST | `/dues/payments` | Dues - Payments | Kirim pembayaran |
| 25 | GET | `/dues/payments` | Dues - Payments | Daftar pembayaran |
| 26 | GET | `/dues/payments/{id}` | Dues - Payments | Detail pembayaran |
| 27 | PATCH | `/dues/payments/{id}/status` | Dues - Payments | Verifikasi pembayaran |
| 28 | GET | `/dues/me/payments` | Dues - Payments | Riwayat bayar saya |
| 29 | GET | `/announcements` | Announcements | Daftar pengumuman |
| 30 | POST | `/announcements` | Announcements | Tambah pengumuman |
| 31 | GET | `/announcements/{id}` | Announcements | Detail pengumuman |
| 32 | PATCH | `/announcements/{id}` | Announcements | Perbarui pengumuman |
| 33 | GET | `/issues` | Issues | Daftar laporan kendala |
| 34 | POST | `/issues` | Issues | Buat laporan kendala |
| 35 | GET | `/issues/me` | Issues | Laporan saya |
| 36 | GET | `/issues/{id}` | Issues | Detail laporan |
| 37 | PATCH | `/issues/{id}` | Issues | Perbarui laporan |
| 38 | PATCH | `/issues/{id}/status` | Issues | Ubah status laporan |
| 39 | PATCH | `/issues/{id}/follow-up` | Issues | Tindak lanjut laporan |
| 40 | GET | `/finance/expenses` | Finance | Daftar pengeluaran kas |
| 41 | POST | `/finance/expenses` | Finance | Tambah pengeluaran kas |
| 42 | GET | `/finance/expenses/{id}` | Finance | Detail pengeluaran kas |
| 43 | PATCH | `/finance/expenses/{id}` | Finance | Perbarui pengeluaran kas |
| 44 | GET | `/profile/me` | Profile | Lihat profil |
| 45 | PATCH | `/profile/me` | Profile | Perbarui profil |

### Security
- Seluruh endpoint kecuali `/auth/login`, `/auth/logout`, dan `/residents/register` memerlukan **Bearer Token (JWT)**.

### Skema Response
- `SuccessResponse`: `{ message: string, data: any }`
- `ErrorResponse`: `{ message: string, code?: string, errors?: object }`

---

## 2. Kondisi Frontend Saat Ini

### HTTP Client
- **Tidak ada HTTP client** (Axios/fetch) yang terinstal atau dikonfigurasi.
- `package.json` tidak mencantumkan `axios` sebagai dependensi.
- Tidak ada file `src/utils/http.ts` atau sejenisnya.
- `vite.config.js` tidak memiliki konfigurasi proxy.

### Mock Data
- Semua halaman menggunakan data statis/hardcoded di dalam file komponen.
- Satu-satunya file yang menyerupai API: `src/utils/mockApi.js` — berisi 3 fungsi palsu (`mockLogin`, `getRoleConfig`, `fetchDashboardData`).
- Fungsi `fetchDashboardData` sebenarnya **tidak digunakan** oleh halaman Dashboard (Dashboard memakai data inline sendiri).

### Auth
- Login menggunakan `mockLogin()` di `AuthContext.jsx`.
- User disimpan di React state (hilang saat refresh).
- Tidak ada token management (localStorage/sessionStorage/cookies).

---

## 3. Analisis Kesenjangan (Gap Analysis)

### 3.1 Endpoint API vs Fitur Frontend

| Area Fitur | Endpoint di OpenAPI | Implementasi Frontend | Status |
|------------|--------------------|-----------------------|--------|
| **Auth - Login** | `POST /auth/login` | Ada halaman Login + mock login | Belum connect |
| **Auth - Logout** | `POST /auth/logout` | Ada fungsi logout di context | Belum connect |
| **Dashboard** | `GET /dashboard` | Ada halaman Dashboard (data inline) | Belum connect |
| **Registrasi Warga** | `POST /residents/register` | Ada halaman Register | Belum connect |
| **Data Warga** | `GET /residents` | Ada halaman DataWarga | Belum connect |
| **Detail Warga** | `GET /residents/{id}` | Tidak ada halaman detail warga | **MISSING** |
| **Edit Warga** | `PATCH /residents/{id}` | Tidak ada | **MISSING** |
| **Verifikasi Warga** | `GET /residents/pending-verifications`, `PATCH /residents/{id}/verification-status` | Ada halaman VerifikasiWarga | Belum connect |
| **Daftar Pengurus** | `GET /residents/officers` | Ada halaman KelolaPengurus | Belum connect |
| **Kelola Jabatan Pengurus** | `PATCH /residents/{id}/officer-role` | Ada Tambah/Edit Pengurus | Belum connect |
| **Daftar UMKM** | `GET /businesses` | Ada halaman LihatUMKM | Belum connect |
| **Tambah UMKM** | `POST /businesses` | Ada halaman TambahUMKM | Belum connect |
| **UMKM Saya** | `GET /businesses/me` | Ada halaman UMKMSaya | Belum connect |
| **Detail UMKM** | `GET /businesses/{id}` | Ada halaman DetailUMKM | Belum connect |
| **Edit UMKM** | `PATCH /businesses/{id}` | Ada halaman EditUMKM | Belum connect |
| **Validasi UMKM** | `PATCH /businesses/{id}/status` | Ada ValidasiUMKM + DetailValidasi | Belum connect |
| **Daftar Iuran** | `GET /dues` | Ada halaman KelolaIuran | Belum connect |
| **Tambah Iuran** | `POST /dues` | Ada halaman TambahIuran | Belum connect |
| **Detail/Edit Iuran** | `GET/PATCH /dues/{id}` | Ada halaman EditIuran | Belum connect |
| **Status Iuran** | `PATCH /dues/{id}/status` | Ada toggle aktif/nonaktif | Belum connect |
| **Tagihan Saya** | `GET /dues/bills` | Ada daftar tagihan di PembayaranIuran | Belum connect |
| **Kirim Pembayaran** | `POST /dues/payments` | Ada form bayar + upload bukti | Belum connect |
| **Riwayat Bayar Saya** | `GET /dues/me/payments` | Tidak ada halaman riwayat bayar sendiri | **MISSING** |
| **Daftar Pembayaran** | `GET /dues/payments` | Ada VerifikasiPembayaran | Belum connect |
| **Detail Pembayaran** | `GET /dues/payments/{id}` | Ada DetailVerifikasi | Belum connect |
| **Verifikasi Pembayaran** | `PATCH /dues/payments/{id}/status` | Ada tombol Verifikasi/Tolak | Belum connect |
| **Daftar Pengumuman** | `GET /announcements` | Ada Pengumuman (warga) + KelolaPengumuman | Belum connect |
| **Tambah Pengumuman** | `POST /announcements` | Ada TambahPengumuman | Belum connect |
| **Detail Pengumuman** | `GET /announcements/{id}` | Tidak ada halaman detail sendiri | **MISSING** |
| **Edit Pengumuman** | `PATCH /announcements/{id}` | Ada EditPengumuman | Belum connect |
| **Daftar Laporan** | `GET /issues` | Ada MonitoringLaporan (Ketua) | Belum connect |
| **Laporan Saya** | `GET /issues/me` | Ada MonitoringLaporan (Warga) | Belum connect |
| **Buat Laporan** | `POST /issues` | Ada BuatLaporan | Belum connect |
| **Detail Laporan** | `GET /issues/{id}` | Ada DetailLaporan | Belum connect |
| **Edit Laporan** | `PATCH /issues/{id}` | Ada tombol edit di detail warga | Belum connect |
| **Ubah Status Laporan** | `PATCH /issues/{id}/status` | Ada ValidasiLaporan | Belum connect |
| **Tindak Lanjut** | `PATCH /issues/{id}/follow-up` | Ada TindakLanjut + DetailTindakLanjut | Belum connect |
| **Pengeluaran Kas** | `GET/POST /finance/expenses` | Ada Kelola/Tambah PengeluaranKas | Belum connect |
| **Detail/Edit Kas** | `GET/PATCH /finance/expenses/{id}` | Ada EditPengeluaranKas | Belum connect |
| **Laporan Keuangan** | *(tidak ada endpoint khusus)* | Ada halaman LaporanKeuangan | **MISSING endpoint** |
| **Profil** | `GET/PATCH /profile/me` | Tidak ada halaman profil | **MISSING** |
| **Hapus Pengurus** | Tidak ada endpoint | Ada tombol hapus di KelolaPengurus | **MISSING endpoint** |
| **Hapus Pengumuman** | Tidak ada endpoint | Ada tombol hapus di KelolaPengumuman | **MISSING endpoint** |
| **Hapus Pengeluaran Kas** | Tidak ada endpoint | Ada tombol hapus di KelolaPengeluaranKas | **MISSING endpoint** |
| **Export PDF Laporan** | Tidak ada endpoint | Ada tombol Export PDF | **MISSING endpoint** |

### 3.2 Permasalahan Field Name (Snake Case vs Camel Case)

OpenAPI menggunakan **snake_case** (`nama_usaha`, `no_hp`, `tanggal_jatuh_tempo`, `status_keanggotaan`, dll).

Frontend menggunakan **camelCase** (`namaUsaha`, `noHp`, `jatuhTempo`, `statusKeanggotaan`, dll).

Perlu konfigurasi transform di HTTP client atau serializer.

### 3.3 Permasalahan Route Prefix

- OpenAPI mendefinisikan base URL `"/api"`.
- Backend memasang route di `"/api/v1"`.
- Frontend perlu menyesuaikan base URL menjadi `/api/v1` atau diproxy melalui Vite.

### 3.4 Permasalahan Status Enum

Beberapa perbedaan enum value antara OpenAPI dan frontend:

| Field | OpenAPI | Frontend |
|-------|---------|----------|
| Role user | `RESIDENT, OFFICER, CHAIRPERSON` | `warga, pengurus, ketua` |
| Status anggota | `AKTIF, DITOLAK` | `aktif, nonaktif, menunggu, terverifikasi, ditolak` |
| Status UMKM | `VERIFIED, PENDING, REJECTED` | `pending, verified, rejected, menunggu` |
| Status iuran | `ACTIVE, INACTIVE` | `active, inactive` |
| Status pembayaran | `BELUM_DIBAYAR, PENDING, VERIFIED, REJECTED` | `menunggu, terverifikasi, ditolak, lunas` |
| Status publikasi | `PUBLISHED, DRAFT` | `publik, draft` |
| Status laporan | `PENDING, IN_PROGRESS, COMPLETED` | `menunggu, diverifikasi, proses, selesai, ditolak` |

---

## 4. Ringkasan Tindakan yang Diperlukan

### Prioritas Tinggi

1. **Instalasi HTTP Client**: Tambahkan `axios` (atau gunakan native `fetch`) di `apps/web`.
2. **Konfigurasi Base URL & Proxy**: Set `VITE_API_URL` atau proxy di `vite.config.js` ke `http://localhost:5000/api/v1`.
3. **Auth Integration**:
   - `POST /auth/login` → ganti `mockLogin` dengan real API call.
   - Simpan `accessToken` di `localStorage`.
   - Tambahkan `Authorization: Bearer <token>` header di setiap request.
   - `POST /auth/logout` → implementasi logout via API.
4. **HTTP Utility Module**: Buat `src/utils/http.js` dengan instance Axios + interceptor untuk token, error handling, dan transform snake_case ↔ camelCase.

### Prioritas Sedang

5. **Dashboard**: `GET /dashboard` → ganti data inline dengan response API, parse data sesuai role.
6. **Manajemen Warga**:
   - `GET /residents` + `GET /residents/pending-verifications`
   - `PATCH /residents/{id}/verification-status` untuk verifikasi
   - `PATCH /residents/{id}` untuk edit warga (jika perlu)
   - `GET /residents/{id}` untuk detail warga (halaman baru)
7. **Manajemen Pengurus**:
   - `GET /residents/officers` → daftar pengurus
   - `PATCH /residents/{id}/officer-role` → tambah/edit/hapus jabatan
   - Hapus pengurus → butuh endpoint baru atau gunakan officer-role dengan jabatan `null`
8. **UMKM**:
   - Semua endpoint CRUD + validasi (`GET/POST /businesses`, dll)
   - Perhatikan field `foto_usaha` perlu upload file
9. **Iuran & Pembayaran**:
   - Semua endpoint dari tag `Dues - Master` dan `Dues - Payments`
   - Upload file untuk `bukti_pembayaran`
10. **Pengumuman**:
    - `GET/POST /announcements`, `GET/PATCH /announcements/{id}`
    - Hapus pengumuman → butuh endpoint `DELETE /announcements/{id}`
11. **Laporan Kendala**:
    - Semua endpoint dari tag `Issues`
    - Upload file untuk `foto_kendala`
12. **Pengeluaran Kas**:
    - `GET/POST /finance/expenses`, `GET/PATCH /finance/expenses/{id}`
    - Hapus pengeluaran → butuh endpoint `DELETE /finance/expenses/{id}`
13. **Profil**: Implementasi `GET/PATCH /profile/me` — halaman profil belum ada.
14. **Laporan Keuangan**: Tidak ada endpoint khusus. Bisa pakai agregasi dari `/dues/payments` + `/finance/expenses`, atau buat endpoint laporan keuangan baru.

### Prioritas Rendah

15. **Export PDF**: Butuh endpoint backend untuk generate PDF laporan keuangan, atau lakukan client-side.
16. **Halaman Detail**: Tambah halaman detail warga (`/data-warga/:id`) dan detail pengumuman (`/pengumuman/:id`).
17. **Riwayat Pembayaran Warga**: Implementasi `GET /dues/me/payments`.

---

## 5. Diagram Keterkaitan Halaman → API

```
Login          → POST   /auth/login
Logout         → POST   /auth/logout
Register       → POST   /residents/register
Dashboard      → GET    /dashboard

DataWarga      → GET    /residents
VerifikasiWarga → GET   /residents/pending-verifications
               → PATCH  /residents/{id}/verification-status

KelolaPengurus  → GET   /residents/officers
TambahPengurus  → PATCH /residents/{id}/officer-role
EditPengurus    → PATCH /residents/{id}/officer-role

LihatUMKM      → GET    /businesses
TambahUMKM     → POST   /businesses
DetailUMKM     → GET    /businesses/{id}
EditUMKM       → PATCH  /businesses/{id}
UMKMSaya       → GET    /businesses/me
ValidasiUMKM   → PATCH  /businesses/{id}/status

KelolaIuran    → GET    /dues
TambahIuran    → POST   /dues
EditIuran      → GET    /dues/{id}
               → PATCH  /dues/{id}
               → PATCH  /dues/{id}/status

PembayaranIuran → GET   /dues/bills
               → POST   /dues/payments
VerifPembayaran → GET   /dues/payments
DetailVerif     → GET   /dues/payments/{id}
               → PATCH  /dues/payments/{id}/status

Pengumuman     → GET    /announcements
TambahPengumuman → POST /announcements
EditPengumuman  → PATCH /announcements/{id}

BuatLaporan    → POST   /issues
MonitoringLaporan → GET /issues (ketua) / GET /issues/me (warga)
DetailLaporan  → GET    /issues/{id}
ValidasiLaporan → PATCH /issues/{id}/status
TindakLanjut   → PATCH  /issues/{id}/follow-up

KelolaKas      → GET    /finance/expenses
TambahlKas     → POST   /finance/expenses
EditKas        → PATCH  /finance/expenses/{id}

Profil         → GET    /profile/me
               → PATCH  /profile/me
```

---

## 6. Rekomendasi

1. **Gunakan Axios** + buat interceptor untuk transform snake_case ↔ camelCase otomatis agar frontend tetap konsisten pakai camelCase.
2. **Konfigurasi Vite proxy** di `vite.config.js` untuk menghindari CORS:
   ```js
   server: {
     proxy: { '/api': 'http://localhost:5000' }
   }
   ```
3. **Buat enum mapping** antara value OpenAPI dan frontend untuk status-status yang berbeda.
4. **Implementasi bertahap**: Mulai dari auth, lalu dashboard, lalu fitur per fitur sesuai modul.
5. **Tambahkan endpoint yang hilang** di backend: `DELETE` untuk pengurus/pengumuman/pengeluaran, endpoint laporan keuangan, dan export PDF.
6. **Update openapi.json** jika ada perubahan endpoint selama pengembangan agar kontrak API tetap sinkron.

---

*Dokumen ini disusun berdasarkan hasil inspeksi kode pada `PROGRAM/smart/openapi.json` dan `PROGRAM/smart/apps/web/src/`.*
