import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { getIssueById } from "../../api/issues.api"

function getStatusClass(s) {
  var base = "inline-flex items-center gap-1.5 px-[14px] py-1 rounded-full text-[11px] font-bold border"
  var map = { PENDING: "bg-warning-bg text-warning border-warning/10", VERIFIED: "bg-teal-bg text-teal border-teal/10", IN_PROGRESS: "bg-teal-bg text-teal border-teal/10", COMPLETED: "bg-success-bg text-success border-success/10", REJECTED: "bg-error-bg text-error border-error/10" }
  return base + " " + (map[s] || "bg-warning-bg text-warning")
}
var labels = { PENDING: 'Menunggu', VERIFIED: 'Diverifikasi', IN_PROGRESS: 'Dalam Proses', COMPLETED: 'Selesai', REJECTED: 'Ditolak' }

export default function WargaDetailLaporan() {
  var { id } = useParams()
  var navigate = useNavigate()
  var [data, setData] = useState(null)
  var [loading, setLoading] = useState(true)

  useEffect(() => {
    getIssueById(id).then(r => setData(r.data)).catch(() => setData(null)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <DashboardLayout><div className="text-center py-16 text-text-muted">Memuat data...</div></DashboardLayout>
  if (!data) return <DashboardLayout><div className="text-center py-16 text-text-muted">Laporan tidak ditemukan.</div></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="max-w-[900px]">
        <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" onClick={() => navigate('/monitoring-laporan')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          Kembali ke daftar laporan
        </button>

        <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
          <div className="p-8 border-b border-border-subtle flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className={getStatusClass(data.status_laporan)}>{labels[data.status_laporan]}</span>
              <h2 className="font-grotesk text-2xl font-bold text-text-primary mt-2">{data.kategori_kendala}</h2>
              <p className="text-sm text-text-secondary mt-1">Dilaporkan: {data.tanggal_lapor?.split('T')[0]}</p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div><span className="text-xs uppercase text-text-muted font-semibold">Deskripsi</span><p className="bg-bg p-4 rounded-lg mt-2 text-sm">{data.deskripsi}</p></div>
            {data.tanggapan && <div><span className="text-xs uppercase text-text-muted font-semibold">Tanggapan Pengurus</span><p className="bg-bg p-4 rounded-lg mt-2 text-sm">{data.tanggapan}</p></div>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
