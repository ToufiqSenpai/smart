# Laporan Perbaikan Backend — SMART RT

**Tanggal:** 21 Juli 2026
**Pengerjaan:** Backend (BE) only — belum menyentuh Frontend (FE)

---

## Ringkasan Pekerjaan

| # | Perbaikan | Kategori | Status |
|---|-----------|----------|--------|
| 1 | Tambah endpoint `GET /dashboard/activities` | Endpoint baru | ✅ Selesai |
| 2 | Tambah endpoint `GET /finance/report` | Endpoint baru | ✅ Selesai |
| 3 | Tambah field `idWarga` di response `GET /residents/officers` | Perbaikan response | ✅ Selesai |
| 4 | Konsistensi field naming profile (snake_case → camelCase) | Perbaikan response | ✅ Selesai |

---

## Detail Perubahan

### 1. Endpoint Baru: `GET /api/v1/dashboard/activities`

**Latar Belakang:** FE memanggil endpoint ini di halaman Dashboard (`Dashboard.jsx:283`) untuk menampilkan aktivitas terbaru, namun endpoint tidak ada di BE.

**Perubahan:**

| File | Perubahan |
|------|-----------|
| `apps/backend/src/modules/dashboard/controller.ts` | Tambah fungsi `getDashboardActivities` |
| `apps/backend/src/modules/dashboard/service.ts` | Tambah fungsi `getDashboardActivities` — mengagregasi aktivitas dari 3 sumber: laporan kendala, pembayaran iuran, dan pengumuman |
| `apps/backend/src/modules/dashboard/repository.ts` | Tambah 3 fungsi query: `findRecentIssues`, `findRecentPayments`, `findRecentAnnouncements` |
| `apps/backend/src/modules/dashboard/route.ts` | Tambah route `GET /activities` |

**Response shape:**
```json
{
  "message": "success",
  "data": [
    {
      "tipe": "LAPORAN | PEMBAYARAN | PENGUMUMAN",
      "judul": "string",
      "status": "string",
      "meta": "string",
      "tanggal": "YYYY-MM-DD"
    }
  ]
}
```

**Akses:** Semua role (RESIDENT, OFFICER, CHAIRPERSON) — hanya OFFICER/CHAIRPERSON yang melihat aktivitas pembayaran iuran.

---

### 2. Endpoint Baru: `GET /api/v1/finance/report`

**Latar Belakang:** FE memanggil endpoint ini di halaman Laporan Keuangan (`KetuaLaporanKeuangan.jsx:22`) dengan query param `periode`, namun endpoint tidak ada di BE.

**Perubahan:**

| File | Perubahan |
|------|-----------|
| `apps/backend/src/modules/finance/controller.ts` | Tambah fungsi `getFinanceReport` |
| `apps/backend/src/modules/finance/service.ts` | Tambah fungsi `getFinanceReport` — menghitung total pemasukan (dari pembayaran terverifikasi), total pengeluaran, saldo akhir |
| `apps/backend/src/modules/finance/repository.ts` | Tambah fungsi `getReport` — query payments (status VERIFIED) dan expenses, difilter berdasarkan periode |
| `apps/backend/src/modules/finance/route.ts` | Tambah route `GET /report` (sebelum route `/expenses` agar tidak konflik) |

**Response shape:**
```json
{
  "message": "success",
  "data": {
    "totalPemasukan": 500000,
    "totalPengeluaran": 200000,
    "saldoAkhir": 300000,
    "jumlahTransaksi": 12,
    "pemasukan": [
      { "warga": "Budi", "iuran": "Iuran Keamanan", "periode": "2026-07", "tanggal": "2026-07-15", "nominal": 50000 }
    ],
    "pengeluaran": [
      { "kategori": "ATK", "keterangan": "Beli kertas", "tanggal": "2026-07-10", "nominal": 25000 }
    ]
  }
}
```

**Akses:** OFFICER dan CHAIRPERSON.

---

### 3. Tambah `idWarga` di Response `GET /residents/officers`

**Latar Belakang:** Halaman Edit Pengurus (`EditPengurus.jsx`) tidak bisa submit karena endpoint `/residents/officers` hanya mengembalikan `idPengurus`, sementara endpoint `PATCH /residents/{residentId}/officer-role` membutuhkan `idWarga` (residentId).

**Perubahan:**

| File | Perubahan |
|------|-----------|
| `apps/backend/src/modules/residents/repository.ts` | `findAllOfficers` — tambah include `warga` pada relasi `masyarakat`, lalu return `idWarga` |

**Response shape (sebelum → sesudah):**
```diff
{
  "id": "uuid-pengurus",
+ "idWarga": "uuid-warga",
  "nama": "Budi Santoso",
  "nik": "3201...",
  "jabatan": "SEKRETARIS",
  "periodeJabatan": "2026-2028"
}
```

---

### 4. Konsistensi Field Naming Profile

**Latar Belakang:** Response `/profile/me` menggunakan snake_case (`status_keanggotaan`, `no_hp`) sementara response endpoint lain di BE menggunakan camelCase (`statusKeanggotaan`, `noHp`). Ini inkonsisten dan membingungkan FE.

**Perubahan:**

| File | Perubahan |
|------|-----------|
| `apps/backend/src/modules/profile/service.ts` | Ubah `status_keanggotaan` → `statusKeanggotaan`, `no_hp` → `noHp` |

**Response shape (sebelum → sesudah):**
```diff
{
  "id": "uuid",
  "nik": "3201...",
  "nama": "Budi Santoso",
  "alamat": "Jl. Melati No. 10",
- "no_hp": "081234567890",
+ "noHp": "081234567890",
  "username": "budi123",
  "role": "RESIDENT",
- "status_keanggotaan": "AKTIF"
+ "statusKeanggotaan": "AKTIF"
}
```

---

## Status Sinkronasi BE-FE Setelah Perbaikan

| Masalah Sebelumnya | Status | Keterangan |
|---|---|---|
| `GET /dashboard/activities` tidak ada | ✅ **Selesai** | Endpoint baru + query dari 3 sumber |
| `GET /finance/report` tidak ada | ✅ **Selesai** | Endpoint baru + agregasi pemasukan/pengeluaran |
| Typo `id_pembayaran_pembayaran` | ❌ **Belum** | Perbaikan di FE (tahap berikutnya) |
| Edit Pengurus broken (missing `idWarga`) | ✅ **Selesai** | Sekarang response `/officers` menyertakan `idWarga` |
| Field naming inkonsisten (`status_keanggotaan`) | ✅ **Selesai** | Profile sekarang konsisten camelCase |
| Duplikasi `register()` di FE | ❌ **Belum** | Perbaikan di FE (tahap berikutnya) |

---

## Daftar File yang Dimodifikasi

```
apps/backend/src/modules/dashboard/controller.ts  (+12 baris)
apps/backend/src/modules/dashboard/service.ts      (+48 baris)
apps/backend/src/modules/dashboard/repository.ts   (+22 baris)
apps/backend/src/modules/dashboard/route.ts        (+2 baris)
apps/backend/src/modules/finance/controller.ts     (+16 baris)
apps/backend/src/modules/finance/service.ts        (+34 baris)
apps/backend/src/modules/finance/repository.ts     (+50 baris)
apps/backend/src/modules/finance/route.ts          (+8 baris)
apps/backend/src/modules/residents/repository.ts   (+5 baris)
apps/backend/src/modules/profile/service.ts        (+2 baris)
```

**Total: 10 file, ±199 baris perubahan.**
