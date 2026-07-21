import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { getOfficers } from "../../api/residents.api"

export default function KelolaPengurus() {
  var navigate = useNavigate()
  var [search, setSearch] = useState('')
  var [data, setData] = useState([])
  var [loading, setLoading] = useState(true)

  useEffect(() => {
    getOfficers()
      .then(res => setData(res.data))
      .catch(err => console.error('Gagal memuat data pengurus:', err))
      .finally(() => setLoading(false))
  }, [])

  var filteredData = data.filter(function(p) {
    return p.nama.toLowerCase().includes(search.toLowerCase()) || p.nik.includes(search) || p.jabatan.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Manajemen Pengurus</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Kelola Pengurus RT</h1>
        <p className="text-[14.5px] text-text-muted">Kelola data kepengurusan RT 08.</p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex items-center">
            <svg className="icon absolute left-3.5 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            <input type="text" placeholder="Cari nama, NIK, atau jabatan..." className="w-[260px] py-2.5 pl-[42px] pr-3.5 rounded-[10px] border border-border-subtle bg-bg-card text-[13.5px] text-text-primary font-sans transition-all shadow-lux focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(30,75,133,0.08)] placeholder:text-text-muted" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span className="text-xs font-semibold text-text-muted px-3.5 py-1.5 bg-bg-card rounded-full border border-border-subtle shadow-lux">{filteredData.length} pengurus</span>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[13px] font-semibold font-sans cursor-pointer transition-all border-none bg-primary text-white shadow-[0_4px_12px_rgba(30,75,133,0.2)] hover:bg-[#163d6e] hover:-translate-y-px" onClick={() => navigate('/tambah-pengurus')}>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Tambah Pengurus
        </button>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between">
          <h3 className="font-grotesk text-base font-bold text-text-primary">Daftar Pengurus RT</h3>
          <span style={{ fontSize: "12px", color: "var(--ink-subtle)" }}>Total: {filteredData.length} pengurus</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-bg">
              <tr>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">No</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">Nama</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">NIK</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">Jabatan</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-12 text-text-muted text-[13.5px]">Memuat data...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-12 text-text-muted text-[13.5px]">Tidak ada data pengurus.</td></tr>
              ) : filteredData.map(function(p, index) {
                return (
                  <tr key={p.id} className="hover:bg-primary-lighter">
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6">{index + 1}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6" style={{ fontWeight: 600, color: "var(--ink-black)" }}>{p.nama}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6 font-mono text-[13px]">{p.nik}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6">{p.jabatan}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6 text-right pr-6">
                      <div className="flex items-center gap-2 justify-end flex-wrap">
                        <button className="inline-flex items-center gap-1 px-3.5 py-1 font-sans text-xs font-semibold rounded-full cursor-pointer transition-all min-h-[32px] bg-transparent text-primary border border-border-subtle hover:bg-primary-light hover:border-primary" onClick={() => navigate('/edit-pengurus/' + p.id)}>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                          Edit
                        </button>
                        <button className="inline-flex items-center gap-1 px-3.5 py-1 font-sans text-xs font-semibold rounded-full cursor-pointer transition-all min-h-[32px] bg-error/10 text-error border border-error/10 hover:bg-error hover:text-white" onClick={() => { if (window.confirm('Hapus pengurus ' + p.nama + '?')) { /* handle delete */ } }}>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                          Hapus
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
