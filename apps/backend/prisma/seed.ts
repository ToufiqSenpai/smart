import dotenv from "dotenv";
import { prisma } from "../src/db/prisma";

dotenv.config();

async function main() {
  console.log("🌱 Mulai seeding...");

  // Bersihkan data lama (urutan dibalik dari relasi FK agar tidak conflict)
  await prisma.umkm.deleteMany();
  await prisma.laporanKendala.deleteMany();
  await prisma.pengumuman.deleteMany();
  await prisma.pengeluaranKas.deleteMany();
  await prisma.pembayaranIuran.deleteMany();
  await prisma.iuran.deleteMany();
  await prisma.warga.deleteMany();
  await prisma.pengurusRt.deleteMany();
  await prisma.masyarakat.deleteMany();

  // ======================================================
  // 1. MASYARAKAT + PENGURUS RT (2 pengurus)
  // ======================================================
  const masyarakatKetua = await prisma.masyarakat.create({
    data: {
      nik: "3273010101900001",
      email: "budi.santoso@example.com",
      nama: "Budi Santoso",
      alamat: "Jl. Melati No. 10, RT 05/RW 03, Bandung",
      noHp: "+6281234567890",
      username: "budisantoso",
      password: "password123",
    },
  });

  const masyarakatSekretaris = await prisma.masyarakat.create({
    data: {
      nik: "3273010101900002",
      email: "siti.aminah@example.com",
      nama: "Siti Aminah",
      alamat: "Jl. Mawar No. 5, RT 05/RW 03, Bandung",
      noHp: "081234567891",
      username: "sitiaminah",
      password: "password123",
    },
  });

  const ketuaRt = await prisma.pengurusRt.create({
    data: {
      jabatan: "Ketua RT",
      periodeJabatan: "2023 - 2026",
      idMasyarakat: masyarakatKetua.idMasyarakat,
    },
  });

  const sekretarisRt = await prisma.pengurusRt.create({
    data: {
      jabatan: "Sekretaris RT",
      periodeJabatan: "2023 - 2026",
      idMasyarakat: masyarakatSekretaris.idMasyarakat,
    },
  });

  // ======================================================
  // 2. MASYARAKAT + WARGA (6 warga)
  // ======================================================
  const dataWargaMentah = [
    {
      nik: "3273010101900010",
      email: "agus.wijaya@example.com",
      nama: "Agus Wijaya",
      noHp: "081234567892",
      username: "aguswijaya",
      status: "Aktif",
    },
    {
      nik: "3273010101900011",
      email: "rina.kartika@example.com",
      nama: "Rina Kartika",
      noHp: "081234567893",
      username: "rinakartika",
      status: "Aktif",
    },
    {
      nik: "3273010101900012",
      email: "dedi.kurniawan@example.com",
      nama: "Dedi Kurniawan",
      noHp: "081234567894",
      username: "dedikurniawan",
      status: "Aktif",
    },
    {
      nik: "3273010101900013",
      email: "sri.wahyuni@example.com",
      nama: "Sri Wahyuni",
      noHp: "081234567895",
      username: "sriwahyuni",
      status: "Aktif",
    },
    {
      nik: "3273010101900014",
      email: "andi.saputra@example.com",
      nama: "Andi Saputra",
      noHp: "081234567896",
      username: "andisaputra",
      status: "Nonaktif",
    },
    {
      nik: "3273010101900015",
      email: "lestari.putri@example.com",
      nama: "Lestari Putri",
      noHp: "081234567897",
      username: "lestariputri",
      status: "Pindah",
    },
  ];

  const wargaList = [];
  for (const w of dataWargaMentah) {
    const masyarakatWarga = await prisma.masyarakat.create({
      data: {
        nik: w.nik,
        email: w.email,
        nama: w.nama,
        alamat: `Jl. Anggrek No. ${Math.floor(Math.random() * 30) + 1}, RT 05/RW 03, Bandung`,
        noHp: w.noHp,
        username: w.username,
        password: "password123",
      },
    });

    const warga = await prisma.warga.create({
      data: {
        statusKeanggotaan: w.status,
        idMasyarakat: masyarakatWarga.idMasyarakat,
      },
    });

    wargaList.push(warga);
  }

  // ======================================================
  // 3. IURAN (dibuat oleh Ketua RT)
  // ======================================================
  const iuranKebersihan = await prisma.iuran.create({
    data: {
      namaIuran: "Iuran Kebersihan Lingkungan",
      nominal: 25000.0,
      tanggalJatuhTempo: new Date("2025-01-10"),
      statusAktif: true,
      idKetuaRt: ketuaRt.idPengurus,
    },
  });

  const iuranKeamanan = await prisma.iuran.create({
    data: {
      namaIuran: "Iuran Keamanan Bulanan",
      nominal: 30000.0,
      tanggalJatuhTempo: new Date("2025-01-10"),
      statusAktif: true,
      idKetuaRt: ketuaRt.idPengurus,
    },
  });

  const iuranSampah = await prisma.iuran.create({
    data: {
      namaIuran: "Iuran Sampah Rutin",
      nominal: 15000.0,
      tanggalJatuhTempo: new Date("2025-01-15"),
      statusAktif: false,
      idKetuaRt: ketuaRt.idPengurus,
    },
  });

  const semuaIuran = [iuranKebersihan, iuranKeamanan, iuranSampah];

  // ======================================================
  // 4. PEMBAYARAN IURAN
  // ======================================================
  const metodeBayarList = ["Transfer Bank", "Tunai", "QRIS", "E-Wallet"];
  const statusVerifikasiBayarList = ["Terverifikasi", "Menunggu", "Ditolak"];
  const periodeList = ["2025-01", "2025-02"];

  for (const warga of wargaList) {
    for (const periode of periodeList) {
      for (const iuran of [iuranKebersihan, iuranKeamanan]) {
        await prisma.pembayaranIuran.create({
          data: {
            idWarga: warga.idWarga,
            idIuran: iuran.idIuran,
            periode,
            idPengurus: ketuaRt.idPengurus,
            tanggalBayar: new Date(`${periode}-05`),
            metodeBayar:
              metodeBayarList[
                Math.floor(Math.random() * metodeBayarList.length)
              ],
            jumlahBayar: iuran.nominal,
            buktiPembayaran: "https://storage.example.com/bukti/dummy.jpg",
            statusVerifikasi:
              statusVerifikasiBayarList[
                Math.floor(Math.random() * statusVerifikasiBayarList.length)
              ],
          },
        });
      }
    }
  }

  // ======================================================
  // 5. PENGELUARAN KAS
  // ======================================================
  const pengeluaranData = [
    {
      kategori: "Kebersihan",
      nominal: 150000.0,
      ket: "Beli alat kebersihan RT",
    },
    { kategori: "Keamanan", nominal: 500000.0, ket: "Honor satpam bulan ini" },
    { kategori: "Sosial", nominal: 300000.0, ket: "Santunan warga sakit" },
    {
      kategori: "Administrasi",
      nominal: 75000.0,
      ket: "Fotokopi & alat tulis RT",
    },
  ];

  for (const p of pengeluaranData) {
    await prisma.pengeluaranKas.create({
      data: {
        idPengurus: sekretarisRt.idPengurus,
        kategoriPengeluaran: p.kategori,
        nominalPengeluaran: p.nominal,
        tanggalKeluar: new Date("2025-01-20"),
        keterangan: p.ket,
        buktiNota: "https://storage.example.com/nota/dummy.jpg",
      },
    });
  }

  // ======================================================
  // 6. PENGUMUMAN
  // ======================================================
  const pengumumanData = [
    {
      judul: "Kerja Bakti",
      isi: "Kerja bakti bersama akan dilaksanakan hari Minggu pukul 07.00 di lingkungan RT.",
      status: "Publish",
    },
    {
      judul: "Rapat RT",
      isi: "Rapat rutin bulanan pengurus dan warga akan diadakan di balai warga.",
      status: "Publish",
    },
    {
      judul: "Jadwal Ronda",
      isi: "Jadwal ronda malam bulan ini sudah tersedia, silakan cek papan pengumuman.",
      status: "Draft",
    },
    {
      judul: "Info Iuran",
      isi: "Diimbau kepada seluruh warga untuk melunasi iuran bulanan sebelum tanggal 10.",
      status: "Publish",
    },
  ];

  for (const p of pengumumanData) {
    await prisma.pengumuman.create({
      data: {
        idPengurus: ketuaRt.idPengurus,
        judul: p.judul,
        isiPengumuman: p.isi,
        lampiran: null,
        tanggalPengumuman: new Date("2025-01-05"),
        statusPublikasi: p.status,
      },
    });
  }

  // ======================================================
  // 7. LAPORAN KENDALA
  // ======================================================
  const kategoriKendalaList = [
    "Kebersihan",
    "Keamanan",
    "Infrastruktur",
    "Sosial",
  ];
  const statusLaporanList = ["Baru", "Diproses", "Selesai"];

  for (let i = 0; i < wargaList.length; i++) {
    const status = statusLaporanList[i % statusLaporanList.length];
    await prisma.laporanKendala.create({
      data: {
        idWarga: wargaList[i].idWarga,
        idPengurus: status === "Baru" ? null : ketuaRt.idPengurus,
        kategoriKendala: kategoriKendalaList[i % kategoriKendalaList.length],
        deskripsi:
          "Lampu jalan di depan rumah mati sejak 3 hari yang lalu, mohon segera diperbaiki.",
        fotoKendala: "https://storage.example.com/kendala/dummy.jpg",
        tanggalLapor: new Date("2025-01-12"),
        statusLaporan: status,
        tanggapan:
          status === "Selesai"
            ? "Sudah diperbaiki oleh petugas terkait."
            : null,
      },
    });
  }

  // ======================================================
  // 8. UMKM
  // ======================================================
  const umkmData = [
    { nama: "Warung Bu Siti", jenis: "Kuliner", status: "Disetujui" },
    { nama: "Laundry Jaya", jenis: "Jasa", status: "Disetujui" },
    { nama: "Bengkel Motor", jenis: "Jasa", status: "Menunggu" },
    { nama: "Katering Sehat", jenis: "Kuliner", status: "Ditolak" },
  ];

  for (let i = 0; i < umkmData.length; i++) {
    const u = umkmData[i];
    const warga = wargaList[i % wargaList.length];
    await prisma.umkm.create({
      data: {
        idWarga: warga.idWarga,
        idPengurus: ketuaRt.idPengurus,
        namaUsaha: u.nama,
        jenisUsaha: u.jenis,
        deskripsiUsaha: `${u.nama} adalah usaha rumahan milik warga RT yang sudah berjalan cukup lama.`,
        alamatUsaha: "Jl. Anggrek No. 12, RT 05/RW 03, Bandung",
        kontakUsaha: "081234567899",
        fotoUsaha: "https://storage.example.com/umkm/dummy.jpg",
        statusVerifikasi: u.status,
      },
    });
  }

  console.log("✅ Seeding selesai!");
  console.log(`   - ${dataWargaMentah.length} warga`);
  console.log(`   - 2 pengurus RT`);
  console.log(
    `   - ${semuaIuran.length} jenis iuran (${semuaIuran
      .map((i) => `${i.namaIuran}${i.statusAktif ? "" : " [nonaktif]"}`)
      .join(", ")})`,
  );
  console.log(
    `   - ${dataWargaMentah.length * periodeList.length * 2} pembayaran iuran`,
  );
  console.log(`   - ${pengeluaranData.length} pengeluaran kas`);
  console.log(`   - ${pengumumanData.length} pengumuman`);
  console.log(`   - ${wargaList.length} laporan kendala`);
  console.log(`   - ${umkmData.length} UMKM`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
