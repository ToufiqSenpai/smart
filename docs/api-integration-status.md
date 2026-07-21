# API Integration Status

Status: **2026-07-21** | Branch: `dev`

---

## Summary

| Domain | Backend | Frontend API Module | Pages Integrated | Status |
|--------|---------|--------------------|------------------|--------|
| Auth | ✅ | ✅ `auth.api.js` | Login, Register | ✅ Done |
| Dashboard | ✅ | ✅ `dashboard.api.js` | Dashboard (main data) | ⚠️ Partial |
| Profile | ✅ | ✅ `profile.api.js` | — | 🔴 No page |
| Residents | ✅ | ✅ `residents.api.js` | DataWarga, VerifikasiWarga, KelolaPengurus | ✅ Done |
| Businesses | ✅ | ✅ `businesses.api.js` | ValidasiUMKM, DetailValidasi, LihatUMKM (ketua) | ⚠️ Partial |
| Announcements | ✅ | ❌ | Pengumuman (2 pages, mockApi) | 🔴 Pending |
| Dues (Iuran) | ✅ | ❌ | KelolaIuran (1 page, mockApi) | 🔴 Pending |
| Payments | ✅ | ❌ | VerifikasiPembayaran, DetailVerifikasi (2 pages, mockApi) | 🔴 Pending |
| Issues | ✅ | ❌ | ValidasiLaporan, MonitoringLaporan, TindakLanjut (3 pages, mockApi) | 🔴 Pending |
| Finance | ✅ | ❌ | KelolaPengeluaranKas, LaporanKeuangan (2 pages, mockApi) | 🔴 Pending |

---

## Pages Still Using mockApi (11 pages)

| Page | mockApi Functions | Backend Exists? |
|------|-------------------|-----------------|
| `Dashboard.jsx` | `getDashboardApi`, `getAnnouncementsApi`, `getPendingVerificationsApi`, `getBillsApi`, `getMyBusinessesApi` | ✅ (partial) |
| `KetuaPengumuman.jsx` | `getAnnouncementsApi` | ✅ `GET /announcements` |
| `WargaPengumuman.jsx` | `getAnnouncementsApi` | ✅ `GET /announcements` |
| `KetuaKelolaIuran.jsx` | `getDuesApi` | ✅ `GET /dues` |
| `KetuaVerifikasiPembayaran.jsx` | `getPaymentsApi`, `verifyPaymentApi` | ✅ `GET/PATCH /dues/payments` |
| `KetuaDetailVerifikasi.jsx` | `getPaymentByIdApi`, `verifyPaymentApi` | ✅ `GET/PATCH /dues/payments/:id` |
| `KetuaValidasiLaporan.jsx` | `getIssuesApi` | ✅ `GET /issues` |
| `KetuaMonitoringLaporan.jsx` | `getIssuesApi` | ✅ `GET /issues` |
| `KetuaTindakLanjutLaporan.jsx` | `getIssuesApi` | ✅ `GET /issues` |
| `KetuaKelolaPengeluaranKas.jsx` | `getExpensesApi` | ✅ `GET /finance/expenses` |
| `KetuaLaporanKeuangan.jsx` | `getFinanceReportApi` | ✅ `GET /finance/report` |

---

## Static/Dummy Pages Not Yet Wired (21 pages)

These pages have hardcoded data or non-functional forms — no API calls at all.

| Page | Status |
|------|--------|
| `TambahPengurus.jsx` | Form dummy, no state, no submit |
| `EditPengurus.jsx` | Form dummy, `useState` ada tapi no submit |
| `WargaUMKMSaya.jsx` | Hardcoded data, no API call |
| `WargaLihatUMKM.jsx` | Hardcoded data, no API call |
| `WargaDetailUMKM.jsx` | Hardcoded detail, no API call |
| `EditUMKM.jsx` | Form dummy, default values hardcoded |
| `KetuaTambahUMKM.jsx` | Form dummy, no submit |
| `WargaPembayaranIuran.jsx` | Not yet checked |
| `WargaLaporanBaru.jsx` | Not yet checked |
| `WargaMonitoringLaporan.jsx` | Not yet checked |
| `WargaDetailLaporan.jsx` | Not yet checked |
| `KetuaDetailValidasiLaporan.jsx` | Not yet checked |
| `KetuaDetailTindakLanjut.jsx` | Not yet checked |
| `Auth/Login.jsx` | Already wired to real API ✅ |
| `KetuaTambahPengeluaranKas.jsx` | Not yet checked |
| `KetuaEditPengeluaranKas.jsx` | Not yet checked |
| `KetuaTambahIuran.jsx` | Not yet checked |
| `KetuaEditIuran.jsx` | Not yet checked |
| `KetuaTambahPengumuman.jsx` | Not yet checked |
| `KetuaEditPengumuman.jsx` | Not yet checked |
| `KetuaLaporanKeuangan.jsx` | MockApi |

---

## Known Limitations

### 1. File Upload Not Supported

**Affected endpoints:** `POST /businesses` (foto_usaha), `POST /issues` (foto_kendala), `POST /dues/payments` (bukti_pembayaran), `POST /announcements` (lampiran), `POST /finance/expenses` (bukti_nota)

**Issue:** Frontend forms have `<input type="file">` but no `multipart/form-data` handling. Currently sending `foto_usaha: null` as placeholder.

**Needed:**
- Axios interceptor or separate instance for `multipart/form-data`
- Backend may need multer or similar for file upload (need to verify)

---

### 2. No DELETE for Businesses

**Backend:** No `DELETE /businesses/:id` endpoint exists.

**Impact:** Cannot delete UMKM from UI.

---

### 3. No Dashboard Activities Backend

**Endpoint:** `GET /dashboard/activities` returns **404**.

**Impact:** ActivitySection in dashboard always errors silently.

---

### 4. Bug: CHAIRPERSON jabatan mismatch

**Fixed:** Seed data jabatan changed from `"Ketua RT"` to `"CHAIRPERSON"` to match auth middleware.

**Still open:** If other entries in database use non-standard jabatan values, auth middleware will incorrectly assign role.

---

### 5. Seed Data Status Values

**Fixed:** Status values changed from `"Aktif"/"Nonaktif"/"Pindah"` to `"AKTIF"/"PENDING"/"DITOLAK"`.

---

## Missing Frontend API Modules

| Module | Needed For |
|--------|-----------|
| `api/announcements.api.js` | Pengumuman CRUD |
| `api/dues.api.js` | Iuran + Pembayaran |
| `api/issues.api.js` | Laporan Kendala |
| `api/finance.api.js` | Pengeluaran Kas + Laporan Keuangan |
