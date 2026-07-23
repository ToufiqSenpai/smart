import { useState, useEffect } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { getFinanceReport } from "../../api/finance.api"

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(angka)
}

function formatDate(dateStr) {
  const parts = dateStr.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
  return parseInt(parts[2]) + ' ' + months[parseInt(parts[1]) - 1] + ' ' + parts[0]
}

export default function LaporanKeuangan() {
  const [periode, setPeriode] = useState('all')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getFinanceReport({ periode: periode !== 'all' ? periode : undefined })
      .then(res => setData(res.data))
      .catch(err => console.error('Gagal memuat laporan:', err))
      .finally(() => setLoading(false))
  }, [periode])

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Manajemen Keuangan</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Laporan Keuangan</h1>
        <p className="text-[14.5px] text-text-muted">Ringkasan pemasukan dan pengeluaran kas RT.</p>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-[20px] p-4 px-6 flex items-center justify-between gap-4 flex-wrap mb-8 shadow-lux">
        <div className="flex items-center gap-3">
          <label className="text-[12.5px] font-semibold text-text-muted">Periode</label>
          <input
            type="month"
            className="px-3.5 py-1.5 font-sans text-[13px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(30,75,133,0.06)]"
            value={periode !== 'all' ? periode : ''}
            onChange={(e) => setPeriode(e.target.value || 'all')}
            placeholder="Pilih bulan"
          />
          {periode !== 'all' && (
            <button
              className="text-xs text-text-muted underline cursor-pointer border-none bg-transparent font-sans"
              onClick={() => setPeriode('all')}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-muted text-[13.5px]">Memuat laporan...</div>
      ) : !data ? (
        <div className="text-center py-12 text-text-muted text-[13.5px]">Gagal memuat laporan.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted mb-1">Total Pemasukan</p>
              <p className="font-grotesk text-2xl font-bold text-success">{formatRupiah(data.totalPemasukan)}</p>
            </div>
            <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted mb-1">Total Pengeluaran</p>
              <p className="font-grotesk text-2xl font-bold text-error">{formatRupiah(data.totalPengeluaran)}</p>
            </div>
            <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted mb-1">Saldo Akhir</p>
              <p className={"font-grotesk text-2xl font-bold " + (data.saldoAkhir >= 0 ? 'text-primary' : 'text-error')}>{formatRupiah(data.saldoAkhir)}</p>
            </div>
            <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted mb-1">Transaksi</p>
              <p className="font-grotesk text-2xl font-bold text-text-primary">{data.jumlahTransaksi}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
              <div className="px-6 py-5 border-b border-border-subtle">
                <h3 className="font-grotesk text-base font-bold text-text-primary">Pemasukan</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[14px]">
                  <thead>
                    <tr>
                      <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle">Warga</th>
                      <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle">Iuran</th>
                      <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle">Tanggal</th>
                      <th className="text-right px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle">Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pemasukan.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-8 text-text-muted text-[13px]">Tidak ada pemasukan.</td></tr>
                    ) : data.pemasukan.map((item, i) => (
                      <tr key={i} className="hover:bg-bg">
                        <td className="px-4 py-3 border-b border-border-subtle text-text-primary">{item.warga}</td>
                        <td className="px-4 py-3 border-b border-border-subtle text-text-muted">{item.iuran}</td>
                        <td className="px-4 py-3 border-b border-border-subtle text-text-muted font-mono text-[12px]">{formatDate(item.tanggal)}</td>
                        <td className="px-4 py-3 border-b border-border-subtle text-text-primary font-mono text-[12px] text-right">{formatRupiah(item.nominal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
              <div className="px-6 py-5 border-b border-border-subtle">
                <h3 className="font-grotesk text-base font-bold text-text-primary">Pengeluaran</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[14px]">
                  <thead>
                    <tr>
                      <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle">Kategori</th>
                      <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle">Keterangan</th>
                      <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle">Tanggal</th>
                      <th className="text-right px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle">Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pengeluaran.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-8 text-text-muted text-[13px]">Tidak ada pengeluaran.</td></tr>
                    ) : data.pengeluaran.map((item, i) => (
                      <tr key={i} className="hover:bg-bg">
                        <td className="px-4 py-3 border-b border-border-subtle text-text-primary font-semibold">{item.kategori}</td>
                        <td className="px-4 py-3 border-b border-border-subtle text-text-muted">{item.keterangan}</td>
                        <td className="px-4 py-3 border-b border-border-subtle text-text-muted font-mono text-[12px]">{formatDate(item.tanggal)}</td>
                        <td className="px-4 py-3 border-b border-border-subtle text-text-primary font-mono text-[12px] text-right">{formatRupiah(item.nominal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}