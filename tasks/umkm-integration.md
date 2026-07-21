# Implementation Plan: UMKM Integration

## Overview

Integrasikan 9 halaman UMKM dari static/mockAPI ke real API backend. Backend sudah support full CRUD (tanpa DELETE).

## Architecture Notes

- **Tidak ada DELETE di backend** — tidak usah implementasi delete
- **Tidak ada `status` filter di `GET /businesses`** — filter client-side setelah fetch
- **Field naming**: API pakai snake_case (`nama_usaha`, `status_verifikasi`)
- **`POST /businesses` hanya untuk role RESIDENT** — ketua tidak bisa tambah lewat API ini

## Task List

### Phase 0: API Module

- [ ] **Task 1: Buat `api/businesses.api.js`**
  
  **Description:** Modul API untuk semua endpoint businesses.
  
  **Acceptance criteria:**
  - [ ] `getBusinesses(params)` → `GET /businesses?keyword=&jenis_usaha=`
  - [ ] `getMyBusinesses()` → `GET /businesses/me`
  - [ ] `getBusinessById(id)` → `GET /businesses/:id`
  - [ ] `createBusiness(data)` → `POST /businesses`
  - [ ] `updateBusiness(id, data)` → `PATCH /businesses/:id`
  - [ ] `validateBusiness(id, data)` → `PATCH /businesses/:id/status`

  **Files:** `apps/web/src/api/businesses.api.js` (baru)
  **Scope:** S

### Phase 1: Ketua Pages (3 pages)

- [ ] **Task 2: Swap KetuaValidasiUMKM + KetuaLihatUMKM**
  
  Wired: swap import mockApi → api module, unwrap data. Scope: S.

- [ ] **Task 3: Wire KetuaDetailValidasiUMKM**
  
  Load from API + validate/reject actions. Scope: M.

- [ ] **Task 4: Wire KetuaTambahUMKM** (optional — backend restrict RESIDENT)
  
  Wire form ke `createBusiness()`. Scope: M.

### Phase 2: Warga Pages (5 pages)

- [ ] **Task 5: Wire WargaUMKMSaya**
  
  Load from `getMyBusinesses()`. Scope: S.

- [ ] **Task 6: Wire WargaTambahUMKM**
  
  Wire form ke `createBusiness()`. Scope: M.

- [ ] **Task 7: Wire WargaLihatUMKM**
  
  Load from `getBusinesses()`. Scope: S.

- [ ] **Task 8: Wire WargaDetailUMKM**
  
  Load from `getBusinessById(id)`. Scope: S.

- [ ] **Task 9: Wire EditUMKM**
  
  Load + update via API. Scope: M.

### Checkpoint
- [ ] Semua halaman UMKM terhubung ke real API
- [ ] Build passes

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| `POST /businesses` restrict RESIDENT | KetuaTambahUMKM tidak bisa pakai API | Skip dulu atau tanya user |
| Tanpa `status` filter di backend | Filter client-side | Ok untuk data kecil |
| Tanpa DELETE | Tidak bisa hapus UMKM | Skip tombol hapus |
