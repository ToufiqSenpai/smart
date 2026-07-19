import DashboardLayout from "../../components/layout/DashboardLayout"

const pemasukanData = [
  { id: 1, warga: 'Budi Santoso', iuran: 'Iuran RT', periode: 'Juli 2026', tanggal: '2026-07-14', nominal: 50000, status: 'terverifikasi' },
  { id: 2, warga: 'Ani Wijaya', iuran: 'Iuran Keamanan', periode: 'Juli 2026', tanggal: '2026-07-13', nominal: 30000, status: 'terverifikasi' },
  { id: 3, warga: 'Siti Rahayu', iuran: 'Iuran RT', periode: 'Juli 2026', tanggal: '2026-07-12', nominal: 50000, status: 'terverifikasi' },
  { id: 4, warga: 'Joko Prasetyo', iuran: 'Iuran Sosial', periode: 'Juni 2026', tanggal: '2026-06-28', nominal: 20000, status: 'terverifikasi' },
  { id: 5, warga: 'Eko Prabowo', iuran: 'Iuran Keamanan', periode: 'Juli 2026', tanggal: '2026-07-11', nominal: 30000, status: 'terverifikasi' },
  { id: 6, warga: 'Dewi Lestari', iuran: 'Iuran RT', periode: 'Juni 2026', tanggal: '2026-06-25', nominal: 50000, status: 'terverifikasi' },
  { id: 7, warga: 'Agus Saputra', iuran: 'Iuran Sosial', periode: 'Juni 2026', tanggal: '2026-06-20', nominal: 20000, status: 'terverifikasi' }
]

const pengeluaranData = [
  { id: 1, kategori: 'Operasional', nominal: 150000, tanggal: '2026-07-14', keterangan: 'Pembelian ATK untuk keperluan administrasi RT' },
  { id: 2, kategori: 'Kegiatan', nominal: 1000000, tanggal: '2026-07-13', keterangan: 'Dana 17-an kegiatan kemerdekaan' },
  { id: 3, kategori: 'Kebersihan', nominal: 250000, tanggal: '2026-07-12', keterangan: 'Pembelian alat kebersihan' },
  { id: 4, kategori: 'Keamanan', nominal: 300000, tanggal: '2026-07-11', keterangan: 'Perbaikan lampu pos ronda' },
  { id: 5, kategori: 'Sosial', nominal: 500000, tanggal: '2026-07-10', keterangan: 'Sumbangan untuk warga kurang mampu' },
  { id: 6, kategori: 'Perbaikan', nominal: 750000, tanggal: '2026-07-09', keterangan: 'Perbaikan jalan lingkungan RT 08' },
  { id: 7, kategori: 'Operasional', nominal: 100000, tanggal: '2026-06-28', keterangan: 'Pembelian perlengkapan rapat' },
  { id: 8, kategori: 'Kegiatan', nominal: 500000, tanggal: '2026-06-25', keterangan: 'Kegiatan lomba 17-an' }
]

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(angka)
}

function formatDate(dateStr) {
  const parts = dateStr.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
  return parseInt(parts[2]) + ' ' + months[parseInt(parts[1]) - 1] + ' ' + parts[0]
}

const totalPemasukan = pemasukanData.reduce((sum, i) => sum + i.nominal, 0)
const totalPengeluaran = pengeluaranData.reduce((sum, i) => sum + i.nominal, 0)
const saldoAkhir = totalPemasukan - totalPengeluaran
const jumlahTransaksi = pemasukanData.length + pengeluaranData.length

export default function KetuaLaporanKeuangan() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Laporan Keuangan</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Laporan Keuangan RT 08</h1>
        <p className="text-[14.5px] text-text-muted">Ringkasan pemasukan dan pengeluaran kas RT.</p>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-[20px] p-4 px-6 flex items-center justify-between gap-4 flex-wrap mb-8 shadow-lux">
        <div className="flex items-center gap-3 flex-wrap">
          <label htmlFor="periodeSelect" className="text-xs font-semibold text-text-muted uppercase tracking-[0.05em]">Periode</label>
          <select id="periodeSelect" className="px-3.5 py-1.5 pl-[14px] pr-[32px] font-sans text-[13px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] appearance-none cursor-pointer transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(30,75,133,0.06)]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717A' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
            <option value="2026-07">Juli 2026</option>
            <option value="2026-06">Juni 2026</option>
            <option value="2026-05">Mei 2026</option>
            <option value="2026-04">April 2026</option>
            <option value="2026-03">Maret 2026</option>
            <option value="2026-02">Februari 2026</option>
            <option value="2026-01">Januari 2026</option>
            <option value="all">Semua Periode</option>
          </select>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2 font-sans text-[13px] font-semibold bg-primary text-white border-none rounded-full cursor-pointer min-h-[38px] transition-all whitespace-nowrap hover:bg-[#163b6a] hover:shadow-[0_4px_12px_rgba(30,75,133,0.25)] hover:-translate-y-px" id="exportBtn">
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Export PDF
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-bg-card rounded-[20px] p-5 px-6 border border-border-subtle shadow-lux transition-all hover:-translate-y-0.5 hover:shadow-lux-hover">
          <div className="text-xs font-semibold uppercase tracking-[0.05em] text-text-muted mb-1">Total Pemasukan</div>
          <div className="font-mono text-[22px] font-semibold text-success" id="totalPemasukan">{formatRupiah(totalPemasukan)}</div>
          <div className="text-xs text-text-muted mt-1">Dari iuran warga</div>
        </div>
        <div className="bg-bg-card rounded-[20px] p-5 px-6 border border-border-subtle shadow-lux transition-all hover:-translate-y-0.5 hover:shadow-lux-hover">
          <div className="text-xs font-semibold uppercase tracking-[0.05em] text-text-muted mb-1">Total Pengeluaran</div>
          <div className="font-mono text-[22px] font-semibold text-error" id="totalPengeluaran">{formatRupiah(totalPengeluaran)}</div>
          <div className="text-xs text-text-muted mt-1">Kas keluar</div>
        </div>
        <div className="bg-bg-card rounded-[20px] p-5 px-6 border border-primary/15 shadow-lux transition-all hover:-translate-y-0.5 hover:shadow-lux-hover bg-primary-lighter">
          <div className="text-xs font-semibold uppercase tracking-[0.05em] text-text-muted mb-1">Saldo Akhir</div>
          <div className="font-mono text-[22px] font-semibold text-primary" id="saldoAkhir">{formatRupiah(saldoAkhir)}</div>
          <div className="text-xs text-text-muted mt-1">Pemasukan - Pengeluaran</div>
        </div>
        <div className="bg-bg-card rounded-[20px] p-5 px-6 border border-border-subtle shadow-lux transition-all hover:-translate-y-0.5 hover:shadow-lux-hover">
          <div className="text-xs font-semibold uppercase tracking-[0.05em] text-text-muted mb-1">Jumlah Transaksi</div>
          <div className="font-mono text-[22px] font-semibold text-text-primary" id="jumlahTransaksi">{jumlahTransaksi}</div>
          <div className="text-xs text-text-muted mt-1">Total transaksi</div>
        </div>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-grotesk text-base font-bold text-text-primary">Pemasukan (Iuran)</h3>
          <span className="text-xs font-semibold text-text-muted bg-bg px-3.5 py-1 rounded-full border border-border-subtle" id="totalPemasukanBadge">Total: {formatRupiah(totalPemasukan)}</span>
        </div>
        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">No</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Warga</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Iuran</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Periode</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Tanggal Bayar</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap text-right">Nominal</th>
              </tr>
            </thead>
            <tbody id="pemasukanBody">
              {pemasukanData.map((item, index) => (
                <tr key={item.id} className="hover:bg-bg">
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0">{index + 1}</td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0"><span className="font-semibold text-text-primary">{item.warga}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0">{item.iuran}</td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0"><span className="font-mono text-[12px] text-text-primary">{item.periode}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0"><span className="font-mono text-[12px] text-text-primary">{formatDate(item.tanggal)}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0 text-right"><span className="font-mono text-[13px] font-medium text-success">{formatRupiah(item.nominal)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-grotesk text-base font-bold text-text-primary">Pengeluaran Kas</h3>
          <span className="text-xs font-semibold text-text-muted bg-bg px-3.5 py-1 rounded-full border border-border-subtle" id="totalPengeluaranBadge">Total: {formatRupiah(totalPengeluaran)}</span>
        </div>
        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">No</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Kategori</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Keterangan</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Tanggal</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap text-right">Nominal</th>
              </tr>
            </thead>
            <tbody id="pengeluaranBody">
              {pengeluaranData.map((item, index) => (
                <tr key={item.id} className="hover:bg-bg">
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0">{index + 1}</td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0"><span className="font-semibold text-text-primary">{item.kategori}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0">{item.keterangan}</td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0"><span className="font-mono text-[12px] text-text-primary">{formatDate(item.tanggal)}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0 text-right"><span className="font-mono text-[13px] font-medium text-error">{formatRupiah(item.nominal)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
