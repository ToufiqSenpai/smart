# Laporan Perbaikan Frontend — SMART RT

**Tanggal:** 21 Juli 2026
**Pengerjaan:** Frontend (FE) only

---

## Ringkasan Pekerjaan

| # | Perbaikan | File | Status |
|---|-----------|------|--------|
| 1 | Fix typo `id_pembayaran_pembayaran` | `KetuaVerifikasiPembayaran.jsx` | ✅ Selesai |
| 2 | Fix field modal detail pembayaran (3 field salah) | `KetuaVerifikasiPembayaran.jsx` | ✅ Selesai |
| 3 | Fix Edit Pengurus — pakai `idWarga` dari response | `EditPengurus.jsx` | ✅ Selesai |
| 4 | Fix duplikasi `register()` — hapus dari residents.api.js | `residents.api.js` | ✅ Selesai |

---

## Detail Perubahan

### 1. Typo `id_pembayaran_pembayaran`

**File:** `apps/web/src/pages/iuran/KetuaVerifikasiPembayaran.jsx`

**Sebelum:**
```javascript
setData(prev => prev.map(p => p.id_pembayaran_pembayaran === id ? ... : p))
```

**Sesudah:**
```javascript
setData(prev => prev.map(p => p.id_pembayaran === id ? ... : p))
```

**Dampak:** State lokal sekarang terupdate dengan benar setelah approve/reject.

---

### 2. Field Modal Detail Pembayaran (3 field salah)

**File:** `apps/web/src/pages/iuran/KetuaVerifikasiPembayaran.jsx`

Modal detail pembayaran di halaman ini menggunakan objek payment mentah dari response API (tidak dimapping seperti di halaman `KetuaDetailVerifikasi.jsx`), tapi mengakses field yang salah.

| Field di Modal | Sebelum (salah) | Sesudah (benar) |
|---|---|---|
| Nama Warga | `modalPayment.warga` | `modalPayment.nama_warga` |
| Iuran | `modalPayment.iuran` | `modalPayment.nama_iuran` |
| Nominal | `modalPayment.nominal` | `modalPayment.jumlah_bayar` |
| Tombol Tolak | `modalPayment.id` | `modalPayment.id_pembayaran` |
| Tombol Verifikasi | `modalPayment.id` | `modalPayment.id_pembayaran` |

**Dampak:** Modal sekarang menampilkan data yang benar.

---

### 3. Edit Pengurus — Pakai `idWarga`

**File:** `apps/web/src/pages/manajemen-pengurus/EditPengurus.jsx`

**Sebelum:** Hanya menampilkan alert bahwa fitur tidak bisa digunakan karena response `/officers` tidak menyertakan `idWarga`.

```javascript
alert('Update jabatan pengurus saat ini perlu ID warga yang tidak tersedia di response GET /officers')
navigate('/kelola-pengurus')
```

**Sesudah:**
- Menyimpan `officer.idWarga` dari response (sekarang sudah tersedia setelah perbaikan BE)
- Memanggil `updateOfficerRole(idWarga, { jabatan, periodeJabatan: periode })`
- Menampilkan alert sukses dan navigasi kembali

```javascript
const [idWarga, setIdWarga] = useState('')

// Di useEffect
const officer = res.data.find(o => o.id === id)
if (officer) {
  setIdWarga(officer.idWarga || '')
  setJabatan(officer.jabatan || '')
  setPeriode(officer.periodeJabatan || '')
}

// Di handleSubmit
await updateOfficerRole(idWarga, { jabatan, periodeJabatan: periode })
```

---

### 4. Duplikasi `register()`

**File:** `apps/web/src/api/residents.api.js`

**Sebelum:**
```javascript
export function register(data) {
  return http.post('/residents/register', data)
}
```

Fungsi ini duplikat dengan `auth.api.js` yang sudah memiliki mapping `noHp` → `no_hp`. Jika dipanggil dengan objek berisi `noHp` (camelCase), BE akan reject karena mengharapkan `no_hp` (snake_case).

**Sesudah:** Fungsi dihapus (diganti komentar). Tidak ada kode lain yang mengimport `register` dari `residents.api.js`.

---

## Daftar File yang Dimodifikasi

```
apps/web/src/pages/iuran/KetuaVerifikasiPembayaran.jsx   (8 field fix)
apps/web/src/pages/manajemen-pengurus/EditPengurus.jsx    (rewrite submit handler)
apps/web/src/api/residents.api.js                          (hapus fungsi register)
```

**Total: 3 file**

## Build

Vite build **lulus tanpa error** (`✓ built in 345ms`).
