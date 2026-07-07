-- CreateTable
CREATE TABLE "masyarakat" (
    "id_masyarakat" VARCHAR(36) NOT NULL,
    "nik" VARCHAR(36) NOT NULL,
    "nama" VARCHAR(36) NOT NULL,
    "alamat" TEXT NOT NULL,
    "no_hp" VARCHAR(14) NOT NULL,
    "username" VARCHAR(21) NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "masyarakat_pkey" PRIMARY KEY ("id_masyarakat")
);

-- CreateTable
CREATE TABLE "warga" (
    "id_warga" VARCHAR(36) NOT NULL,
    "status_keanggotaan" VARCHAR(12) NOT NULL,
    "id_masyarakat" VARCHAR(36) NOT NULL,

    CONSTRAINT "warga_pkey" PRIMARY KEY ("id_warga")
);

-- CreateTable
CREATE TABLE "pengurus_rt" (
    "id_pengurus" VARCHAR(36) NOT NULL,
    "jabatan" VARCHAR(15) NOT NULL,
    "periode_jabatan" VARCHAR(50) NOT NULL,
    "id_masyarakat" VARCHAR(36) NOT NULL,

    CONSTRAINT "pengurus_rt_pkey" PRIMARY KEY ("id_pengurus")
);

-- CreateTable
CREATE TABLE "iuran" (
    "id_iuran" VARCHAR(36) NOT NULL,
    "nama_iuran" VARCHAR(40) NOT NULL,
    "nominal" DECIMAL(20,2) NOT NULL,
    "tanggal_jatuh_tempo" DATE NOT NULL,
    "status_aktif" BOOLEAN NOT NULL,
    "id_ketua_rt" VARCHAR(36) NOT NULL,

    CONSTRAINT "iuran_pkey" PRIMARY KEY ("id_iuran")
);

-- CreateTable
CREATE TABLE "pembayaran_iuran" (
    "id_pembayaran" VARCHAR(36) NOT NULL,
    "id_warga" VARCHAR(36) NOT NULL,
    "id_iuran" VARCHAR(36) NOT NULL,
    "periode" VARCHAR(20) NOT NULL,
    "id_pengurus" VARCHAR(36) NOT NULL,
    "tanggal_bayar" DATE NOT NULL,
    "metode_bayar" VARCHAR(15) NOT NULL,
    "jumlah_bayar" DECIMAL(20,2) NOT NULL,
    "bukti_pembayaran" TEXT,
    "status_verifikasi" VARCHAR(15) NOT NULL,

    CONSTRAINT "pembayaran_iuran_pkey" PRIMARY KEY ("id_pembayaran")
);

-- CreateTable
CREATE TABLE "pengeluaran_kas" (
    "id_pengeluaran" VARCHAR(36) NOT NULL,
    "id_pengurus" VARCHAR(36) NOT NULL,
    "kategori_pengeluaran" VARCHAR(15) NOT NULL,
    "nominal_pengeluaran" DECIMAL(20,2) NOT NULL,
    "tanggal_keluar" DATE NOT NULL,
    "keterangan" VARCHAR(30) NOT NULL,
    "bukti_nota" TEXT,

    CONSTRAINT "pengeluaran_kas_pkey" PRIMARY KEY ("id_pengeluaran")
);

-- CreateTable
CREATE TABLE "pengumuman" (
    "id_pengumuman" VARCHAR(36) NOT NULL,
    "id_pengurus" VARCHAR(36) NOT NULL,
    "judul" VARCHAR(15) NOT NULL,
    "isi_pengumuman" TEXT NOT NULL,
    "lampiran" TEXT,
    "tanggal_pengumuman" DATE NOT NULL,
    "status_publikasi" VARCHAR(12) NOT NULL,

    CONSTRAINT "pengumuman_pkey" PRIMARY KEY ("id_pengumuman")
);

-- CreateTable
CREATE TABLE "laporan_kendala" (
    "id_laporan" VARCHAR(36) NOT NULL,
    "id_warga" VARCHAR(36) NOT NULL,
    "id_pengurus" VARCHAR(36) NOT NULL,
    "kategori_kendala" VARCHAR(15) NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "foto_kendala" TEXT,
    "tanggal_lapor" DATE NOT NULL,
    "status_laporan" VARCHAR(10) NOT NULL,
    "tanggapan" TEXT,

    CONSTRAINT "laporan_kendala_pkey" PRIMARY KEY ("id_laporan")
);

-- CreateTable
CREATE TABLE "umkm" (
    "id_umkm" VARCHAR(36) NOT NULL,
    "id_warga" VARCHAR(36) NOT NULL,
    "id_pengurus" VARCHAR(36) NOT NULL,
    "nama_usaha" VARCHAR(15) NOT NULL,
    "jenis_usaha" VARCHAR(10) NOT NULL,
    "deskripsi_usaha" TEXT NOT NULL,
    "alamat_usaha" TEXT NOT NULL,
    "kontak_usaha" VARCHAR(15) NOT NULL,
    "foto_usaha" TEXT,
    "status_verifikasi" VARCHAR(12) NOT NULL,

    CONSTRAINT "umkm_pkey" PRIMARY KEY ("id_umkm")
);

-- CreateIndex
CREATE UNIQUE INDEX "masyarakat_nik_key" ON "masyarakat"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "warga_id_masyarakat_key" ON "warga"("id_masyarakat");

-- CreateIndex
CREATE UNIQUE INDEX "pengurus_rt_id_masyarakat_key" ON "pengurus_rt"("id_masyarakat");

-- CreateIndex
CREATE UNIQUE INDEX "pembayaran_iuran_id_warga_id_iuran_periode_key" ON "pembayaran_iuran"("id_warga", "id_iuran", "periode");

-- AddForeignKey
ALTER TABLE "warga" ADD CONSTRAINT "warga_id_masyarakat_fkey" FOREIGN KEY ("id_masyarakat") REFERENCES "masyarakat"("id_masyarakat") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengurus_rt" ADD CONSTRAINT "pengurus_rt_id_masyarakat_fkey" FOREIGN KEY ("id_masyarakat") REFERENCES "masyarakat"("id_masyarakat") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "iuran" ADD CONSTRAINT "iuran_id_ketua_rt_fkey" FOREIGN KEY ("id_ketua_rt") REFERENCES "pengurus_rt"("id_pengurus") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembayaran_iuran" ADD CONSTRAINT "pembayaran_iuran_id_warga_fkey" FOREIGN KEY ("id_warga") REFERENCES "warga"("id_warga") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembayaran_iuran" ADD CONSTRAINT "pembayaran_iuran_id_iuran_fkey" FOREIGN KEY ("id_iuran") REFERENCES "iuran"("id_iuran") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembayaran_iuran" ADD CONSTRAINT "pembayaran_iuran_id_pengurus_fkey" FOREIGN KEY ("id_pengurus") REFERENCES "pengurus_rt"("id_pengurus") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengeluaran_kas" ADD CONSTRAINT "pengeluaran_kas_id_pengurus_fkey" FOREIGN KEY ("id_pengurus") REFERENCES "pengurus_rt"("id_pengurus") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengumuman" ADD CONSTRAINT "pengumuman_id_pengurus_fkey" FOREIGN KEY ("id_pengurus") REFERENCES "pengurus_rt"("id_pengurus") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_kendala" ADD CONSTRAINT "laporan_kendala_id_warga_fkey" FOREIGN KEY ("id_warga") REFERENCES "warga"("id_warga") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_kendala" ADD CONSTRAINT "laporan_kendala_id_pengurus_fkey" FOREIGN KEY ("id_pengurus") REFERENCES "pengurus_rt"("id_pengurus") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "umkm" ADD CONSTRAINT "umkm_id_warga_fkey" FOREIGN KEY ("id_warga") REFERENCES "warga"("id_warga") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "umkm" ADD CONSTRAINT "umkm_id_pengurus_fkey" FOREIGN KEY ("id_pengurus") REFERENCES "pengurus_rt"("id_pengurus") ON DELETE RESTRICT ON UPDATE CASCADE;
