import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { getMyIssues } from "../../api/issues.api"

function formatDate(d) { if (!d) return ''; var p = d.split('T')[0].split('-'), m = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des']; return parseInt(p[2]) + ' ' + m[parseInt(p[1]) - 1] + ' ' + p[0] }

var statusClass = { PENDING: 'menunggu', VERIFIED: 'diverifikasi', IN_PROGRESS: 'proses', COMPLETED: 'selesai', REJECTED: 'ditolak' }
var labels = { PENDING: 'Menunggu', VERIFIED: 'Diverifikasi', IN_PROGRESS: 'Dalam Proses', COMPLETED: 'Selesai', REJECTED: 'Ditolak' }

export default function WargaMonitoringLaporan() {
  var navigate = useNavigate()
  var [data, setData] = useState([])
  var [loading, setLoading] = useState(true)
  var [search, setSearch] = useState('')
  var [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    getMyIssues().then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  var filtered = data.filter(i => {
    var ms = i.kategori_kendala.toLowerCase().includes(search.toLowerCase())
    var mf = statusFilter === 'all' || i.status_laporan === statusFilter
    return ms && mf
  })

  var stats = { semua: data.length, menunggu: data.filter(i => i.status_laporan === 'PENDING').length, proses: data.filter(i => i.status_laporan === 'VERIFIED' || i.status_laporan === 'IN_PROGRESS').length, selesai: data.filter(i => i.status_laporan === 'COMPLETED').length }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Laporan Saya</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Monitoring Laporan</h1>
        <p className="text-[14.5px] text-text-muted">Pantau status laporan kendala yang Anda buat.</p>
        <div className="flex gap-8 mt-4">
          <div><span className="text-xl font-bold text-text-primary">{stats.semua}</span><span className="text-xs text-text-muted ml-1">Semua</span></div>
          <div><span className="text-xl font-bold text-warning">{stats.menunggu}</span><span className="text-xs text-text-muted ml-1">Menunggu</span></div>
          <div><span className="text-xl font-bold text-teal">{stats.proses}</span><span className="text-xs text-text-muted ml-1">Diproses</span></div>
          <div><span className="text-xl font-bold text-success">{stats.selesai}</span><span className="text-xs text-text-muted ml-1">Selesai</span></div>
        </div>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-4 px-6 flex items-center justify-between gap-4 flex-wrap mb-8">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-1 min-w-[200px] relative">
            <svg className="icon absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            <input type="text" placeholder="Cari kategori..." value={search} onChange={e => setSearch(e.target.value)} className="w-full py-2 pl-[38px] pr-3 font-sans text-[13.5px] bg-bg border border-border-subtle rounded-full outline-none h-[38px]" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-text-muted uppercase">Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 text-[13px] bg-bg border border-border-subtle rounded-full outline-none h-[38px]">
              <option value="all">Semua</option>
              <option value="PENDING">Menunggu</option>
              <option value="VERIFIED">Diverifikasi</option>
              <option value="IN_PROGRESS">Dalam Proses</option>
              <option value="COMPLETED">Selesai</option>
              <option value="REJECTED">Ditolak</option>
            </select>
          </div>
          <span className="text-xs font-semibold text-text-muted bg-bg px-3.5 py-1 rounded-full border border-border-subtle">{filtered.length} laporan</span>
        </div>
        <Link to="/buat-laporan" className="inline-flex items-center gap-2 px-5 py-2 text-[13px] font-semibold bg-primary text-white rounded-full">+ Buat Laporan</Link>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between">
          <h3 className="font-grotesk text-base font-bold text-text-primary">Daftar Laporan</h3>
          <span className="text-xs text-text-muted">Total: {filtered.length} laporan</span>
        </div>
        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full border-collapse text-[14px]">
            <thead><tr>
              <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle">No</th>
              <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle">Kategori</th>
              <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle">Tanggal</th>
              <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle">Status</th>
              <th className="text-right px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle">Aksi</th>
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="5" className="text-center py-12 text-text-muted">Memuat data...</td></tr> :
              filtered.length === 0 ? <tr><td colSpan="5" className="text-center py-12 text-text-muted">Tidak ada laporan.</td></tr> :
              filtered.map((i, idx) => (
                <tr key={i.id} className="hover:bg-bg">
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted">{idx + 1}</td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted"><span className="font-semibold text-text-primary">{i.kategori_kendala}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted"><span className="font-mono text-xs text-text-primary">{formatDate(i.tanggal_lapor)}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted"><span className={`status-badge ${statusClass[i.status_laporan]}`}>{labels[i.status_laporan]}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-right"><button className="text-primary text-xs font-semibold hover:underline border-none bg-none cursor-pointer" onClick={() => navigate('/detail-laporan/' + i.id)}>Detail</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .status-badge { display:inline-flex; align-items:center; gap:4px; padding:4px 12px; border-radius:99px; font-size:11px; font-weight:700; border:1px solid transparent; }
        .status-badge.menunggu { background:var(--status-amber-bg); color:var(--status-amber); border-color:rgba(180,83,9,0.1); }
        .status-badge.diverifikasi { background:var(--status-teal-bg); color:var(--status-teal); border-color:rgba(15,118,110,0.1); }
        .status-badge.proses { background:var(--status-teal-bg); color:var(--status-teal); border-color:rgba(15,118,110,0.1); }
        .status-badge.selesai { background:var(--status-green-bg); color:var(--status-green); border-color:rgba(21,128,61,0.1); }
        .status-badge.ditolak { background:var(--status-red-bg); color:var(--status-red); border-color:rgba(185,28,28,0.1); }
      `}</style>
    </DashboardLayout>
  )
}
