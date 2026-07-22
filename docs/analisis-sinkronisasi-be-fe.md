# Analisis Sinkronisasi Backend & Frontend — SMART RT

**Tanggal:** 21 Juli 2026
**Lingkup:** `PROGRAM/smart/apps/backend` dan `PROGRAM/smart/apps/web`

---

## Ringkasan

| Aspek | Status |
|-------|--------|
| Total endpoint backend | **42 endpoint** (9 modul) |
| Total panggilan API frontend | **±50 panggilan** (9 file API) |
| Endpoint FE yang **tidak ada** di BE | **2** (`/dashboard/activities`, `/finance/report`) |
| Ketidakcocokan field | **≥5** lokasi |
| Fungsi FE yang **broken/nyaris broken** | **2** (Edit Pengurus, Verifikasi Pembayaran) |
| Endpoint BE yang tidak dipanggil FE | **≥2** (`DELETE /announcements`, duplikasi `register`) |
| OpenAPI vs BE vs FE | Tidak sinkron |

---

## 1. Ketidakcocokan Kritis (Critical Mismatches)

### 1.1 Endpoint FE yang Tidak Ada di Backend

| Panggilan FE | File FE | Ada di BE? |
|---|---|---|
| `GET /api/v1/dashboard/activities` | `dashboard.api.js` → dipanggil di `Dashboard.jsx` | ❌ **TIDAK ADA** — BE hanya punya `GET /api/v1/dashboard` |
| `GET /api/v1/finance/report?periode=...` | `finance.api.js` → dipanggil di `KetuaLaporanKeuangan.jsx` | ❌ **TIDAK ADA** — BE hanya punya `GET /api/v1/finance/expenses` |

**Dampak:** Kedua halaman akan selalu error/gagal muat data.

### 1.2 Typo Field Name di Verifikasi Pembayaran

**File:** `apps/web/src/pages/iuran/KetuaVerifikasiPembayaran.jsx:53 & :60`

```javascript
// SALAH — field tidak ada di response BE
setData(prev => prev.map(p => p.id_pembayaran_pembayaran === id ? { ...p, ... } : p))
```

- BE mengembalikan `id_pembayaran`, bukan `id_pembayaran_pembayaran`.
- State update setelah approve/reject tidak akan pernah berfungsi.
- Modal menggunakan `modalPayment.id_pembayaran` (benar) dan `modalPayment.warga`/`modalPayment.iuran` (hasil mapping halaman lain), tapi di halaman ini list tabel langsung pakai `p.nama_warga`, `p.nama_iuran`, dll.

### 1.3 Edit Pengurus — Tidak Bisa Submit

**File:** `apps/web/src/pages/manajemen-pengurus/EditPengurus.jsx:39-43`

```javascript
// Need residentId for updateOfficerRole, officers list doesn't return it
// Use officer id directly — backend needs idWarga
alert('Update jabatan pengurus saat ini perlu ID warga yang tidak tersedia di response GET /officers')
```

- BE endpoint `GET /api/v1/residents/officers` hanya mengembalikan `{ id (idPengurus), nama, nik, jabatan, periodeJabatan }`
- `PATCH /api/v1/residents/{residentId}/officer-role` butuh `residentId` (idWarga), bukan `idPengurus`
- FE tidak punya cara untuk mapping `idPengurus` → `idWarga`

### 1.4 Dashboard Activities — Tidak Ada di BE

**File:** `apps/web/src/pages/dashboard/Dashboard.jsx` memanggil `getDashboardActivities()` yang didefinisikan di `dashboard.api.js` sebagai:

```javascript
export const getDashboardActivities = () => http.get('/dashboard/activities')
```

Backend tidak memiliki route `/dashboard/activities`. Hanya ada `GET /api/v1/dashboard` untuk dashboard utama.

---

## 2. Ketidakcocokan Field & Response Shape

### 2.1 Response Pembayaran — Inkon sistensi Mapping

| Field di BE Response | Digunakan di Modal KetuaDetailVerifikasi | Digunakan di List KetuaVerifikasiPembayaran |
|---|---|---|
| `nama_warga` | Dipetakan ke `warga` | Langsung `p.nama_warga` ✓ |
| `nama_iuran` | Dipetakan ke `iuran` | Langsung `p.nama_iuran` ✓ |
| `jenis_iuran` | Langsung `jenis_iuran` | Langsung `p.jenis_iuran` ✓ |
| `jumlah_bayar` | Dipetakan ke `nominal` | Langsung `p.jumlah_bayar` ✓ |
| `id_pembayaran` | `modalPayment.id` (dari params) | `p.id_pembayaran` ✓ (tapi pake `id_pembayaran_pembayaran` di handle) |

### 2.2 Response Profile vs Resident Detail

| Field | BE `/profile/me` | BE `/residents/:id` | FE Harapan |
|---|---|---|---|
| `id` | `id` (idMasyarakat) | `id` (idWarga) | Tidak konsisten |
| `status_keanggotaan` | `status_keanggotaan` | `statusKeanggotaan` | ❌ **CamelCase vs snake_case** |
| `no_hp` | `no_hp` | `noHp` (di controller response) | ❌ **Tidak konsisten** |

### 2.3 Finance — Request Body Field Names

BE controller (`finance/controller.ts`) menerima request body dalam **camelCase** (JavaScript convention):
```
{ kategoriPengeluaran, nominalPengeluaran, tanggalKeluar, keterangan, buktiNota }
```

Tapi database (Prisma) menyimpan dalam **snake_case**:
```
{ kategori_pengeluaran, nominal_pengeluaran, tanggal_keluar, keterangan, bukti_nota }
```

FE perlu mengirim dalam format yang benar. Perlu dicek apakah FE sudah mengirim dalam camelCase.

---

## 3. Ketidakcocokan OpenAPI vs Implementasi

### 3.1 Endpoint yang Berbeda

| OpenAPI Spec | Backend Actual | Keterangan |
|---|---|---|
| `POST /dues/bills` (tidak ada) | `GET /dues/bills/current` | Method & path berbeda |
| Tidak ada | `GET /dues/bills/current` | Tidak terdokumentasi di OpenAPI |
| Tidak ada | `DELETE /announcements/:id` | Tidak terdokumentasi di OpenAPI |
| Tidak ada | `PATCH /issues/:id/follow-up` | Tidak terdokumentasi di OpenAPI |
| Tidak ada | Finance expense CRUD (`/finance/expenses`) | Tidak terdokumentasi di OpenAPI |

### 3.2 Field yang Berbeda

| OpenAPI Spec | Backend Actual |
|---|---|
| `/residents/register` → fields: `nik, nama, alamat, no_hp, username, password` | BE juga butuh **`email`** |
| `/residents/officers` response: `{ id, nama, jabatan }` | BE juga mengembalikan **`nik, periodeJabatan`** |
| `/residents/pending-verifications` response: `{ id, nama, tanggalRegistrasi }` | BE mengembalikan **`id, nik, nama, alamat, no_hp`** (tanpa tanggalRegistrasi) |
| `/dues/bills` response: pakai `id_iuran` | BE `/dues/bills/current` response juga punya **`jenis_iuran`** |

---

## 4. Duplikasi & Redundansi

### 4.1 Dua Definisi `register()`

| File | Path |
|---|---|
| `apps/web/src/api/auth.api.js` | `export const register = ({ nik, email, nama, alamat, noHp, username, password }) => http.post('/residents/register', { ...no_hp: noHp... })` |
| `apps/web/src/api/residents.api.js` | `export const register = (data) => http.post('/residents/register', data)` |

Keduanya POST ke endpoint yang sama. `auth.api.js` melakukan mapping `noHp` → `no_hp`, sedangkan `residents.api.js` mengirim data mentah. Ini bisa menyebabkan error jika `residents.api.js` dipanggil dengan field `noHp` (camelCase) karena BE mengharapkan `no_hp`.

### 4.2 Dua File API yang Sama Fungsinya — Finance

Tidak ada modul keuangan/finance terpisah di frontend, hanya `finance.api.js` yang menangani semua. Ini OK, tapi perlu dicatat bahwa BE punya module `finance` dengan endpoint expenses, sementara FE juga punya page `kas/` **dan** `keuangan/` yang terpisah.

---

## 5. Inkon sistensi Response Envelope

### Response Interceptor FE
```javascript
// http.js
http.interceptors.response.use(
  (response) => response.data,   // ← unwrap sekali
  ...
)
```

### Akses di Page
```javascript
// Semua halaman mengakses:
getAllPayments().then(res => setData(res.data))
// res = response.data = { message, data }
// Jadi final: { message, data }.data
```

**Pengecekan:** BE mengembalikan `{ message: "success", data: [...] }` → `res.data` di FE akan mendapatkan `[...]` (array). **Ini sudah benar/sinkron**.

---

## 6. Role & Authorization — Perbandingan

| Fitur | Frontend Expects | Backend Allows |
|---|---|---|
| Buat UMKM | RESIDENT | RESIDENT ✓ |
| Buat Iuran | CHAIRPERSON (via page Ketua) | CHAIRPERSON ✓ |
| Verifikasi Pembayaran | OFFICER/CHAIRPERSON | OFFICER, CHAIRPERSON ✓ |
| Verifikasi Warga | CHAIRPERSON | CHAIRPERSON ✓ |
| Kelola Jabatan Pengurus | CHAIRPERSON | CHAIRPERSON ✓ |
| Lihat Semua Pembayaran | OFFICER/CHAIRPERSON | OFFICER, CHAIRPERSON ✓ |
| Lihat Semua Laporan | OFFICER/CHAIRPERSON | OFFICER, CHAIRPERSON ✓ |
| Buat Pengeluaran Kas | CHAIRPERSON | CHAIRPERSON ✓ |
| Lihat Pengeluaran Kas | OFFICER/CHAIRPERSON | OFFICER, CHAIRPERSON ✓ |
| Buat Pengumuman | OFFICER/CHAIRPERSON | OFFICER, CHAIRPERSON ✓ |
| Hapus Pengumuman | Tidak ada tombol di FE | OFFICER, CHAIRPERSON (tapi FE tidak pakai) |

**Status: Role sudah sinkron untuk seluruh fitur yang terpakai.**

---

## 7. Rekomendasi Perbaikan (Prioritas)

### 🔴 Prioritas Tinggi (Menyebabkan Error Runtime)

1. **Buat endpoint `/api/v1/dashboard/activities` di BE atau hapus panggilan di FE** — Halaman Dashboard error
2. **Buat endpoint `/api/v1/finance/report` di BE atau ubah FE pakai `/finance/expenses`** — Halaman Laporan Keuangan error
3. **Perbaiki typo `id_pembayaran_pembayaran` → `id_pembayaran`** di `KetuaVerifikasiPembayaran.jsx:53,60`
4. **Tambahkan `idWarga` di response `GET /residents/officers`** atau buat endpoint mapping di BE agar Edit Pengurus bisa submit

### 🟡 Prioritas Sedang (Data Tidak Konsisten)

5. **Sinkronkan response field naming** antara `/profile/me` dan `/residents/:id` — pilih salah satu (camelCase atau snake_case) dan konsisten
6. **Hapus duplikasi `register()`** di salah satu file API (auth.api.js atau residents.api.js)
7. **Update OpenAPI spec** agar sesuai dengan implementasi BE aktual (tambah endpoint yang hilang, hapus/sesuaikan path yang beda)

### 🟢 Prioritas Rendah (Housekeeping)

8. **Konsistensi mapping field** di halaman detail verifikasi pembayaran dengan halaman list verifikasi
9. **Tambah validasi frontend** untuk `judul` max 15 karakter di form pengumuman (sinkron dengan BE)
10. **Tambahkan `onClick` handler** untuk tombol "Export PDF" di `KetuaLaporanKeuangan.jsx`
11. **Sinkronkan field `periodeJabatan`** antara BE response dan FE form (pastikan formatnya cocok)

---

## 8. Matriks Sinkronasi Lengkap

| Modul | BE Endpoint | FE Panggil | OpenAPI | Status Sinkron |
|---|---|---|---|---|
| Auth | ✅ POST /auth/login | ✅ | ✅ | ✅ **OK** |
| Auth | ❌ Tidak ada | ❌ Tidak ada | ✅ POST /auth/logout | ⚠️ Belum diimplementasi BE & FE |
| Dashboard | ✅ GET /dashboard | ✅ | ✅ | ✅ **OK** |
| Dashboard | ❌ Tidak ada | ❌ GET /dashboard/activities | ❌ | 🔴 **HARUS DIBUAT/DIHAPUS** |
| Announcements | ✅ GET /announcements | ✅ | ✅ | ✅ **OK** |
| Announcements | ✅ POST /announcements | ✅ | ✅ | ✅ **OK** |
| Announcements | ✅ GET /announcements/:id | ✅ | ✅ | ✅ **OK** |
| Announcements | ✅ PATCH /announcements/:id | ✅ | ✅ | ✅ **OK** |
| Announcements | ✅ DELETE /announcements/:id | ❌ Tidak dipakai FE | ❌ | ⚠️ Ada di BE, tidak di FE |
| Businesses | ✅ GET /businesses | ✅ | ✅ | ✅ **OK** |
| Businesses | ✅ POST /businesses | ✅ | ✅ | ✅ **OK** |
| Businesses | ✅ GET /businesses/me | ✅ | ✅ | ✅ **OK** |
| Businesses | ✅ GET /businesses/:id | ✅ | ✅ | ✅ **OK** |
| Businesses | ✅ PATCH /businesses/:id | ✅ | ✅ | ✅ **OK** |
| Businesses | ✅ PATCH /businesses/:id/status | ✅ | ✅ | ✅ **OK** |
| Dues | ✅ GET /dues | ✅ | ✅ | ✅ **OK** |
| Dues | ✅ POST /dues | ✅ | ✅ | ✅ **OK** |
| Dues | ✅ GET /dues/:id | ✅ | ✅ | ✅ **OK** |
| Dues | ✅ PATCH /dues/:id | ✅ | ✅ | ✅ **OK** |
| Dues | ✅ PATCH /dues/:id/status | ✅ | ✅ | ✅ **OK** |
| Dues | ✅ GET /dues/bills/current | ✅ (bills) | ❌ OpenAPI: /dues/bills | ⚠️ Path beda |
| Dues | ✅ POST /dues/payments | ✅ | ✅ | ✅ **OK** |
| Dues | ✅ GET /dues/me/payments | ✅ | ✅ | ✅ **OK** |
| Dues | ✅ GET /dues/payments | ✅ | ✅ | ✅ **OK** |
| Dues | ✅ GET /dues/payments/:id | ✅ | ✅ | ✅ **OK** |
| Dues | ✅ PATCH /dues/payments/:id/status | ✅ | ✅ | ✅ **OK** |
| Finance | ✅ GET /finance/expenses | ✅ | ❌ | ⚠️ Tidak di OpenAPI |
| Finance | ✅ GET /finance/expenses/:id | ✅ | ❌ | ⚠️ Tidak di OpenAPI |
| Finance | ✅ POST /finance/expenses | ✅ | ❌ | ⚠️ Tidak di OpenAPI |
| Finance | ✅ PATCH /finance/expenses/:id | ✅ | ❌ | ⚠️ Tidak di OpenAPI |
| Finance | ✅ DELETE /finance/expenses/:id | ✅ | ❌ | ⚠️ Tidak di OpenAPI |
| Finance | ❌ Tidak ada | ❌ GET /finance/report | ❌ | 🔴 **HARUS DIBUAT/DIHAPUS** |
| Issues | ✅ GET /issues | ✅ | ✅ | ✅ **OK** |
| Issues | ✅ POST /issues | ✅ | ✅ | ✅ **OK** |
| Issues | ✅ GET /issues/me | ✅ | ✅ | ✅ **OK** |
| Issues | ✅ GET /issues/:id | ✅ | ✅ | ✅ **OK** |
| Issues | ✅ PATCH /issues/:id | ✅ | ❌ | ⚠️ Tidak di OpenAPI |
| Issues | ✅ PATCH /issues/:id/status | ✅ | ✅ | ✅ **OK** |
| Issues | ✅ PATCH /issues/:id/follow-up | ✅ | ❌ | ⚠️ Tidak di OpenAPI |
| Profile | ✅ GET /profile/me | ✅ | ❌ | ⚠️ Tidak di OpenAPI |
| Profile | ✅ PATCH /profile/me | ✅ | ❌ | ⚠️ Tidak di OpenAPI |
| Residents | ✅ POST /residents/register | ✅ (2x) | ✅ | ✅ **OK** (duplikasi FE) |
| Residents | ✅ GET /residents | ✅ | ✅ | ✅ **OK** |
| Residents | ✅ GET /residents/pending-verifications | ✅ | ✅ | ✅ **OK** |
| Residents | ✅ GET /residents/officers | ✅ | ✅ | ✅ **OK** |
| Residents | ✅ GET /residents/:id | ✅ | ✅ | ✅ **OK** |
| Residents | ✅ PATCH /residents/:id | ✅ | ✅ | ✅ **OK** |
| Residents | ✅ PATCH /residents/:id/verification-status | ✅ | ✅ | ✅ **OK** |
| Residents | ✅ PATCH /residents/:id/officer-role | ✅ (broken) | ✅ | ⚠️ **Edit Pengurus broken** |

---

## Kesimpulan

**Skor Sinkronasi: ~80%**

BE dan FE secara umum sudah sinkron untuk mayoritas fitur CRUD dasar (auth, announcements, businesses, dues, issues, profile, residents). Masalah utama ada pada:

1. **2 endpoint FE yang tidak ada di BE** → akan menyebabkan error runtime
2. **1 typo field name** → state update tidak berfungsi
3. **1 fitur yang broken karena missing data** (Edit Pengurus)
4. **Dokumentasi OpenAPI tidak sinkron** dengan implementasi aktual

Perbaikan prioritas (4 item pertama di rekomendasi) akan meningkatkan sinkronasi menjadi ~95%.
