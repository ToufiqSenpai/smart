# Daftar Endpoint yang Perlu Diimplementasikan / Diperbaiki

**Proyek:** SMART - Sistem Manajemen RT
**Tanggal:** 19 Juli 2026
**Tujuan:** Mencatat seluruh endpoint yang belum ada atau perlu diselaraskan antara `openapiv2.json` dengan implementasi backend saat ini.

---

## 🔴 Endpoint Baru — Belum Ada di Backend Sama Sekali

| # | Method | Endpoint | Deskripsi | Prioritas |
|---|--------|----------|-----------|-----------|
| 1 | `GET` | `/finance/report?periode=YYYY-MM` | Laporan keuangan agregat (total pemasukan, pengeluaran, saldo, tabel detail) | Tinggi |
| 2 | `GET` | `/dashboard/activities?limit=10` | Aktivitas terbaru dari semua modul (laporan, pembayaran, pengumuman) | Sedang |

### Spesifikasi Singkat

#### 1. `GET /finance/report`
**Response:**
```json
{
  "message": "Laporan keuangan berhasil diambil.",
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
**Logika:** Pemasukan dari `PembayaranIuran` (status `VERIFIED`). Pengeluaran dari `PengeluaranKas`.

#### 2. `GET /dashboard/activities`
**Response:**
```json
{
  "message": "Aktivitas berhasil diambil.",
  "data": [
    { "tipe": "LAPORAN", "judul": "Lampu Jalan Mati", "status": "COMPLETED", "meta": "Budi Santoso • 14/07/2026" }
  ]
}
```
**Logika:** Union 5-10 record terbaru dari `LaporanKendala`, `PembayaranIuran`, `Pengumuman`.

---

## 🟡 Endpoint dengan Route Path Tidak Sesuai OpenAPI

Endpoint berikut sudah ada di backend tapi **path-nya berbeda** dengan `openapiv2.json`. Backend perlu disesuaikan atau dibuatkan route alias.

| # | OpenAPI Path | Backend Saat Ini | Tindakan |
|---|-------------|------------------|----------|
| 1 | `POST /auth/login` | `POST /auth/login` ✅ | Sudah sesuai |
| 2 | `POST /auth/logout` | ❌ Tidak ada | **Buat endpoint** `POST /auth/logout` (return 200) |
| 3 | `POST /auth/register` | `POST /residents/register` | Tambah route `POST /auth/register` → alias ke residents register |
| 4 | `GET /residents/pending` | `GET /residents/pending-verifications` | Ubah path jadi `/residents/pending` atau tambah alias |
| 5 | `PATCH /residents/{id}/verify` | `PATCH /residents/{id}/verification-status` | Ubah path jadi `/residents/{id}/verify` atau tambah alias |
| 6 | `PATCH /residents/{id}/officer` | `PATCH /residents/{id}/officer-role` | Ubah path jadi `/residents/{id}/officer` atau tambah alias |
| 7 | `PATCH /businesses/{id}/verify` | `PATCH /businesses/{id}/status` | Ubah path jadi `/businesses/{id}/verify` atau tambah alias |
| 8 | `GET /payments/bills` | `GET /dues/bills/current` | Ubah path jadi `/payments/bills` |
| 9 | `POST /payments` | `POST /dues/payments` | Ubah path jadi `/payments` |
| 10 | `GET /payments/me` | `GET /dues/me/payments` | Ubah path jadi `/payments/me` |
| 11 | `GET /payments/{id}` | `GET /dues/payments/{id}` | Ubah path jadi `/payments/{id}` |
| 12 | `PATCH /payments/{id}/verify` | `PATCH /dues/payments/{id}/status` | Ubah path jadi `/payments/{id}/verify` |
| 13 | `PATCH /issues/{id}/verify` | `PATCH /issues/{id}/status` | Ubah path jadi `/issues/{id}/verify` |
| 14 | `PATCH /issues/{id}` | ❌ Tidak ada route (tapi ada service) | Tambah route `PATCH /issues/{id}` |

> **Catatan:** Untuk setiap endpoint di atas, endpoint lama boleh dipertahankan sebagai backward compatibility, tapi **endpoint baru sesuai OpenAPI harus ditambahkan**.

---

## 🟠 Perbaikan Minor di Backend

### 1. Login — Dukungan Username
**File:** `auth/service.ts`
**Perubahan:** `POST /auth/login` saat ini hanya menerima `email`. Frontend login pakai `username`. Ubah agar menerima `username` ATAU `email`.
```typescript
interface LoginBody {
  email?: string;
  username?: string;
  password: string;
}
```

### 2. `PATCH /issues/{id}` — Route Hilang
**File:** `issues/route.ts`
**Perubahan:** Tambah route `router.patch("/:issueId", authenticate, update)` — service dan controller sudah ada.

### 3. Response Dashboard — Tambah `pendingCounts`
**File:** `dashboard/service.ts`
**Perubahan:** Sudah diimplementasi ✅, tinggal verify.

### 4. Response Daftar Iuran — Tambah `jenis_iuran`
**File:** `dues/repository.ts`, `dues/service.ts`
**Perubahan:** Sudah diimplementasi ✅.

---

## 🔵 Endpoint yang Sudah Sesuai (Tidak Perlu Diubah)

| Endpoint | Status |
|----------|--------|
| `GET /dashboard` | ✅ |
| `GET /residents` | ✅ |
| `GET /residents/officers` | ✅ |
| `GET /residents/{id}` | ✅ |
| `PATCH /residents/{id}` | ✅ |
| `GET /businesses` | ✅ |
| `POST /businesses` | ✅ |
| `GET /businesses/me` | ✅ |
| `GET /businesses/{id}` | ✅ |
| `PATCH /businesses/{id}` | ✅ |
| `DELETE /businesses/{id}` | ✅ |
| `GET /dues` | ✅ |
| `POST /dues` | ✅ |
| `GET /dues/{id}` | ✅ |
| `PATCH /dues/{id}` | ✅ |
| `PATCH /dues/{id}/status` | ✅ |
| `DELETE /dues/{id}` | ✅ |
| `GET /issues` | ✅ |
| `POST /issues` | ✅ |
| `GET /issues/me` | ✅ |
| `GET /issues/{id}` | ✅ |
| `PATCH /issues/{id}/follow-up` | ✅ |
| `GET /finance/expenses` | ✅ |
| `POST /finance/expenses` | ✅ |
| `GET /finance/expenses/{id}` | ✅ |
| `PATCH /finance/expenses/{id}` | ✅ |
| `DELETE /finance/expenses/{id}` | ✅ |
| `GET /profile/me` | ✅ |
| `PATCH /profile/me` | ✅ |
| `GET /announcements` | ✅ |
| `POST /announcements` | ✅ |
| `GET /announcements/{id}` | ✅ |
| `PATCH /announcements/{id}` | ✅ |
| `DELETE /announcements/{id}` | ✅ |
| `POST /residents/register` | ✅ |

---

## Ringkasan untuk Delegasi

### Kelompok A — Endpoint Baru (2 item)
| # | Task |
|---|------|
| 1 | Buat `GET /finance/report` — laporan keuangan agregat |
| 2 | Buat `GET /dashboard/activities` — aktivitas terbaru |

### Kelompok B — Penyesuaian Route (14 item)
| # | Task |
|---|------|
| 1-14 | Sesuaikan 14 path endpoint agar sesuai `openapiv2.json` (lihat tabel 🟡 di atas) |

### Prioritas Pengerjaan
1. 🔴 **Endpoint baru**: `GET /finance/report`, `GET /dashboard/activities`
2. 🟡 **Route alignment**: Sesuaikan path endpoint
3. 🟠 **Minor fixes**: Login username, route `PATCH /issues/{id}`
