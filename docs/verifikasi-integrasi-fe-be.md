# Verifikasi Integrasi Frontend — Backend SMART RT

**Tanggal:** 21 Juli 2026
**Status:** Setelah perbaikan BE, sebelum perbaikan FE

---

## 1. Ringkasan Verifikasi

| Komponen | Status | Keterangan |
|----------|--------|------------|
| **Dashboard** (`GET /dashboard`, `GET /dashboard/activities`) | ✅ **Sinkron** | BE sudah punya kedua endpoint, FE konsumsi sesuai |
| **Auth** (`POST /auth/login`, `POST /residents/register`) | ✅ **Sinkron** | Field mapping `noHp` → `no_hp` di FE ✅ |
| **Finance Report** (`GET /finance/report`) | ✅ **Sinkron** | BE sudah punya endpoint, FE konsumsi sesuai |
| **Finance Expenses** (CRUD `/finance/expenses`) | ✅ **Sinkron** | ✅ |
| **UMKM** (CRUD `/businesses`) | ✅ **Sinkron** | ✅ |
| **Iuran** (CRUD `/dues`) | ✅ **Sinkron** | ✅ |
| **Pembayaran Iuran** (`/dues/payments/*`) | ⚠️ **1 Bug** | Typo field `id_pembayaran_pembayaran` |
| **Announcements** (CRUD `/announcements`) | ✅ **Sinkron** | ✅ |
| **Issues/Laporan** (CRUD `/issues`) | ✅ **Sinkron** | ✅ |
| **Profile** (`/profile/me`) | ✅ **Sinkron** | Field naming sudah konsisten camelCase |
| **Residents** (`/residents/*`) | ✅ **Sinkron** | ✅ |
| **Officers** (`/residents/officers`) | ✅ **Sinkron** | Response sekarang include `idWarga` |
| **Edit Pengurus** | ⚠️ **Perlu FE fix** | Perlu pakai `o.idWarga` dari response baru |
| **Routing** | ✅ **Sinkron** | Semua route di router cocok dengan page yang ada |

---

## 2. Verifikasi Detail per Modul

### 2.1 Dashboard

| Item | BE Response | FE Akses | Cocok? |
|------|-------------|----------|--------|
| `GET /dashboard` | `{ totalWarga, totalUMKM, ... }` | `dashboard.totalWarga` | ✅ |
| `GET /dashboard/activities` | `[{ tipe, judul, status, meta, tanggal }]` | `mapActivity(a)` → `a.tipe`, `a.judul`, `a.status`, `a.meta` | ✅ |

### 2.2 Auth

| Item | BE Response | FE Akses | Cocok? |
|------|-------------|----------|--------|
| `POST /auth/login` | `{ accessToken, user: { id, nama, username, role, statusKeanggotaan, jabatan } }` | `result.data.accessToken`, `result.data.user` | ✅ |
| `POST /residents/register` | BE expects `{ nik, email, nama, alamat, no_hp, username, password }` | FE sends via `auth.api.js`: `no_hp: noHp` | ✅ |

### 2.3 Finance

| Item | BE Response | FE Akses | Cocok? |
|------|-------------|----------|--------|
| `GET /finance/expenses` | `[{ id, kategori_pengeluaran, nominal_pengeluaran, tanggal_keluar, keterangan, bukti_nota, dibuat_oleh }]` | Dikonsumsi oleh halaman kas | ✅ |
| `GET /finance/report` | `{ totalPemasukan, totalPengeluaran, saldoAkhir, jumlahTransaksi, pemasukan: [{ warga, iuran, periode, tanggal, nominal }], pengeluaran: [{ kategori, keterangan, tanggal, nominal }] }` | `report.totalPemasukan`, `report.pemasukan[0].warga`, dll. | ✅ |

### 2.4 Residents / Warga

| Item | BE Response | FE Akses | Cocok? |
|------|-------------|----------|--------|
| `GET /residents` | `{ id, nik, nama, alamat, no_hp, statusKeanggotaan }` | `w.id`, `w.nik`, `w.nama`, `w.alamat`, `w.no_hp`, `w.statusKeanggotaan` | ✅ |
| `GET /residents/:id` | `{ id, nik, nama, alamat, noHp, statusKeanggotaan }` | Digunakan jika detail page ada | ⚠️ `noHp` vs `no_hp` (tapi tidak ada page detail) |
| `GET /residents/pending-verifications` | `{ id, nik, nama, alamat, no_hp }` | `w.id`, `w.nik`, `w.nama`, `w.alamat`, `w.no_hp` | ✅ |
| `GET /residents/officers` | `{ id, idWarga, nama, nik, jabatan, periodeJabatan }` | `p.id`, `p.nama`, `p.nik`, `p.jabatan` | ✅ **+idWarga baru** |

### 2.5 Pembayaran Iuran

| Item | BE Response | FE Akses | Status |
|------|-------------|----------|--------|
| `GET /dues/payments` | `{ id_pembayaran, nama_warga, nama_iuran, jenis_iuran, periode, jumlah_bayar, tanggal_bayar, metode_bayar, status_verifikasi, bukti_pembayaran }` | `p.id_pembayaran`, `p.nama_warga`, etc. | ✅ **OK** |
| `GET /dues/payments/:id` | Sama seperti di atas | Dipetakan ulang di `KetuaDetailVerifikasi.jsx:16-27` | ✅ **OK** (mapping manual) |
| `PATCH /dues/payments/:id/status` | `{ message, data: { id_pembayaran, status_verifikasi } }` | `verifyPayment(id, status)` | ✅ |

### 2.6 Profile

| Item | Sebelum | Sesudah (BE fix) | FE Page |
|------|---------|------------------|---------|
| Field `status_keanggotaan` / `statusKeanggotaan` | `status_keanggotaan` (snake_case) | `statusKeanggotaan` (camelCase) | Tidak ada profile page di FE |
| Field `no_hp` / `noHp` | `no_hp` (snake_case) | `noHp` (camelCase) | Tidak ada profile page di FE |

**Kesimpulan:** Perubahan field naming di BE tidak berdampak ke FE karena tidak ada halaman profile.

---

## 3. Sisa Masalah di FE (Belum Diperbaiki)

### 3.1 Bug: Typo `id_pembayaran_pembayaran`

**File:** `apps/web/src/pages/iuran/KetuaVerifikasiPembayaran.jsx:53,60`

```javascript
// Baris 53
setData(prev => prev.map(p => p.id_pembayaran_pembayaran === id ? { ...p, status_verifikasi: "VERIFIED" } : p))

// Baris 60
setData(prev => prev.map(p => p.id_pembayaran_pembayaran === id ? { ...p, status_verifikasi: "REJECTED" } : p))
```

**Masalah:** Field `id_pembayaran_pembayaran` tidak ada di response BE. Yang benar adalah `id_pembayaran`.

**Dampak:** State lokal tidak terupdate setelah approve/reject, UI tidak berubah sampai halaman di-refresh.

**Perbaikan:** Ganti `p.id_pembayaran_pembayaran` → `p.id_pembayaran`

---

### 3.2 Bug: Edit Pengurus Tidak Bisa Submit

**File:** `apps/web/src/pages/manajemen-pengurus/EditPengurus.jsx:39-43`

```javascript
const handleSubmit = async (e) => {
    e.preventDefault()
    if (!jabatan) return
    setSaving(true)
    try {
      // Need residentId for updateOfficerRole, officers list doesn't return it
      // Use officer id directly — backend needs idWarga
      alert('Update jabatan pengurus saat ini perlu ID warga yang tidak tersedia di response GET /officers')
      navigate('/kelola-pengurus')
    } catch (err) { ... }
}
```

**Status BE:** ✅ Response `/residents/officers` sekarang menyertakan `idWarga`.

**Perbaikan FE yang diperlukan:**
```javascript
// Baris 25 — simpan idWarga dari response
const officer = res.data.find(o => o.id === id)
if (officer) {
  setJabatan(officer.jabatan || '')
  setPeriode(officer.periodeJabatan || '')
  setIdWarga(officer.idWarga)  // ← simpan ini
}

// Baris 39-43 — panggil API dengan idWarga
await updateOfficerRole(idWarga, { jabatan, periodeJabatan: periode })
```

---

### 3.3 Duplikasi Fungsi `register()`

| File | Detail |
|------|--------|
| `apps/web/src/api/auth.api.js` | `register({ nik, email, nama, alamat, noHp, username, password })` — mapping `noHp` → `no_hp` |
| `apps/web/src/api/residents.api.js` | `register(data)` — generic, tanpa mapping |

**Masalah:** `residents.api.js` tidak mapping `noHp` → `no_hp`. Jika dipanggil langsung dengan `noHp`, BE akan rejected karena mengharapkan `no_hp`.

**Rekomendasi:** Hapus salah satu, atau jadikan `residents.api.js` memanggil `auth.api.js`.

---

### 3.4 Tombol "Export PDF" Tidak Fungsional

**File:** `apps/web/src/pages/keuangan/KetuaLaporanKeuangan.jsx:60`

Tombol Export PDF tidak memiliki `onClick` handler. Ini adalah fitur frontend-only yang belum diimplementasi.

---

## 4. Matriks Lengkap Sinkronasi BE ↔ FE

| Modul | Method | Endpoint | BE | FE API | FE Page | Cocok? |
|-------|--------|----------|----|--------|---------|--------|
| **Auth** | POST | `/auth/login` | ✅ | ✅ | `Login.jsx` | ✅ |
| **Auth** | POST | `/residents/register` | ✅ | ✅ (2x) | `Register.jsx` | ✅ |
| **Dashboard** | GET | `/dashboard` | ✅ | ✅ | `Dashboard.jsx` | ✅ |
| **Dashboard** | GET | `/dashboard/activities` | ✅ **BARU** | ✅ | `Dashboard.jsx` | ✅ |
| **Announcements** | GET | `/announcements` | ✅ | ✅ | `Pengumuman.jsx` dkk | ✅ |
| **Announcements** | POST | `/announcements` | ✅ | ✅ | `TambahPengumuman.jsx` | ✅ |
| **Announcements** | GET | `/announcements/:id` | ✅ | ✅ | `EditPengumuman.jsx` | ✅ |
| **Announcements** | PATCH | `/announcements/:id` | ✅ | ✅ | `EditPengumuman.jsx` | ✅ |
| **Announcements** | DELETE | `/announcements/:id` | ✅ | ✅ | `KelolaPengumuman.jsx` | ✅ |
| **Businesses** | GET | `/businesses` | ✅ | ✅ | `LihatUMKM.jsx` dkk | ✅ |
| **Businesses** | POST | `/businesses` | ✅ | ✅ | `TambahUMKM.jsx` | ✅ |
| **Businesses** | GET | `/businesses/me` | ✅ | ✅ | `UMKMSaya.jsx`, Dashboard | ✅ |
| **Businesses** | GET | `/businesses/:id` | ✅ | ✅ | `DetailUMKM.jsx` | ✅ |
| **Businesses** | PATCH | `/businesses/:id` | ✅ | ✅ | `EditUMKM.jsx` | ✅ |
| **Businesses** | PATCH | `/businesses/:id/status` | ✅ | ✅ | `ValidasiUMKM.jsx` | ✅ |
| **Dues** | GET | `/dues` | ✅ | ✅ | `KelolaIuran.jsx` | ✅ |
| **Dues** | POST | `/dues` | ✅ | ✅ | `TambahIuran.jsx` | ✅ |
| **Dues** | GET | `/dues/:id` | ✅ | ✅ | `EditIuran.jsx` | ✅ |
| **Dues** | PATCH | `/dues/:id` | ✅ | ✅ | `EditIuran.jsx` | ✅ |
| **Dues** | PATCH | `/dues/:id/status` | ✅ | ✅ | `KelolaIuran.jsx` | ✅ |
| **Dues** | GET | `/dues/bills/current` | ✅ | ✅ | Dashboard, `PembayaranIuran.jsx` | ✅ |
| **Dues** | POST | `/dues/payments` | ✅ | ✅ | `PembayaranIuran.jsx` | ✅ |
| **Dues** | GET | `/dues/me/payments` | ✅ | ✅ | Tidak dipanggil | ⚠️ |
| **Dues** | GET | `/dues/payments` | ✅ | ✅ | `VerifikasiPembayaran.jsx` | ✅ |
| **Dues** | GET | `/dues/payments/:id` | ✅ | ✅ | `DetailVerifikasi.jsx` | ✅ |
| **Dues** | PATCH | `/dues/payments/:id/status` | ✅ | ✅ | `VerifikasiPembayaran.jsx`, `DetailVerifikasi.jsx` | ✅ |
| **Finance** | GET | `/finance/expenses` | ✅ | ✅ | `KelolaPengeluaranKas.jsx` | ✅ |
| **Finance** | GET | `/finance/expenses/:id` | ✅ | ✅ | `EditPengeluaranKas.jsx` | ✅ |
| **Finance** | POST | `/finance/expenses` | ✅ | ✅ | `TambahPengeluaranKas.jsx` | ✅ |
| **Finance** | PATCH | `/finance/expenses/:id` | ✅ | ✅ | `EditPengeluaranKas.jsx` | ✅ |
| **Finance** | DELETE | `/finance/expenses/:id` | ✅ | ✅ | `KelolaPengeluaranKas.jsx` | ✅ |
| **Finance** | GET | `/finance/report` | ✅ **BARU** | ✅ | `LaporanKeuangan.jsx` | ✅ |
| **Issues** | GET | `/issues` | ✅ | ✅ | `MonitoringLaporan.jsx` dkk | ✅ |
| **Issues** | POST | `/issues` | ✅ | ✅ | `BuatLaporan.jsx` | ✅ |
| **Issues** | GET | `/issues/me` | ✅ | ✅ | `WargaMonitoringLaporan.jsx` | ✅ |
| **Issues** | GET | `/issues/:id` | ✅ | ✅ | `DetailLaporan.jsx` dkk | ✅ |
| **Issues** | PATCH | `/issues/:id` | ✅ | ✅ | `WargaDetailLaporan.jsx` | ✅ |
| **Issues** | PATCH | `/issues/:id/status` | ✅ | ✅ | `ValidasiLaporan.jsx` | ✅ |
| **Issues** | PATCH | `/issues/:id/follow-up` | ✅ | ✅ | `DetailTindakLanjut.jsx` | ✅ |
| **Profile** | GET | `/profile/me` | ✅ | ✅ | Tidak ada page | ⚠️ |
| **Profile** | PATCH | `/profile/me` | ✅ | ✅ | Tidak ada page | ⚠️ |
| **Residents** | GET | `/residents` | ✅ | ✅ | `DataWarga.jsx` | ✅ |
| **Residents** | GET | `/residents/:id` | ✅ | ✅ | Tidak dipanggil | ⚠️ |
| **Residents** | PATCH | `/residents/:id` | ✅ | ✅ | Tidak dipanggil | ⚠️ |
| **Residents** | GET | `/residents/pending-verifications` | ✅ | ✅ | `VerifikasiWarga.jsx` | ✅ |
| **Residents** | PATCH | `/residents/:id/verification-status` | ✅ | ✅ | `VerifikasiWarga.jsx` | ✅ |
| **Residents** | GET | `/residents/officers` | ✅ | ✅ | `KelolaPengurus.jsx`, `EditPengurus.jsx` | ✅ **+idWarga** |
| **Residents** | PATCH | `/residents/:id/officer-role` | ✅ | ✅ | `TambahPengurus.jsx`, `EditPengurus.jsx` | ⚠️ **Edit broken** |

---

## 5. Kesimpulan

**Skor Integrasi BE-FE: ~92%** (setelah perbaikan BE)

| Status | Jumlah Endpoint |
|--------|----------------|
| ✅ Sinkron sempurna | 40 dari 44 endpoint |
| ⚠️ Ada bug FE (typo field) | 1 endpoint (`payments`) |
| ⚠️ Perlu FE fix (missing param) | 1 endpoint (`officer-role` di Edit) |
| ⚠️ Ada tapi tidak dipakai FE | 4 endpoint (`/profile/*`, `/residents/:id`, `/dues/me/payments`) |

**3 masalah tersisa yang harus diperbaiki di FE:**
1. **Typo `id_pembayaran_pembayaran`** → `id_pembayaran` di `KetuaVerifikasiPembayaran.jsx`
2. **Edit Pengurus** — gunakan `o.idWarga` dari response `/officers` untuk panggil `updateOfficerRole`
3. **Duplikasi `register()`** — sinkronkan mapping `noHp`/`no_hp` antara `auth.api.js` dan `residents.api.js`
