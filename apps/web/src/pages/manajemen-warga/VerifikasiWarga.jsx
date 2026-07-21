import { useState, useEffect } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { getPendingVerifications, verifyResident } from "../../api/residents.api"

export default function VerifikasiWarga() {
  var [search, setSearch] = useState('')
  var [data, setData] = useState([])
  var [loading, setLoading] = useState(true)

  useEffect(() => {
    getPendingVerifications()
      .then(res => setData(res.data))
      .catch(err => console.error('Gagal memuat data verifikasi:', err))
      .finally(() => setLoading(false))
  }, [])

  var filteredData = data.filter(function(w) {
    return w.nama.toLowerCase().includes(search.toLowerCase()) || w.nik.includes(search)
  })

  function handleVerifikasi(id) {
    verifyResident(id, { status: 'AKTIF' })
      .then(() => getPendingVerifications().then(res => setData(res.data)))
  }

  function handleTolak(id) {
    verifyResident(id, { status: 'DITOLAK' })
      .then(() => getPendingVerifications().then(res => setData(res.data)))
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Manajemen Warga</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Verifikasi Warga</h1>
        <p className="text-[14.5px] text-text-muted">Verifikasi pendaftaran warga baru RT 08.</p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex items-center">
            <svg className="icon absolute left-3.5 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            <input type="text" placeholder="Cari NIK atau Nama..." className="w-[260px] py-2.5 pl-[42px] pr-3.5 rounded-[10px] border border-border-subtle bg-bg-card text-[13.5px] text-text-primary font-sans transition-all shadow-lux focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(30,75,133,0.08)] placeholder:text-text-muted" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span className="text-xs font-semibold text-text-muted px-3.5 py-1.5 bg-bg-card rounded-full border border-border-subtle shadow-lux">{filteredData.length} menunggu</span>
        </div>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between">
          <h3 className="font-grotesk text-base font-bold text-text-primary">Daftar Verifikasi Warga</h3>
          <span style={{ fontSize: "12px", color: "var(--ink-subtle)" }}>Total: {filteredData.length} warga</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-bg">
              <tr>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">No</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">NIK</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">Nama</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">Alamat</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">No. HP</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">Status</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-12 text-text-muted text-[13.5px]">Memuat data...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-12 text-text-muted text-[13.5px]">Tidak ada warga menunggu verifikasi.</td></tr>
              ) : filteredData.map(function(w, index) {
                return (
                  <tr key={w.id} className="hover:bg-primary-lighter">
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6">{index + 1}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6 font-mono text-[13px]">{w.nik}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6" style={{ fontWeight: 600, color: "var(--ink-black)" }}>{w.nama}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6">{w.alamat}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6 font-mono text-[13px]">{w.no_hp}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap bg-warning-bg text-warning border border-warning/10">Menunggu</span>
                    </td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6 text-right pr-6">
                      <div className="flex items-center gap-2 justify-end flex-wrap">
                        <button className="inline-flex items-center gap-1 px-3.5 py-1 font-sans text-xs font-semibold rounded-full cursor-pointer transition-all min-h-[32px] bg-success-bg text-success border border-success/10 hover:bg-success hover:text-white" onClick={() => handleVerifikasi(w.id)}>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /></svg>
                          Verifikasi
                        </button>
                        <button className="inline-flex items-center gap-1 px-3.5 py-1 font-sans text-xs font-semibold rounded-full cursor-pointer transition-all min-h-[32px] bg-error/10 text-error border border-error/10 hover:bg-error hover:text-white" onClick={() => handleTolak(w.id)}>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
                          Tolak
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
