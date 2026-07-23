import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"
import AlertModal from "../../components/ui/AlertModal"
import { getIssueById, followUpIssue } from "../../api/issues.api"

function getStatusClass(s) {
  var base = "inline-flex items-center gap-1.5 px-[14px] py-1 rounded-full text-[11px] font-bold border"
  var map = { PENDING: "bg-warning-bg text-warning border-warning/10", VERIFIED: "bg-teal-bg text-teal border-teal/10", IN_PROGRESS: "bg-teal-bg text-teal border-teal/10", COMPLETED: "bg-success-bg text-success border-success/10", REJECTED: "bg-error-bg text-error border-error/10" }
  return base + " " + (map[s] || "bg-warning-bg text-warning")
}
var statusLabel = { PENDING: 'Menunggu', VERIFIED: 'Diverifikasi', IN_PROGRESS: 'Dalam Proses', COMPLETED: 'Selesai', REJECTED: 'Ditolak' }

function formatDate(d) { if (!d) return ''; var p = d.split('T')[0].split('-'), m = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des']; return parseInt(p[2]) + ' ' + m[parseInt(p[1]) - 1] + ' ' + p[0] }

export default function KetuaDetailTindakLanjut() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tanggapan, setTanggapan] = useState('')
  const [status, setStatus] = useState('IN_PROGRESS')
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    getIssueById(id)
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [id])

  var handleSubmit = async (e) => {
    e.preventDefault()
    if (!tanggapan.trim()) return
    setSaving(true)
    try {
      await followUpIssue(id, { tanggapan, status })
      setAlert({ type: 'success', title: 'Berhasil', message: 'Tindak lanjut berhasil dikirim!', onClose: () => { navigate('/tindak-lanjut-laporan') } })
    } catch (err) {
      setAlert({ type: 'error', title: 'Gagal', message: err?.message || 'Terjadi kesalahan' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <DashboardLayout><div className="text-center py-16 text-text-muted">Memuat data...</div></DashboardLayout>
  if (!data) return <DashboardLayout><div className="text-center py-16 text-text-muted">Laporan tidak ditemukan.</div></DashboardLayout>

  return (
    <DashboardLayout>
      <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" onClick={() => navigate('/tindak-lanjut-laporan')}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali ke tindak lanjut laporan
      </button>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="p-8 border-b border-border-subtle">
          <span className={getStatusClass(data.status_laporan)}>{statusLabel[data.status_laporan]}</span>
          <h2 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight mt-2">{data.kategori_kendala}</h2>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-4 pb-8 border-b border-border-subtle">
            <div><div className="text-xs uppercase text-text-muted mb-1">Kategori</div><div className="font-semibold">{data.kategori_kendala}</div></div>
            <div><div className="text-xs uppercase text-text-muted mb-1">Pelapor</div><div className="font-semibold">{data.pelapor}</div></div>
            <div><div className="text-xs uppercase text-text-muted mb-1">Tanggal</div><div className="font-mono text-sm">{formatDate(data.tanggal_lapor)}</div></div>
          </div>

          <div className="py-6 border-b border-border-subtle">
            <span className="text-xs uppercase text-text-muted">Deskripsi</span>
            <p className="text-sm mt-1">{data.deskripsi}</p>
          </div>

          {data.tanggapan && (
            <div className="py-6 border-b border-border-subtle">
              <span className="text-xs uppercase text-text-muted">Tanggapan Sebelumnya</span>
              <p className="text-sm mt-1 bg-bg p-3 rounded-lg">{data.tanggapan}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-6 mt-6">
              <label className="block text-[13px] font-semibold text-text-primary mb-1">Tanggapan / Tindak Lanjut</label>
              <textarea className="w-full px-[14px] py-[10px] font-sans text-sm border rounded-[14px] outline-none" placeholder="Tulis tanggapan..." rows="4" value={tanggapan} onChange={(e) => setTanggapan(e.target.value)} />
            </div>
            <div className="mb-6">
              <label className="block text-[13px] font-semibold text-text-primary mb-1">Update Status</label>
              <select className="w-full px-[14px] py-[10px] font-sans text-sm border rounded-[14px] outline-none" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="IN_PROGRESS">Dalam Proses</option>
                <option value="COMPLETED">Selesai</option>
              </select>
            </div>

            <div className="pt-6 border-t border-border-subtle flex gap-3">
              <button type="button" className="px-7 py-[10px] font-sans text-sm font-semibold rounded-full cursor-pointer bg-bg-hover text-text-secondary border border-border-subtle" onClick={() => navigate('/tindak-lanjut-laporan')}>Kembali</button>
              <button type="submit" className="px-7 py-[10px] font-sans text-sm font-semibold rounded-full cursor-pointer bg-primary text-white" disabled={saving}>
                {saving ? 'Mengirim...' : 'Kirim Tindak Lanjut'}
              </button>
            </div>
          </form>
          </div>
        </div>

      <AlertModal open={!!alert} onClose={() => { const cb = alert?.onClose; setAlert(null); cb?.() }} type={alert?.type} title={alert?.title} message={alert?.message} />
    </DashboardLayout>
  )
}
