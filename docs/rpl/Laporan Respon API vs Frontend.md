# Laporan Kesesuaian Respon API dengan Tampilan Frontend

**Proyek:** SMART - Sistem Manajemen RT
**Tanggal:** 19 Juli 2026
**Tujuan:** Memeriksa apakah struktur respon dari `openapi.json` sudah sesuai dengan data yang ingin ditampilkan oleh frontend (`apps/web`).

---

## Ringkasan Eksekutif

Dari 45 endpoint yang didefinisikan di `openapi.json`, tidak ada satu pun yang terintegrasi dengan frontend. Namun demikian, dengan membandingkan **skema respon API** vs **struktur data yang digunakan di halaman frontend**, ditemukan banyak **ketidaksesuaian field, format, dan enum value** yang perlu diselaraskan sebelum integrasi dilakukan. Selain itu, terdapat **beberapa fitur frontend yang tidak memiliki endpoint API** dan **beberapa endpoint API yang tidak memiliki halaman frontend**.

---

## 1. Analisis Per-Entity

### 1.1 AUTH — Login & Logout

| Aspek | OpenAPI Response | Frontend (AuthContext + Login) | Status |
|-------|------------------|-------------------------------|--------|
| **Login** `POST /auth/login` | `{ message, data: { accessToken, user: { id, nama, role } } }` | `mockLogin` returns `{ user: { username, name, role, initials, password }, token }` | ❌ **Tidak sesuai** |
| **Field role** | `RESIDENT`, `OFFICER`, `CHAIRPERSON` | `warga`, `pengurus`, `ketua` | ❌ Enum berbeda |
| **Field nama** | `nama` (string) | `name` (string) | ❌ Nama field beda |
| **Field id** | `id` (string, UUID) | Tidak digunakan di frontend | ⚠️ Tidak kritis |
| **Field initials** | Tidak ada | `initials` digunakan di avatar | ❌ **MISSING** |
| **Logout** `POST /auth/logout` | `{ message }` | Hanya set user ke `null` | ⚠️ Perlu sesuaikan |

**Kesimpulan:** Response API perlu ditambahkan `initials`, atau frontend perlu generate initials dari `nama`. Role mapping perlu dilakukan (`RESIDENT→warga`, `OFFICER→pengurus`, `CHAIRPERSON→ketua`).

---

### 1.2 DASHBOARD `GET /dashboard`

| Aspek | OpenAPI Response | Frontend (Dashboard.jsx) | Status |
|-------|------------------|--------------------------|--------|
| **Warga** | `{ profil: { nama, statusKeanggotaan }, jumlahUMKM, jumlahTagihanBelumDibayar, jumlahLaporanSaya, pengumumanTerbaru }` | `stats: [{ number, label, meta, icon, accent }]`, bento sections dengan `rows: [{ label, badge, badgeVariant }]`, announcement list, activity list | ❌ **Struktur完全不同** |
| **Pengurus** | `{ totalWarga, totalUMKM, totalLaporanKendala, pengumumanAktif, totalPengeluaranKas }` | `stats: [{ number, label, meta, icon }]`, tasks, announcements, activities | ❌ **Struktur berbeda** |
| **Ketua** | `{ totalWarga, wargaMenungguVerifikasi, totalIuranAktif, totalUMKM, totalLaporanKendala, pengumumanAktif, totalPengeluaranKas }` | `stats: [{ number, label, meta, icon, accent }]`, `wargaStats`, tasks, announcements, activities | ❌ **Struktur berbeda** |

**Detail ketidaksesuaian frontend (data yang ditampilkan tapi tidak ada di API):**
- **WargaSection:**
  - Bento status iuran → butuh data tagihan per warga (`GET /dues/bills` + aggregation)
  - Bento status UMKM saya → butuh data UMKM per user (`GET /businesses/me`)
  - Daftar pengumuman → butuh data dari `GET /announcements`
  - Daftar aktivitas terbaru → **tidak ada endpoint khusus**

- **PengurusSection:**
  - TaskGrid (validasi UMKM, verifikasi pembayaran, validasi laporan, tindak lanjut) → butuh count dari masing-masing entity (pending count)
  - ActivitySection → **tidak ada endpoint**

- **KetuaSection:**
  - TaskGrid (verifikasi warga, kelola pengurus, kelola iuran, laporan keuangan)
  - ActivitySection → **tidak ada endpoint**

**Kesimpulan:** Struktur response dashboard di OpenAPI **terlalu sederhana** dan tidak mencakup data kompleks yang ditampilkan frontend (seperti bento grid, task grid, activity list, dll). Perlu **restrukturasi endpoint dashboard** atau frontend perlu melakukan **multiple API calls** untuk mengumpulkan semua data.

**Rekomendasi struktur baru untuk endpoint dashboard:**

```json
// GET /dashboard — response per role
// Warga:
{
  "stats": {
    "jumlahUMKMSaya": 2,
    "jumlahTagihanBelumDibayar": 1,
    "jumlahLaporanSaya": 3
  },
  "iuranStatus": [
    { "namaIuran": "Iuran RT", "periode": "Juli 2026", "status": "LUNAS" }
  ],
  "umkmSaya": [
    { "namaUsaha": "Warung Makan Budi", "statusVerifikasi": "VERIFIED" }
  ],
  "pengumumanTerbaru": [
    { "id": "uuid", "judul": "Kerja Bakti", "tanggal": "2026-07-14", "excerpt": "...", "statusPublikasi": "PUBLISHED" }
  ],
  "aktivitasTerbaru": [
    { "tipe": "LAPORAN", "judul": "Lampu Jalan Mati", "status": "COMPLETED", "meta": "..." }
  ]
}

// Pengurus / Ketua:
{
  "stats": {
    "totalWarga": 47,
    "totalUMKM": 6,
    "totalLaporanKendala": 5,
    "totalPengeluaranKas": 6500000,
    "pengumumanAktif": 3
  },
  "pendingCounts": {
    "umkmMenunggu": 2,
    "pembayaranMenunggu": 2,
    "laporanMenungguValidasi": 2,
    "laporanMenungguTindakLanjut": 1,
    "wargaMenungguVerifikasi": 3
  },
  "pengumumanTerbaru": [...],
  "aktivitasTerbaru": [...]
}
```

---

### 1.3 RESIDENTS — Warga

| Aspek | OpenAPI Response | Frontend (DataWarga) | Status |
|-------|------------------|----------------------|--------|
| **Daftar** `GET /residents` | Array: `{ id, nik, nama, statusKeanggotaan }` | Array: `{ id, nik, nama, alamat, noHp, tglDaftar, status }` | ❌ **Tidak sesuai** |
| **Field alamat** | Ada di `GET /residents/{id}` saja | Ditampilkan di tabel daftar | ❌ **MISSING** |
| **Field noHp** | `noHp` di `GET /residents/{id}` | Ditampilkan di tabel daftar | ❌ **MISSING** |
| **Field tglDaftar** | Tidak ada di API manapun | `tglDaftar` ditampilkan | ❌ **MISSING** |
| **Field statusKeanggotaan** | `string` | `status: "aktif" | "nonaktif"` | ⚠️ Enum berbeda |
| **Search params** | `?search=&status=` | `?search=&status=` | ✅ Sesuai |

**Kesimpulan:** Endpoint `GET /residents` perlu ditambahkan field `alamat`, `noHp`, `tanggalDaftar`. Atau frontend perlu memanggil `GET /residents/{id}` per warga (tidak efisien).

---

### 1.4 RESIDENTS — Verifikasi Warga

| Aspek | OpenAPI Response | Frontend (VerifikasiWarga) | Status |
|-------|------------------|---------------------------|--------|
| **Pending** `GET /residents/pending-verifications` | `{ id, nama, tanggalRegistrasi }` | Butuh: `{ id, nik, nama, alamat, noHp, tglDaftar, status }` | ❌ **Tidak sesuai** |
| **Verifikasi** `PATCH /residents/{id}/verification-status` | Body: `{ status: "AKTIF" | "DITOLAK" }` | Frontend pakai `"terverifikasi" | "ditolak"` | ⚠️ Enum berbeda |

**Kesimpulan:** Endpoint pending verifikasi perlu return lebih banyak field (nik, alamat, noHp). Mapping status: `AKTIF→terverifikasi`, `DITOLAK→ditolak`.

---

### 1.5 RESIDENTS — Pengurus

| Aspek | OpenAPI Response | Frontend (KelolaPengurus) | Status |
|-------|------------------|--------------------------|--------|
| **Daftar** `GET /residents/officers` | `{ id, nama, jabatan }` | `{ id, nik, nama, jabatan }` | ⚠️ NIK tidak ada di API |
| **Tambah/Edit** `PATCH /residents/{id}/officer-role` | Body: `{ jabatan, periodeJabatan }` | Butuh mapping: `value → jabatan`, `periodeInput → periodeJabatan` | ⚠️ Perlu adjust |
| **Hapus Pengurus** | ❌ Tidak ada endpoint | Ada tombol hapus di KelolaPengurus | ❌ **MISSING** |

**Kesimpulan:** Tambahkan field `nik` di response, tambah endpoint `DELETE /residents/{id}/officer-role` atau gunakan `PATCH` dengan `jabatan: null`.

---

### 1.6 BUSINESSES — UMKM

| Aspek | OpenAPI Response | Frontend (semua halaman UMKM) | Status |
|-------|------------------|-------------------------------|--------|
| **Daftar** `GET /businesses` | `{ id, nama_usaha, jenis_usaha, alamat_usaha, status_verifikasi }` | Butuh: `{ id, namaUsaha, pemilik, jenis, tanggal, status }` | ⚠️ Field `pemilik` tidak ada |
| **Detail** `GET /businesses/{id}` | Plus: `{ deskripsi_usaha, kontak_usaha, foto_usaha }` | Butuh semua + `pemilik, nik, noRegistrasi` | ❌ Field `nik`, `noRegistrasi` tidak ada |
| **Tambah** `POST /businesses` | Body: `{ nama_usaha, jenis_usaha, deskripsi_usaha, alamat_usaha, kontak_usaha, foto_usaha }` | Form tambah pakai `pemilik` juga | ⚠️ Tambah field `pemilik` |
| **UMKM Saya** `GET /businesses/me` | `{ id, nama_usaha, status_verifikasi }` | Butuh: daftar UMKM milik user + status | ✅ Bisa dipakai |
| **Validasi** `PATCH /businesses/{id}/status` | Body: `{ status: "VERIFIED" | "REJECTED" }` | Frontend pakai: `verified | pending | rejected` | ⚠️ Enum berbeda |

**Kesimpulan:** Perlu tambah field `pemilik`, `nik`, `noRegistrasi` di API. Status mapping: `VERIFIED→verified/terverifikasi`, `REJECTED→rejected/ditolak`, `PENDING→pending/menunggu`.

---

### 1.7 DUES — Iuran (Master)

| Aspek | OpenAPI Response | Frontend (KelolaIuran) | Status |
|-------|------------------|----------------------|--------|
| **Daftar** `GET /dues` | `{ id, nama_iuran, nominal, tanggal_jatuh_tempo, status_aktif }` | `{ id, nama, jenis, nominal, jatuhTempo, status }` | ⚠️ Field `jenis` tidak ada di API |
| **Tambah** `POST /dues` | Body: `{ nama_iuran, nominal, tanggal_jatuh_tempo }` | Form tambah juga punya `jenisIuran` | ❌ **MISSING** |
| **Status** `PATCH /dues/{id}/status` | `{ status: "ACTIVE" | "INACTIVE" }` | Frontend pakai: `"active" | "inactive"` | ⚠️ Enum beda kapital |

**Kesimpulan:** Tambahkan field `jenis_iuran` di semua endpoint dues master.

---

### 1.8 DUES — Pembayaran

| Aspek | OpenAPI Response | Frontend (VerifikasiPembayaran, DetailVerifikasi) | Status |
|-------|------------------|---------------------------------------------------|--------|
| **Tagihan Saya** `GET /dues/bills` | `{ id_iuran, nama_iuran, periode, nominal, status }` | Butuh display per tagihan + bisa pilih | ✅ Bisa dipakai |
| **Kirim** `POST /dues/payments` | Body: `{ id_iuran, periode, metode_bayar, jumlah_bayar, bukti_pembayaran }` | Form: pilih tagihan, metode, upload bukti | ⚠️ `jumlah_bayar` mungkin auto, perlu adjust |
| **Daftar Bayar** `GET /dues/payments` | `{ id_pembayaran, nama_warga, nama_iuran, periode, jumlah_bayar, status_verifikasi }` | Butuh juga: `metode_bayar, tanggal_bayar` | ❌ **MISSING** field |
| **Detail** `GET /dues/payments/{id}` | Plus: `{ tanggal_bayar, metode_bayar, bukti_pembayaran }` | Butuh semua + `noTransaksi` | ❌ Field `noTransaksi` tidak ada |
| **Verifikasi** `PATCH /dues/payments/{id}/status` | `{ status: "VERIFIED" | "REJECTED" }` | Frontend pakai: `terverifikasi | ditolak` | ⚠️ Enum berbeda |
| **Riwayat Saya** `GET /dues/me/payments` | `{ id_iuran, nama_iuran, periode, tanggal_bayar, jumlah_bayar, status_verifikasi }` | Belum ada halaman, tapi data bisa dipakai | ✅ |

**Status mapping payment:** `BELUM_DIBAYAR→belum`, `PENDING→menunggu`, `VERIFIED→terverifikasi`, `REJECTED→ditolak`

---

### 1.9 ANNOUNCEMENTS — Pengumuman

| Aspek | OpenAPI Response | Frontend (Pengumuman + Kelola) | Status |
|-------|------------------|-------------------------------|--------|
| **Daftar** `GET /announcements` | `{ id, judul, tanggal_pengumuman, status_publikasi }` | Warga butuh: `{ id, judul, isi, tanggal, status, author, lampiran }` ❌ | ❌ Field `isi`, `author`, `lampiran` tidak ada |
| **Detail** `GET /announcements/{id}` | Plus: `{ isi_pengumuman, lampiran }` | Butuh juga `author` | ❌ Field `author` |
| **Tambah** `POST /announcements` | Body: `{ judul, isi_pengumuman, lampiran, status_publikasi }` | Form: judul, isi, lampiran, status | ✅ Sesuai (dengan snake_case) |
| **Hapus** | ❌ Tidak ada endpoint | Ada tombol hapus di KelolaPengumuman | ❌ **MISSING** |

**Kesimpulan:** Tambahkan field `author` di response get announcements. Tambah endpoint `DELETE /announcements/{id}`.

---

### 1.10 ISSUES — Laporan Kendala

| Aspek | OpenAPI Response | Frontend (semua halaman laporan) | Status |
|-------|------------------|----------------------------------|--------|
| **Daftar** `GET /issues` | `{ id, nama_warga, kategori_kendala, status_laporan }` | Butuh: `{ id, kategori, pelapor, deskripsi, tanggal, status, foto, tanggapan }` | ❌ **Banyak field tidak ada** |
| **Laporan Saya** `GET /issues/me` | `{ id, kategori_kendala, status_laporan }` | Butuh: `{ id, kategori, deskripsi, tanggal, status, foto, tanggapan }` | ❌ **Banyak field tidak ada** |
| **Detail** `GET /issues/{id}` | Plus: `{ deskripsi, foto_kendala, tanggal_lapor, tanggapan }` | Plus butuh: `{ noLaporan, pelapor, riwayatStatus[] }` | ❌ Field `noLaporan`, `riwayatStatus` tidak ada |
| **Tambah** `POST /issues` | Body: `{ kategori_kendala, deskripsi, foto_kendala }` | Form: kategori, deskripsi, foto | ✅ Sesuai |
| **Validasi** `PATCH /issues/{id}/status` | `{ status: "PENDING" | "IN_PROGRESS" | "COMPLETED" }` | Frontend: `menunggu | diverifikasi | proses | selesai | ditolak` | ❌ **Enum tidak match** |
| **Tindak Lanjut** `PATCH /issues/{id}/follow-up` | Body: `{ tanggapan }` | Input tanggapan + ubah status | ⚠️ Perlu gabung dua endpoint |

**Status mapping issues:** `PENDING→menunggu/diverifikasi`, `IN_PROGRESS→proses`, `COMPLETED→selesai`. Frontend juga punya `ditolak` yang tidak ada enum di API.

**Kesimpulan:** Perlu tambah field `noLaporan` (auto-generate), `pelapor/namaWarga`, `riwayatStatus` di detail. Status enum perlu ditambah `REJECTED` untuk validasi ditolak.

---

### 1.11 FINANCE — Pengeluaran Kas

| Aspek | OpenAPI Response | Frontend (KelolaPengeluaranKas) | Status |
|-------|------------------|--------------------------------|--------|
| **Daftar** `GET /finance/expenses` | `{ id, kategori_pengeluaran, nominal_pengeluaran, tanggal_keluar }` | Butuh: `{ id, kategori, nominal, tanggal, keterangan, bukti }` | ❌ Field `keterangan`, `bukti_nota` tidak ada di daftar API |
| **Detail** `GET /finance/expenses/{id}` | Plus: `{ keterangan, bukti_nota }` | Butuh semua + `bukti` | ✅ Bisa dipakai |
| **Tambah** `POST /finance/expenses` | Body: `{ kategori_pengeluaran, nominal_pengeluaran, tanggal_keluar, keterangan, bukti_nota }` | Form: kategori, nominal, tanggal, keterangan, bukti | ✅ Sesuai |
| **Hapus** | ❌ Tidak ada endpoint | Ada tombol hapus | ❌ **MISSING** |

**Kesimpulan:** Tambah field `keterangan` dan `bukti_nota` di response `GET /finance/expenses`. Tambah endpoint `DELETE /finance/expenses/{id}`.

---

### 1.12 PROFILE

| Aspek | OpenAPI Response | Frontend | Status |
|-------|------------------|----------|--------|
| **Lihat** `GET /profile/me` | `{ id, nik, nama, alamat, no_hp, username, role, status_keanggotaan }` | Tidak ada halaman profil | ❌ **Belum ada halaman** |
| **Edit** `PATCH /profile/me` | Body: `{ nama, alamat, no_hp }` | Tidak ada halaman profil | ❌ **Belum ada halaman** |

---

### 1.13 LAPORAN KEUANGAN (tidak ada endpoint khusus)

| Aspek | Frontend (LaporanKeuangan) | Status |
|-------|---------------------------|--------|
| **Data ditampilkan** | Total pemasukan, total pengeluaran, saldo akhir, jumlah transaksi, tabel pemasukan (dari pembayaran iuran), tabel pengeluaran (dari kas) | ❌ **Tidak ada endpoint API** |

**Kesimpulan:** Perlu endpoint agregasi `GET /finance/report?periode=...` atau frontend lakukan multiple calls ke `GET /dues/payments` + `GET /finance/expenses` lalu di-aggregate client-side.

---

## 2. Endpoint yang Tidak Sesuai (Need Restructuring)

| Endpoint | Masalah |
|----------|---------|
| `GET /dashboard` | Response terlalu sederhana, tidak mencakup bento grid, task grid, aktivitas, pengumuman |
| `GET /residents` | Kurang field `alamat`, `noHp`, `tanggalDaftar` |
| `GET /residents/pending-verifications` | Kurang field `nik`, `alamat`, `noHp` |
| `GET /residents/officers` | Kurang field `nik` |
| `GET /businesses` | Kurang field `pemilik` (nama pemilik) |
| `GET /businesses/{id}` | Kurang field `pemilik`, `nik`, `noRegistrasi` |
| `GET /dues` | Kurang field `jenisIuran` |
| `GET /dues/payments` | Kurang field `metodeBayar`, `tanggalBayar` |
| `GET /dues/payments/{id}` | Kurang field `noTransaksi` |
| `GET /announcements` | Kurang field `isi`, `author` |
| `GET /issues` | Kurang field `deskripsi`, `tanggal`, `foto`, `tanggapan` |
| `GET /issues/me` | Kurang field `deskripsi`, `tanggal`, `foto`, `tanggapan` |
| `GET /issues/{id}` | Kurang field `noLaporan`, `riwayatStatus` |
| `GET /finance/expenses` | Kurang field `keterangan`, `buktiNota` |
| `POST /businesses` | Kurang field `pemilik` di request body |
| `POST /dues` | Kurang field `jenisIuran` di request body |

---

## 3. Endpoint Baru yang Harus Ditambahkan

| # | Method | Endpoint | Keterangan |
|---|--------|----------|------------|
| 1 | `DELETE` | `/announcements/{id}` | Hapus pengumuman (ada tombol di frontend) |
| 2 | `DELETE` | `/finance/expenses/{id}` | Hapus pengeluaran kas (ada tombol di frontend) |
| 3 | `DELETE` | `/residents/{id}/officer-role` | Hapus jabatan pengurus (ada tombol di frontend) |
| 4 | `GET` | `/finance/report?periode=...` | Laporan keuangan agregat (frontend butuh) |
| 5 | `GET` | `/finance/report/export?format=pdf&periode=...` | Export PDF laporan keuangan (ada tombol di frontend) |
| 6 | `GET` | `/dashboard/activities` | Aktivitas terbaru (ditampilkan di dashboard) |
| 7 | `PATCH` | `/issues/{id}/status` | Perlu tambah enum `REJECTED` untuk validasi ditolak |
| 8 | `GET` | `/residents/{id}/profile` | Detail lengkap warga untuk halaman profil warga (belum ada tapi diperlukan) |

---

## 4. Mapping Status Enum

Berikut mapping yang diperlukan antara OpenAPI dan frontend:

### Role User
| OpenAPI | Frontend |
|---------|----------|
| `RESIDENT` | `warga` |
| `OFFICER` | `pengurus` |
| `CHAIRPERSON` | `ketua` |

### Status Keanggotaan Warga
| OpenAPI | Frontend |
|---------|----------|
| `AKTIF` | `aktif` / `terverifikasi` |
| `DITOLAK` | `ditolak` / `nonaktif` |
| *(tidak ada)* | `menunggu` |

### Status UMKM
| OpenAPI | Frontend |
|---------|----------|
| `VERIFIED` | `verified` / `Terverifikasi` |
| `PENDING` | `pending` / `Menunggu` |
| `REJECTED` | `rejected` / `Ditolak` |

### Status Iuran
| OpenAPI | Frontend |
|---------|----------|
| `ACTIVE` | `active` / `Aktif` |
| `INACTIVE` | `inactive` / `Nonaktif` |

### Status Pembayaran
| OpenAPI | Frontend |
|---------|----------|
| `BELUM_DIBAYAR` | `belum` |
| `PENDING` | `menunggu` |
| `VERIFIED` | `terverifikasi` / `Lunas` |
| `REJECTED` | `ditolak` |

### Status Publikasi Pengumuman
| OpenAPI | Frontend |
|---------|----------|
| `PUBLISHED` | `publik` |
| `DRAFT` | `draft` |

### Status Laporan Kendala
| OpenAPI | Frontend |
|---------|----------|
| `PENDING` | `menunggu` / `diverifikasi` |
| `IN_PROGRESS` | `proses` |
| `COMPLETED` | `selesai` |
| *(tidak ada)* | `ditolak` |

---

## 5. Rekomendasi Field Baru di OpenAPI

### Tambahkan field berikut ke response:

**GET /residents** (setiap item):
```json
{
  "alamat": "string",
  "noHp": "string",
  "tanggalDaftar": "string (date)"
}
```

**GET /residents/pending-verifications** (setiap item):
```json
{
  "nik": "string",
  "alamat": "string",
  "noHp": "string",
  "tanggalDaftar": "string (date)"
}
```

**GET /residents/officers** (setiap item):
```json
{
  "nik": "string"
}
```

**GET /businesses** (setiap item):
```json
{
  "pemilik": "string",
  "tanggalDaftar": "string (date)"
}
```

**GET /businesses/{id}**:
```json
{
  "pemilik": "string",
  "nikPemilik": "string",
  "noRegistrasi": "string",
  "tanggalDaftar": "string (date)"
}
```

**POST /businesses** (request body):
```json
{
  "pemilik": "string (optional — auto dari user login)"
}
```

**GET /dues** (setiap item):
```json
{
  "jenisIuran": "string"
}
```

**POST /dues** (request body):
```json
{
  "jenisIuran": "string"
}
```

**PATCH /dues/{id}** (request body):
```json
{
  "jenisIuran": "string"
}
```

**GET /dues/payments** (setiap item):
```json
{
  "metodeBayar": "string",
  "tanggalBayar": "string (date)"
}
```

**GET /dues/payments/{id}**:
```json
{
  "noTransaksi": "string"
}
```

**GET /dues/bills** (setiap item):
```json
{
  "jenisIuran": "string",
  "tanggalJatuhTempo": "string (date)"
}
```

**GET /announcements** (setiap item):
```json
{
  "isi": "string",
  "author": "string",
  "lampiran": "string (nullable)"
}
```

**GET /issues** (setiap item):
```json
{
  "deskripsi": "string",
  "tanggalLapor": "string (date)",
  "fotoKendala": "string (nullable)",
  "tanggapan": "string (nullable)"
}
```

**GET /issues/me** (setiap item):
```json
{
  "deskripsi": "string",
  "tanggalLapor": "string (date)",
  "fotoKendala": "string (nullable)",
  "tanggapan": "string (nullable)"
}
```

**GET /issues/{id}**:
```json
{
  "noLaporan": "string",
  "pelapor": "string",
  "riwayatStatus": [
    { "status": "string", "timestamp": "string (datetime)" }
  ]
}
```

**PATCH /issues/{id}/status** (request body enum):
```json
{
  "status": "PENDING | DIPROSES | SELESAI | DITOLAK"
}
```

**GET /finance/expenses** (setiap item):
```json
{
  "keterangan": "string",
  "buktiNota": "string (nullable)"
}
```

---

## 6. Diagram Kebutuhan Data Frontend vs API

```
Halaman Frontend         Data Ditampilkan                          Endpoint API
─────────────────────────────────────────────────────────────────────────────────────
Login                    username, password                        POST /auth/login
Register                 nik, nama, alamat, noHp, username, pass   POST /residents/register

Dashboard (Warga)        stats (umkm, tagihan, laporan)            GET /dashboard
                         status iuran (bento)                      GET /dues/bills
                         status umkm (bento)                       GET /businesses/me
                         pengumuman terbaru                        GET /announcements
                         aktivitas terbaru                         GET /dashboard/activities (BARU)

Dashboard (Pengurus)     stats (warga, umkm, laporan, kas)         GET /dashboard
                         task counts (pending items)               GET /dashboard
                         pengumuman                                GET /announcements
                         aktivitas                                 GET /dashboard/activities (BARU)

DataWarga                tabel warga (nik, nama, alamat, hp,       GET /residents
                         tglDaftar, status)

VerifikasiWarga          tabel pending + aksi verif/tolak          GET /residents/pending-verifications
                                                                   PATCH /residents/{id}/verification-status

KelolaPengurus           tabel pengurus (nik, nama, jabatan)       GET /residents/officers
Tambah/Edit Pengurus     form pilih warga + jabatan + periode      PATCH /residents/{id}/officer-role
Hapus Pengurus           tombol hapus                              DELETE /residents/{id}/officer-role (BARU)

LihatUMKM                galeri/table UMKM                         GET /businesses
DetailUMKM               detail UMKM (lengkap)                     GET /businesses/{id}
TambahUMKM               form UMKM                                 POST /businesses
EditUMKM                 form pre-filled                           PATCH /businesses/{id}
UMKMSaya                 daftar UMKM user                          GET /businesses/me
ValidasiUMKM             verif/tolak UMKM                          PATCH /businesses/{id}/status

KelolaIuran              tabel iuran + status                      GET /dues
TambahIuran              form iuran                                POST /dues
EditIuran                form pre-filled                           GET + PATCH /dues/{id}
Toggle Status Iuran      aktif/nonaktif                            PATCH /dues/{id}/status

PembayaranIuran          pilih tagihan + bayar                     GET /dues/bills + POST /dues/payments
VerifikasiPembayaran     tabel pembayaran                          GET /dues/payments
DetailVerifikasi         detail + aksi verif/tolak                 GET + PATCH /dues/payments/{id}/status

Pengumuman               card list pengumuman                      GET /announcements
KelolaPengumuman         table pengumuman                          GET /announcements
TambahPengumuman         form pengumuman                           POST /announcements
EditPengumuman           form pre-filled                           GET + PATCH /announcements/{id}
HapusPengumuman          tombol hapus                              DELETE /announcements/{id} (BARU)

BuatLaporan              form laporan kendala                      POST /issues
MonitoringLaporan        tabel laporan (warga: own, ketua: all)    GET /issues/me + GET /issues
DetailLaporan            detail + foto + tanggapan + riwayat       GET /issues/{id}
ValidasiLaporan          validasi laporan                          PATCH /issues/{id}/status
TindakLanjut             tanggapan + status                        PATCH /issues/{id}/follow-up + status

KelolaPengeluaranKas     tabel pengeluaran                         GET /finance/expenses
TambahPengeluaranKas     form pengeluaran                          POST /finance/expenses
EditPengeluaranKas       form pre-filled                           GET + PATCH /finance/expenses/{id}
HapusPengeluaranKas      tombol hapus                              DELETE /finance/expenses/{id} (BARU)

LaporanKeuangan          ringkasan pemasukan/pengeluaran           GET /finance/report?periode= (BARU)
                         tabel detail pemasukan & pengeluaran
                         export PDF                                GET /finance/report/export (BARU)

Profil                   lihat & edit profil                       GET + PATCH /profile/me
```

---

## 7. Ringkasan Total

| Kategori | Jumlah |
|----------|--------|
| Endpoint di OpenAPI | 45 |
| Endpoint yang perlu direstruktur response-nya | 14 |
| Endpoint baru yang harus ditambah | 8 |
| Field yang perlu ditambah di response | 35+ |
| Enum mapping yang perlu diselaraskan | 7 kategori |
| Halaman frontend tanpa endpoint API | 2 (LaporanKeuangan, Profil) |
| Fitur frontend yang belum punya endpoint | 5 (hapus pengurus, hapus pengumuman, hapus kas, laporan keuangan, export PDF) |

---

## 8. Prioritas Pengerjaan

### Tahap 1 — Foundation (Auth + Data Layer)
1. Perbaiki response `POST /auth/login` — tambah `initials`, mapping role
2. Tambah `DELETE` endpoints untuk hapus data
3. Tambah field yang kurang di response list (terutama `GET /residents`, `GET /announcements`, `GET /issues`)

### Tahap 2 — Dashboard
4. Restruktur `GET /dashboard` dengan response kompleks
5. Buat `GET /dashboard/activities`

### Tahap 3 — Fitur Lengkap
6. Tambah field `jenisIuran` di dues
7. Tambah field `pemilik` di businesses
8. Tambah field `keterangan` + `buktiNota` di finance/expenses
9. Buat `GET /finance/report` dan export endpoint
10. Tambah `noLaporan`, `riwayatStatus` di issues
11. Tambah `noTransaksi` di payments

### Tahap 4 — Penyempurnaan
12. Buat halaman profil (`GET/PATCH /profile/me`)
13. Mapping semua enum value

---

*Dokumen ini disusun berdasarkan hasil analisis `openapi.json` dan seluruh komponen frontend di `apps/web/src/pages/`.*
