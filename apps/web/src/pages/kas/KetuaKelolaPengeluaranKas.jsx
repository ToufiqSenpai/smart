import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"

const pengeluaranData = [
  { id: 1, kategori: 'Operasional', nominal: 150000, tanggal: '2026-07-14', keterangan: 'Pembelian ATK untuk keperluan administrasi RT', bukti: null },
  { id: 2, kategori: 'Kegiatan', nominal: 1000000, tanggal: '2026-07-13', keterangan: 'Dana 17-an kegiatan kemerdekaan', bukti: null },
  { id: 3, kategori: 'Kebersihan', nominal: 250000, tanggal: '2026-07-12', keterangan: 'Pembelian alat kebersihan', bukti: null },
  { id: 4, kategori: 'Keamanan', nominal: 300000, tanggal: '2026-07-11', keterangan: 'Perbaikan lampu pos ronda', bukti: null },
  { id: 5, kategori: 'Sosial', nominal: 500000, tanggal: '2026-07-10', keterangan: 'Sumbangan untuk warga kurang mampu', bukti: null },
  { id: 6, kategori: 'Perbaikan', nominal: 750000, tanggal: '2026-07-09', keterangan: 'Perbaikan jalan lingkungan RT 08', bukti: null }
]

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(angka)
}

function formatDate(dateStr) {
  const parts = dateStr.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
  return parseInt(parts[2]) + ' ' + months[parseInt(parts[1]) - 1] + ' ' + parts[0]
}

const total = pengeluaranData.reduce((sum, i) => sum + i.nominal, 0)
export default function KetuaKelolaPengeluaranKas() {
  const navigate = useNavigate()

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Manajemen Keuangan</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Kelola Pengeluaran Kas</h1>
        <p className="text-[14.5px] text-text-muted">Kelola data pengeluaran kas RT 08.</p>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-[20px] p-4 px-6 flex items-center justify-between gap-4 flex-wrap mb-8 shadow-lux">
        <div className="flex items-center gap-4 flex-wrap flex-1">
          <div className="flex-1 min-w-[200px] relative">
            <svg className="icon absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            <input type="text" id="searchInput" placeholder="Cari kategori..." className="w-full py-2 pl-[38px] pr-3 font-sans text-[13.5px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(30,75,133,0.06)]" />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="kategoriFilter" className="text-xs font-semibold text-text-muted uppercase tracking-[0.05em]">Kategori</label>
            <select id="kategoriFilter" className="px-3.5 py-1.5 pl-[14px] pr-[32px] font-sans text-[13px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] appearance-none cursor-pointer transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(30,75,133,0.06)]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717A' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
              <option value="all">Semua</option>
              <option value="Operasional">Operasional</option>
              <option value="Kegiatan">Kegiatan</option>
              <option value="Kebersihan">Kebersihan</option>
              <option value="Keamanan">Keamanan</option>
              <option value="Sosial">Sosial</option>
              <option value="Perbaikan">Perbaikan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <span className="text-xs font-semibold text-text-muted bg-bg px-3.5 py-1 rounded-full border border-border-subtle whitespace-nowrap" id="rowCount">{pengeluaranData.length} pengeluaran</span>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2 font-sans text-[13px] font-semibold bg-primary text-white border-none rounded-full cursor-pointer min-h-[38px] transition-all whitespace-nowrap hover:bg-[#163b6a] hover:shadow-[0_4px_12px_rgba(30,75,133,0.25)] hover:-translate-y-px" id="openModalBtn" onClick={() => navigate('/tambah-pengeluaran-kas')}>

          Tambah Pengeluaran
        </button>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-grotesk text-base font-bold text-text-primary">Daftar Pengeluaran Kas</h3>
          <span style={{ fontSize: "12px", color: "var(--ink-subtle)" }} id="totalPengeluaran">Total: {formatRupiah(total)}</span>
        </div>
        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">No</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Kategori</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Nominal</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Tanggal</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Keterangan</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody id="tableBody">
              {pengeluaranData.map((item, index) => (
                <tr key={item.id} className="hover:bg-bg">
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0">{index + 1}</td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0"><span className="font-semibold text-text-primary">{item.kategori}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0"><span className="font-mono text-[12px] text-text-primary">{formatRupiah(item.nominal)}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0"><span className="font-mono text-[12px] text-text-primary">{formatDate(item.tanggal)}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0">{item.keterangan}</td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0 text-right">
                    <div className="flex items-center gap-2 justify-end flex-wrap">
                      <button className="inline-flex items-center gap-1 px-3.5 py-1 font-sans text-xs font-semibold rounded-full cursor-pointer transition-all min-h-[32px] bg-transparent text-primary border border-border-subtle hover:bg-primary-light hover:border-primary" onClick={() => navigate('/edit-pengeluaran-kas/' + item.id)}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        Edit
                      </button>
                      <button className="inline-flex items-center gap-1 px-3.5 py-1 font-sans text-xs font-semibold rounded-full cursor-pointer transition-all min-h-[32px] bg-error/10 text-error border border-error/10 hover:bg-error hover:text-white" onClick={() => alert('Hapus pengeluaran: ' + item.keterangan)}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
