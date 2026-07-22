# Laporan Perbaikan — Error `jenis_iuran`

**Tanggal:** 21 Juli 2026

---

## Akar Masalah

Ketika menambah iuran dari FE (`POST /api/v1/dues`), terjadi error:

```
column "jenis_iuran" of relation "iuran" does not exist
```

**Penyebab:** Migrasi awal (`20260707071022_init`) membuat tabel `iuran` tanpa kolom `jenis_iuran`. Skema Prisma kemudian diubah dengan menambahkan field `jenisIuran` (`@map("jenis_iuran")`) sebagai field **required**, tapi **tidak ada migrasi baru** yang dibuat untuk menambahkan kolom tersebut ke database.

Akibatnya:
- Prisma client generated menganggap kolom `jenis_iuran` ada di DB
- Setiap `INSERT` ke tabel `iuran` via Prisma mencoba menulis ke kolom `jenis_iuran`
- PostgreSQL mengembalikan error karena kolom tersebut tidak ada di tabel

---

## Perbaikan

### 1. Migration — Tambah Kolom `jenis_iuran`

**File baru:** `apps/backend/prisma/migrations/20260721000001_add_jenis_iuran/migration.sql`

```sql
ALTER TABLE "iuran" ADD COLUMN "jenis_iuran" VARCHAR(15) NOT NULL DEFAULT 'Wajib';
```

**Cara apply:** Jalankan SQL ini terhadap database PostgreSQL.

### 2. Seed — Tambah Field `jenisIuran`

**File:** `apps/backend/prisma/seed.ts`

Setiap pembuatan iuran di seed sekarang menyertakan `jenisIuran`:

```diff
 const iuranKebersihan = await prisma.iuran.create({
   data: {
     namaIuran: "Iuran Kebersihan Lingkungan",
+    jenisIuran: "Kebersihan",
     nominal: 25000.0,
     ...
   },
 });
```

---

## Verifikasi

- TypeScript BE: **lulus** (tsc --noEmit)
- Vite FE build: **lulus**
- Alur lengkap: FE kirim `jenis_iuran` → BE terima di `payload.jenis_iuran` → mapping ke `jenisIuran` → Prisma → DB ✅
