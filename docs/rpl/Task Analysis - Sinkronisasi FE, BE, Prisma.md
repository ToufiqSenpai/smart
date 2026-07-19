# Task Analysis: Sinkronisasi Frontend — Backend — Prisma Schema

**Proyek:** SMART - Sistem Manajemen RT
**Tanggal:** 19 Juli 2026
**Prinsip:** Prisma schema adalah sumber kebenaran (ERD yang sudah disepakati). Jika field/data yang diinginkan frontend tidak tersedia di Prisma, **frontend yang harus menyesuaikan diri** — bukan schema.

---

## Daftar Isi

- [A. Ringkasan Prisma Schema](#a-ringkasan-prisma-schema)
- [B. Perubahan yang Harus Dilakukan di Frontend](#b-perubahan-yang-harus-dilakukan-di-frontend)
- [C. Perubahan Backend — Minor](#c-perubahan-backend--minor)
- [D. Perubahan Backend — Logika Baru / Endpoint Baru](#d-perubahan-backend--logika-baru--endpoint-baru)
- [E. Mapping Field Prisma ↔ Frontend](#e-mapping-field-prisma--frontend)
- [F. Task Assignment Summary](#f-task-assignment-summary)

---

## A. Ringkasan Prisma Schema

```
Masyarakat (id_masyarakat, nik, email, nama, alamat, no_hp, username, password)
  ├── Warga (id_warga, status_keanggotaan, id_masyarakat)
  │     ├── PembayaranIuran (id_pembayaran, id_warga, id_iuran, periode, id_pengurus, tanggal_bayar, metode_bayar, jumlah_bayar, bukti_pembayaran?, status_verifikasi)
  │     ├── LaporanKendala (id_laporan, id_warga, id_pengurus?, kategori_kendala, deskripsi, foto_kendala?, tanggal_lapor, status_laporan, tanggapan?)
  │     └── Umkm (id_umkm, id_warga, id_pengurus?, nama_usaha, jenis_usaha, deskripsi_usaha, alamat_usaha, kontak_usaha, foto_usaha?, status_verifikasi)
  └── PengurusRt (id_pengurus, jabatan, periode_jabatan, id_masyarakat)
        ├── Iuran (id_iuran, nama_iuran, nominal, tanggal_jatuh_tempo, status_aktif, id_ketua_rt)
        ├── PembayaranIuran (via id_pengurus)
        ├── PengeluaranKas (id_pengeluaran, id_pengurus, kategori_pengeluaran, nominal_pengeluaran, tanggal_keluar, keterangan, bukti_nota?)
        ├── Pengumuman (id_pengumuman, id_pengurus, judul, isi_pengumuman, lampiran?, tanggal_pengumuman, status_publikasi)
        ├── LaporanKendala (via id_pengurus?)
        └── UmkmDiverifikasi (via id_pengurus?)
```

### Catatan penting dari Prisma:
- **Tidak ada `role` field di Masyarakat** → role ditentukan oleh eksistensi di tabel Warga dan/atau PengurusRt
- **Tidak ada field `jenisIuran`** di tabel Iuran
- **Tidak ada `noTransaksi` / `noLaporan` / `noRegistrasi`** — nomor auto-generate tidak disimpan
- **Tidak ada `tanggalDaftar` / `createdAt`** di tabel Warga, Umkm
- **Tidak ada `riwayatStatus`** — status history tidak disimpan
- **Field `idPengurus` di PembayaranIuran wajib diisi** (String, bukan String?)
- **Field `keterangan` di PengeluaranKas:** `VarChar(30)` — terbatas
- **Field `judul` di Pengumuman:** `VarChar(15)` — terbatas
- **Field `namaUsaha` di Umkm:** `VarChar(15)` — terbatas
- **Field `jenisUsaha` di Umkm:** `VarChar(10)` — terbatas
- **Field `kategoriKendala` di LaporanKendala:** `VarChar(15)` — terbatas
- **Field `kategoriPengeluaran` di PengeluaranKas:** `VarChar(15)` — terbatas
- **Field `jabatan` di PengurusRt:** `VarChar(15)` — terbatas
- **Field `metodeBayar` di PembayaranIuran:** `VarChar(15)` — terbatas

---

## B. Perubahan yang Harus Dilakukan di Frontend

### B.1 Field yang Harus DIHAPUS dari Frontend (tidak ada di Prisma)

| Halaman | Field | Alasan |
|---------|-------|--------|
| **DataWarga** | `tglDaftar` | Tidak ada createdAt/tanggalDaftar di tabel Warga |
| **VerifikasiWarga** | `tglDaftar` | Sama seperti di atas |
| **KetuaKelolaIuran** | `jenis` | Tidak ada field jenisIuran di tabel Iuran |
| **KetuaTambahIuran** | `jenisIuran` | Tidak ada field jenisIuran di tabel Iuran |
| **KetuaEditIuran** | `jenis` | Tidak ada field jenisIuran di tabel Iuran |
| **WargaPembayaranIuran** | konsep "jenis" iuran | Tidak ada di tabel Iuran |
| **KetuaDetailVerifikasi** | `noTransaksi` | Tidak ada field noTransaksi di PembayaranIuran |
| **WargaDetailLaporan** | `noLaporan` | Tidak ada field noLaporan di LaporanKendala |
| **KetuaDetailValidasiLaporan** | `noLaporan` | Tidak ada field noLaporan di LaporanKendala |
| **KetuaDetailTindakLanjut** | `noLaporan` | Tidak ada field noLaporan di LaporanKendala |
| **WargaDetailUMKM** | `noRegistrasi` | Tidak ada field noRegistrasi di Umkm |
| **WargaDetailUMKM** | `tglDaftar` | Tidak ada createdAt di Umkm |
| **WargaDetailLaporan** | `riwayatStatus` array | Tidak ada tabel riwayat status |

### B.2 Field yang Harus DIGENERATE dari Data Lain (bukan dari API langsung)

| Frontend Field | Sumber Pengganti |
|----------------|------------------|
| `initials` user (avatar) | Generate dari `nama`: ambil huruf depan setiap kata |
| `author` pengumuman | Dari relasi PengurusRt → Masyarakat.nama |
| `pemilik` UMKM | Dari relasi Warga → Masyarakat.nama |
| `pelapor` laporan kendala | Dari relasi Warga → Masyarakat.nama |

### B.3 Field dengan Keterbatasan Panjang — Frontend Harus Menyesuaikan

| Komponen | Field | Limit Prisma | Tindakan Frontend |
|----------|-------|-------------|-------------------|
| Tambah/Edit Pengumuman | `judul` | VarChar(15) | Batasi input max 15 karakter |
| Tambah/Edit UMKM | `namaUsaha` | VarChar(15) | Batasi input max 15 karakter |
| Tambah/Edit UMKM | `jenisUsaha` | VarChar(10) | Batasi input max 10 karakter |
| Tambah PengeluaranKas | `keterangan` | VarChar(30) | Batasi input max 30 karakter |
| Tambah Laporan Kendala | `kategoriKendala` | VarChar(15) | Batasi pilihan/harus fit di 15 char |
| Kelola Pengurus | `jabatan` | VarChar(15) | Batasi input max 15 karakter |
| Pembayaran Iuran | `metodeBayar` | VarChar(15) | Batasi input max 15 karakter |

### B.4 Perubahan Enum/Status di Frontend

Frontend harus menggunakan **nilai yang konsisten dengan backend**. Rekomendasi: **backend yang menentukan enum value**, frontend menyesuaikan display text.

| Entity | Field | Nilai di Prisma (string) | Display Frontend |
|--------|-------|-------------------------|------------------|
| Warga | `statusKeanggotaan` | `MENUNGGU`, `AKTIF`, `DITOLAK` | Menunggu, Aktif, Ditolak |
| PembayaranIuran | `statusVerifikasi` | `MENUNGGU`, `DIVERIFIKASI`, `DITOLAK` | Menunggu, Terverifikasi, Ditolak |
| LaporanKendala | `statusLaporan` | `MENUNGGU`, `DIVERIFIKASI`, `DIPROSES`, `SELESAI`, `DITOLAK` | Menunggu, Diverifikasi, Diproses, Selesai, Ditolak |
| Umkm | `statusVerifikasi` | `MENUNGGU`, `DIVERIFIKASI`, `DITOLAK` | Menunggu, Terverifikasi, Ditolak |
| Pengumuman | `statusPublikasi` | `PUBLIK`, `DRAFT` | Publik, Draft |
| Iuran | `statusAktif` | `true` / `false` (Boolean) | Aktif / Nonaktif |
| PengurusRt | `jabatan` | text: KETUA_RT, WAKIL_KETUA, SEKRETARIS, BENDAHARA, etc | Ketua RT, Wakil Ketua, Sekretaris, Bendahara, etc |

### B.5 Perubahan Logika Halaman Tertentu

1. **Dashboard Warga — Bento Status Iuran**:
   - Saat ini menampilkan: `"Iuran RT (Juli 2026)" → badge "Lunas"`
   - Data dari: `GET /dues/bills` — response per tagihan
   - **Tidak perlu perubahan**

2. **Dashboard — Activity Section**:
   - Saat ini hardcoded 3 aktivitas
   - Akan diisi dari endpoint baru `GET /dashboard/activities` → delegasi ke kelompok

3. **Laporan Keuangan** (halaman baru):
   - Tidak ada tabel khusus di Prisma
   - Data dari agregasi `PembayaranIuran` (yg `DIVERIFIKASI`) + `PengeluaranKas`
   - **Backend perlu endpoint agregasi** → delegasi ke kelompok

4. **WargaMonitoringLaporan**:
   - Saat ini empty table (tidak ada data hardcoded)
   - Akan pakai `GET /issues/me` → setelah integrasi

5. **WargaUMKMSaya**:
   - Saat ini empty state
   - Akan pakai `GET /businesses/me` → setelah integrasi

6. **WargaLihatUMKM**:
   - Saat ini empty state
   - Akan pakai `GET /businesses` → setelah integrasi

### B.6 Routing Bug di Frontend

Di `router.jsx`:
- Route `/lihat-umkm` dan `/tambah-umkm` didaftarkan **dua kali** — untuk all roles dan untuk pengurus/ketua. Karena React Router memproses dari atas, registrasi kedua menimpa yang pertama.
- **Akibat**: Warga tidak akan pernah bisa mengakses halaman UMKM.
- **Perbaikan**: Hapus duplikasi, gunakan conditional rendering atau ProtectedRoute dengan multiple role.

---

## C. Perubahan Backend — Minor

> Bagian ini cukup kecil/ringan dan bisa dikerjakan oleh satu orang (saya).

### C.1 Login — Penentuan Role

**Endpoint:** `POST /auth/login`

**Perubahan:** Response login harus menyertakan role yang ditentukan dari database.

**Logika penentuan role:**
```
if (user has PengurusRt with jabatan == "KETUA_RT") → role = "CHAIRPERSON"
else if (user has PengurusRt) → role = "OFFICER"
else if (user has Warga) → role = "RESIDENT"
else → error / belum registrasi
```

**Response body:**
```json
{
  "message": "Login berhasil.",
  "data": {
    "accessToken": "jwt-token",
    "user": {
      "id": "uuid",
      "nama": "Budi Santoso",
      "role": "CHAIRPERSON"
    }
  }
}
```

> Frontend akan generate `initials` dari `nama`.

### C.2 Mapping Status Enum di API Layer

Backend perlu mengembalikan status dalam format yang sudah disepakati. Karena Prisma pakai string, backend bisa langsung pakai nilai seperti `MENUNGGU`, `AKTIF`, `DIVERIFIKASI`, dll.

**Perubahan di service layer:** Tidak perlu mapping khusus — cukup gunakan nilai dari database langsung.

### C.3 Include Relasi di Response

Beberapa response perlu menyertakan data dari tabel relasi:

| Endpoint | Relasi yang perlu di-include |
|----------|------------------------------|
| `GET /residents` | Setiap item: sertakan `masyarakat.nama`, `masyarakat.nik`, `masyarakat.alamat`, `masyarakat.noHp` |
| `GET /residents/pending-verifications` | Sertakan `masyarakat.nik`, `masyarakat.nama`, `masyarakat.alamat`, `masyarakat.noHp` |
| `GET /residents/officers` | Sertakan `masyarakat.nik`, `masyarakat.nama` |
| `GET /businesses` | Sertakan `warga.masyarakat.nama` (sebagai pemilik) |
| `GET /businesses/{id}` | Sertakan `warga.masyarakat.nama`, `warga.masyarakat.nik` |
| `GET /issues` | Sertakan `warga.masyarakat.nama` (sebagai pelapor) |
| `GET /issues/me` | Sertakan `warga.masyarakat.nama` |
| `GET /issues/{id}` | Sertakan `warga.masyarakat.nama`, `pengurus.masyarakat.nama` (untuk tanggapan) |
| `GET /announcements` | Sertakan `pengurus.masyarakat.nama` (sebagai author) |
| `GET /dues/payments` | Sertakan `warga.masyarakat.nama`, `iuran.namaIuran` |
| `GET /dues/payments/{id}` | Sertakan `warga.masyarakat.nama`, `iuran.namaIuran` |
| `GET /dues/me/payments` | Sertakan `iuran.namaIuran` |
| `GET /dues/bills` | Response dari tagihan (butuh logika khusus — lihat bagian D) |

### C.4 Penyesuaian Field Names di Response API

Response API sebaiknya menggunakan **snake_case** (konsisten dengan database) atau **camelCase** (konsisten dengan frontend). Untuk kemudahan frontend, gunakan **camelCase** di response API.

**Transformasi di controller:**
```typescript
// Contoh: dari Prisma result ke response
{
  "id": result.idMasyarakat,
  "nik": result.nik,
  "nama": result.nama,
  "alamat": result.alamat,
  "noHp": result.noHp,
  // ...
}
```

### C.5 Validasi Panjang Field (Sesuai Prisma)

Backend perlu menambahkan validasi panjang karakter di service layer:

| Field | Max Length |
|-------|-----------|
| `jabatan` (PengurusRt) | 15 |
| `namaIuran` (Iuran) | 40 |
| `metodeBayar` (PembayaranIuran) | 15 |
| `statusVerifikasi` (PembayaranIuran) | 15 |
| `kategoriPengeluaran` (PengeluaranKas) | 15 |
| `keterangan` (PengeluaranKas) | 30 |
| `judul` (Pengumuman) | 15 |
| `statusPublikasi` (Pengumuman) | 12 |
| `kategoriKendala` (LaporanKendala) | 15 |
| `statusLaporan` (LaporanKendala) | 10 |
| `namaUsaha` (Umkm) | 15 |
| `jenisUsaha` (Umkm) | 10 |
| `statusVerifikasi` (Umkm) | 12 |

### C.6 Perbaikan Field `idPengurus` di PembayaranIuran

**Issue:** Field `idPengurus` di tabel `PembayaranIuran` adalah `String` (required), tapi saat warga submit pembayaran, belum ada pengurus yang memverifikasi.

**Solusi minor:** Saat warga membuat pembayaran, isi `idPengurus` dengan UUID pengurus yang sedang login (jika pengurus yang input), atau gunakan pendekatan: jadikan field ini sebagai "who processed" — diisi saat verifikasi. 

Namun karena schema mengharuskan NOT NULL, alternatif:
- Saat pembayaran dibuat warga: isi `idPengurus` dengan ID pengurus default/sistem (misal: buat satu record PengurusRt khusus "SISTEM")
- Atau ubah logika: pembayaran dibuat oleh **petugas** yang menerima pembayaran, bukan oleh warga langsung

**Rekomendasi:**
- Untuk sementara, buat satu record PengurusRt khusus dengan jabatan "SISTEM" sebagai fallback
- Atau jadikan pembayaran sebagai "dicatat oleh pengurus" (warga bayar ke pengurus, pengurus mencatatkan)

### C.7 Perubahan Route Prefix

OpenAPI pakai base URL `/api`, backend pakai prefix `/api/v1`. Pastikan response endpoint di openapi.json disesuaikan dengan implementasi backend.

---

## D. Perubahan Backend — Logika Baru / Endpoint Baru

> Bagian ini membutuhkan endpoint baru atau logika kompleks — didelegasikan ke kelompok lain.

### D.1 Endpoint Baru

| # | Method | Endpoint | Deskripsi | Prioritas |
|---|--------|----------|-----------|-----------|
| 1 | `DELETE` | `/announcements/{id}` | Hapus pengumuman (ada tombol di FE) | Tinggi |
| 2 | `DELETE` | `/finance/expenses/{id}` | Hapus pengeluaran kas (ada tombol di FE) | Tinggi |
| 3 | `DELETE` | `/residents/{id}/officer-role` | Hapus jabatan pengurus (ada tombol di FE) | Tinggi |
| 4 | `GET` | `/dashboard/activities` | Aktivitas terbaru (untuk dashboard FE) | Sedang |
| 5 | `GET` | `/dues/bills` | Tagihan iuran untuk warga yang login — **perlu logika aggregasi** | Tinggi |
| 6 | `GET` | `/finance/report?periode=...` | Laporan keuangan agregat | Sedang |
| 7 | `GET` | `/residents` — tambah parameter `search` dan `status` | Sudah ada di OpenAPI, tinggal implementasi query filter | Tinggi |

### D.2 Endpoint dengan Logika Baru

#### D.2.1 `GET /dues/bills` — Tagihan per Warga

**Logika:**
1. Ambil semua Iuran yang `statusAktif = true`
2. Ambil riwayat pembayaran warga yang login
3. Untuk setiap iuran aktif, cek apakah warga sudah bayar periode berjalan
4. Jika belum → status "BELUM_DIBAYAR"
5. Jika sudah → status sesuai verifikasi

**Response:**
```json
{
  "data": [
    {
      "idIuran": "uuid",
      "namaIuran": "Iuran RT",
      "nominal": 50000,
      "periode": "Juli 2026",
      "tanggalJatuhTempo": "2026-07-31",
      "status": "BELUM_DIBAYAR"
    }
  ]
}
```

#### D.2.2 `GET /dashboard` — Response Kompleks per Role

**Logika untuk Warga:**
1. Hitung jumlah UMKM milik warga (dari Umkm where idWarga = ...)
2. Hitung jumlah tagihan belum dibayar (dari logika D.2.1)
3. Hitung jumlah laporan kendala warga
4. Ambil 3 pengumuman terbaru (PUBLIK)
5. Ambil status iuran per warga

**Logika untuk Pengurus/Ketua:**
1. Hitung total warga (aktif + menunggu)
2. Hitung total UMKM (terverifikasi)
3. Hitung total laporan kendala
4. Hitung pending count untuk task grid:
   - Jumlah UMKM menunggu verifikasi
   - Jumlah pembayaran menunggu verifikasi
   - Jumlah laporan menunggu validasi
   - Jumlah laporan menunggu tindak lanjut
5. (Khusus Ketua) jumlah warga menunggu verifikasi

#### D.2.3 `GET /dashboard/activities`

**Logika:** Ambil 5-10 record terbaru dari berbagai aktivitas:
- Laporan kendala terbaru (dari LaporanKendala)
- Pembayaran iuran terbaru (dari PembayaranIuran)
- Pengumuman terbaru (dari Pengumuman)
- Verifikasi warga terbaru (tidak ada timestamp verifikasi di Warga → mungkin dari urutan update)

**Response:**
```json
{
  "data": [
    {
      "tipe": "LAPORAN",
      "judul": "Lampu Jalan Mati",
      "status": "SELESAI",
      "deskripsi": "Budi Santoso • 14/07/2026"
    }
  ]
}
```

#### D.2.4 `GET /finance/report`

**Logika:**
1. Ambil semua PembayaranIuran dengan `statusVerifikasi = "DIVERIFIKASI"` dalam periode tertentu → total pemasukan
2. Ambil semua PengeluaranKas dalam periode tertentu → total pengeluaran
3. Hitung saldo akhir = pemasukan - pengeluaran

**Response:**
```json
{
  "data": {
    "totalPemasukan": 250000,
    "totalPengeluaran": 2550000,
    "saldoAkhir": -2300000,
    "jumlahTransaksi": 15,
    "pemasukan": [
      { "warga": "Budi Santoso", "iuran": "Iuran RT", "periode": "Juli 2026", "tanggal": "2026-07-14", "nominal": 50000 }
    ],
    "pengeluaran": [
      { "kategori": "Operasional", "keterangan": "Pembelian ATK", "tanggal": "2026-07-14", "nominal": 150000 }
    ]
  }
}
```

#### D.2.5 Export PDF Laporan Keuangan

Bisa berupa endpoint yang return PDF file, atau handle client-side dengan library js.

### D.3 Penyesuaian Endpoint Existing

| Endpoint | Perubahan |
|----------|-----------|
| `POST /auth/login` | Logika penentuan role dari relasi Warga/PengurusRt |
| `GET /residents` | Tambahkan filter `search` (by nama/nik) dan `status` |
| `GET /residents` | Include data masyarakat (nik, nama, alamat, noHp) |
| `GET /businesses` | Include nama pemilik dari relasi warga → masyarakat |
| `GET /issues` | Include nama pelapor dari relasi warga → masyarakat |
| `GET /announcements` | Include author dari relasi pengurus → masyarakat |

---

## E. Mapping Field Prisma ↔ Frontend

### E.1 Tabel Masyarakat

| Prisma | API Response (camelCase) | Frontend | Status |
|--------|------------------------|----------|--------|
| `idMasyarakat` | `id` | `id` | ✅ |
| `nik` | `nik` | `nik` | ✅ |
| `email` | `email` | — | ⏳ (tidak dipakai FE) |
| `nama` | `nama` | `nama` | ✅ |
| `alamat` | `alamat` | `alamat` | ✅ |
| `noHp` | `noHp` | `noHp` | ✅ |
| `username` | `username` | `username` | ✅ |
| `password` | — | `password` | ✅ (hanya input) |
| — | `role` (derived) | `role` | ✅ (ditentukan dari relasi) |
| — | `initials` (derived) | `initials` | ❌ FE harus generate sendiri |

### E.2 Tabel Warga

| Prisma | API Response | Frontend | Status |
|--------|-------------|----------|--------|
| `idWarga` | `id` | `id` | ✅ |
| `statusKeanggotaan` | `statusKeanggotaan` | `status` | ⚠️ FE perlu mapping display |
| `idMasyarakat` | — | — | ✅ (internal) |
| — | `tglDaftar` | ❌ **HAPUS dari FE** | ❌ Tidak ada di Prisma |

### E.3 Tabel Iuran

| Prisma | API Response | Frontend | Status |
|--------|-------------|----------|--------|
| `idIuran` | `id` | `id` | ✅ |
| `namaIuran` | `namaIuran` | `nama` | ⚠️ FE bisa ganti key jadi `namaIuran` |
| `nominal` | `nominal` | `nominal` | ✅ |
| `tanggalJatuhTempo` | `tanggalJatuhTempo` | `jatuhTempo` | ⚠️ FE sesuaikan key |
| `statusAktif` | `statusAktif` | `status` | ⚠️ FE: Boolean → display "Aktif/Nonaktif" |
| — | `jenisIuran` | `jenis` | ❌ **HAPUS dari FE** — tidak ada di Prisma |

### E.4 Tabel PembayaranIuran

| Prisma | API Response | Frontend | Status |
|--------|-------------|----------|--------|
| `idPembayaran` | `id` | `id` | ✅ |
| `periode` | `periode` | `periode` | ✅ |
| `tanggalBayar` | `tanggalBayar` | `tanggal` / `tanggalBayar` | ✅ |
| `metodeBayar` | `metodeBayar` | `metode` | ✅ |
| `jumlahBayar` | `jumlahBayar` | `nominal` / `jumlahBayar` | ✅ |
| `buktiPembayaran` | `buktiPembayaran` | `bukti` | ✅ |
| `statusVerifikasi` | `statusVerifikasi` | `status` | ⚠️ FE mapping display |
| — | `noTransaksi` | ❌ **HAPUS dari FE** | ❌ Tidak ada di Prisma |

### E.5 Tabel PengeluaranKas

| Prisma | API Response | Frontend | Status |
|--------|-------------|----------|--------|
| `idPengeluaran` | `id` | `id` | ✅ |
| `kategoriPengeluaran` | `kategoriPengeluaran` | `kategori` | ✅ |
| `nominalPengeluaran` | `nominalPengeluaran` | `nominal` | ✅ |
| `tanggalKeluar` | `tanggalKeluar` | `tanggal` | ✅ |
| `keterangan` | `keterangan` | `keterangan` | ✅ |
| `buktiNota` | `buktiNota` | `bukti` | ✅ |

### E.6 Tabel Pengumuman

| Prisma | API Response | Frontend | Status |
|--------|-------------|----------|--------|
| `idPengumuman` | `id` | `id` | ✅ |
| `judul` | `judul` | `judul` | ✅ |
| `isiPengumuman` | `isiPengumuman` | `isi` | ✅ |
| `lampiran` | `lampiran` | `lampiran` | ✅ |
| `tanggalPengumuman` | `tanggalPengumuman` | `tanggal` | ✅ |
| `statusPublikasi` | `statusPublikasi` | `status` | ✅ |
| — | `author` (dari relasi) | `author` | ✅ Backend include saja |

### E.7 Tabel LaporanKendala

| Prisma | API Response | Frontend | Status |
|--------|-------------|----------|--------|
| `idLaporan` | `id` | `id` | ✅ |
| `kategoriKendala` | `kategoriKendala` | `kategori` | ✅ |
| `deskripsi` | `deskripsi` | `deskripsi` | ✅ |
| `fotoKendala` | `fotoKendala` | `foto` | ✅ |
| `tanggalLapor` | `tanggalLapor` | `tanggal` | ✅ |
| `statusLaporan` | `statusLaporan` | `status` | ✅ |
| `tanggapan` | `tanggapan` | `tanggapan` | ✅ |
| — | `pelapor` (dari relasi) | `pelapor` | ✅ Backend include |
| — | `noLaporan` | ❌ **HAPUS dari FE** | ❌ Tidak ada di Prisma |
| — | `riwayatStatus` | ❌ **HAPUS dari FE** | ❌ Tidak ada di Prisma |

### E.8 Tabel Umkm

| Prisma | API Response | Frontend | Status |
|--------|-------------|----------|--------|
| `idUmkm` | `id` | `id` | ✅ |
| `namaUsaha` | `namaUsaha` | `namaUsaha` | ✅ |
| `jenisUsaha` | `jenisUsaha` | `jenis` | ✅ |
| `deskripsiUsaha` | `deskripsiUsaha` | `deskripsi` | ✅ |
| `alamatUsaha` | `alamatUsaha` | `alamat` | ✅ |
| `kontakUsaha` | `kontakUsaha` | `kontak` | ✅ |
| `fotoUsaha` | `fotoUsaha` | `foto` | ✅ |
| `statusVerifikasi` | `statusVerifikasi` | `status` | ✅ |
| — | `pemilik` (dari relasi) | `pemilik` | ✅ Backend include |
| — | `noRegistrasi` | ❌ **HAPUS dari FE** | ❌ Tidak ada di Prisma |

---

## F. Task Assignment Summary

### 🔵 Saya Kerjakan (Frontend + Minor Backend)

| # | Task | Estimasi |
|---|------|----------|
| F1 | **Frontend:** Hapus field `tglDaftar` dari DataWarga dan VerifikasiWarga | 15 menit |
| F2 | **Frontend:** Hapus field `jenis`/`jenisIuran` dari semua halaman Iuran | 20 menit |
| F3 | **Frontend:** Hapus field `noTransaksi` dari DetailVerifikasi | 10 menit |
| F4 | **Frontend:** Hapus field `noLaporan` dari semua halaman Laporan | 15 menit |
| F5 | **Frontend:** Hapus field `noRegistrasi` dan `tglDaftar` dari DetailUMKM | 10 menit |
| F6 | **Frontend:** Hapus `riwayatStatus` dari DetailLaporan | 10 menit |
| F7 | **Frontend:** Generate `initials` dari `nama` (client-side) | 10 menit |
| F8 | **Frontend:** Sesuaikan key field (camelCase) di semua komponen agar konsisten dengan response API | 30 menit |
| F9 | **Frontend:** Terapkan max-length validation sesuai limit Prisma di form input | 30 menit |
| F10 | **Frontend:** Perbaiki routing duplikasi UMKM di router.jsx | 10 menit |
| F11 | **Frontend:** Mapping status enum dari backend value ke display text | 30 menit |
| B1 | **Backend Minor:** Implementasi login dengan penentuan role dari relasi (C.1) | 1 jam |
| B2 | **Backend Minor:** Include relasi di response endpoints (C.3) | 2 jam |
| B3 | **Backend Minor:** Validasi panjang field di service layer (C.5) | 30 menit |
| B4 | **Backend Minor:** Penanganan field `idPengurus` di PembayaranIuran (C.6) | 30 menit |
| B5 | **Backend Minor:** Transform response ke camelCase (C.4) | 1 jam |

### 🟡 Delegasi ke Kelompok Lain (Endpoint Baru + Logika Baru)

| # | Task | Endpoint | Prioritas |
|---|------|----------|-----------|
| G1 | Endpoint baru: `DELETE /announcements/{id}` | Hapus pengumuman | Tinggi |
| G2 | Endpoint baru: `DELETE /finance/expenses/{id}` | Hapus pengeluaran kas | Tinggi |
| G3 | Endpoint baru: `DELETE /residents/{id}/officer-role` | Hapus jabatan pengurus | Tinggi |
| G4 | Endpoint baru: `GET /dashboard/activities` | Aktivitas terbaru | Sedang |
| G5 | Endpoint baru: `GET /finance/report` (+ export) | Laporan keuangan agregat | Sedang |
| G6 | Logika baru: `GET /dues/bills` — tagihan per warga (aggregasi) | Tagihan saya | Tinggi |
| G7 | Logika baru: `GET /dashboard` — response kompleks per role | Dashboard | Tinggi |
| G8 | Logika baru: Filter `search` dan `status` di `GET /residents` | Daftar warga | Tinggi |

### Timeline yang Disarankan

```
Minggu 1: 🔵 F1-F11 (Frontend cleanup) + B1-B5 (Backend minor)
Minggu 2: 🟡 G1, G2, G3 (Delete endpoints) + G8 (Filter residents)
Minggu 3: 🟡 G6 (Bills logic) + G7 (Dashboard logic)
Minggu 4: 🟡 G4 (Activities) + G5 (Finance report)
Minggu 5: Integrasi dan testing FE ↔ BE
```

---

*Dokumen ini disusun berdasarkan analisis Prisma schema (`apps/backend/prisma/schema.prisma`), kode frontend (`apps/web/src/`), dan kontrak API (`openapi.json`).*
