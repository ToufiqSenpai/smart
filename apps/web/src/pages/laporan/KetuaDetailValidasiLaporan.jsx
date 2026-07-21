import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { getIssueById, verifyIssue } from "../../api/issues.api"

const statusMap = {
  PENDING: { cls: "menunggu", label: "Menunggu Validasi" },
  VERIFIED: { cls: "diverifikasi", label: "Diverifikasi" },
  IN_PROGRESS: { cls: "proses", label: "Dalam Proses" },
  COMPLETED: { cls: "selesai", label: "Selesai" },
  REJECTED: { cls: "ditolak", label: "Ditolak" },
}

function getStatusClass(s) {
  var base = "inline-flex items-center gap-1.5 px-[14px] py-1 rounded-full text-[11px] font-bold border"
  var map = { menunggu: "bg-warning-bg text-warning border-warning/10", diverifikasi: "bg-teal-bg text-teal border-teal/10", proses: "bg-teal-bg text-teal border-teal/10", selesai: "bg-success-bg text-success border-success/10", ditolak: "bg-error-bg text-error border-error/10" }
  return base + " " + (map[s] || map.menunggu)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const parts = dateStr.split("T")[0].split("-")
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
  return parseInt(parts[2]) + " " + months[parseInt(parts[1]) - 1] + " " + parts[0]
}

export default function KetuaDetailValidasiLaporan() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    getIssueById(id)
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [id])

  const addToast = (type, title, message) => {
    const toastId = Date.now()
    setToasts((prev) => [...prev, { id: toastId, type, title, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== toastId)), 4000)
  }

  const handleAction = (status) => {
    if (!confirm(`${status === 'VERIFIED' ? 'Validasi' : 'Tolak'} laporan "${data.kategori_kendala}" dari ${data.pelapor}?`)) return
    setActionLoading(true)
    verifyIssue(id, { status })
      .then(() => {
        addToast(status === 'VERIFIED' ? "success" : "error", status === 'VERIFIED' ? "Laporan divalidasi!" : "Laporan ditolak", `Laporan ${data.kategori_kendala} berhasil ${status === 'VERIFIED' ? 'divalidasi' : 'ditolak'}.`)
        setTimeout(() => navigate("/validasi-laporan"), 1500)
      })
      .catch(err => addToast("error", "Gagal", err?.message || "Terjadi kesalahan"))
      .finally(() => setActionLoading(false))
  }

  if (loading) return <DashboardLayout><div className="text-center py-16 text-text-muted">Memuat data...</div></DashboardLayout>
  if (!data) return <DashboardLayout><div className="text-center py-16 text-text-muted">Laporan tidak ditemukan.</div></DashboardLayout>

  const s = statusMap[data.status_laporan] || statusMap.PENDING
  const isPending = data.status_laporan === 'PENDING'

  return (
    <DashboardLayout>
      <div className="fixed bottom-8 right-8 z-[1000] flex flex-col gap-3 max-w-[360px]" style={{width: "calc(100% - 64px)"}}>
        {toasts.map((t) => (
          <div key={t.id} className={`flex items-start gap-4 p-5 bg-bg-card rounded-[14px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-border-subtle ${t.type === "success" ? "border-t-success border-t-3" : "border-t-error border-t-3"}`}>
            {t.type === "success" ? (
              <svg className="w-4 h-4 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-4" /></svg>
            ) : (
              <svg className="w-4 h-4 text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            )}
            <div className="flex-1 text-[13px]">
              <div className="font-bold text-text-primary mb-0.5">{t.title}</div>
              <div className="text-text-secondary">{t.message}</div>
            </div>
            <button className="bg-transparent border-none text-text-muted cursor-pointer p-0.5 flex rounded-full hover:text-text-primary" onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        ))}
      </div>

      <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" onClick={() => navigate("/validasi-laporan")}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali ke validasi laporan
      </button>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="p-8 border-b border-border-subtle flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className={getStatusClass(s.cls)}>{s.label}</span>
            <h2 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight mt-2">Laporan {data.kategori_kendala}</h2>
            <div className="flex flex-wrap gap-2 gap-x-6 mt-2 text-[13px] text-text-secondary">
              <span>Tanggal: <span className="font-mono text-xs">{formatDate(data.tanggal_lapor)}</span></span>
              <span>&bull;</span>
              <span>Oleh: <span>{data.pelapor}</span></span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-border-subtle">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Kategori</div>
              <div className="text-[15px] font-semibold text-text-primary">{data.kategori_kendala}</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Pelapor</div>
              <div className="text-[15px] font-semibold text-text-primary">{data.pelapor}</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Tanggal Lapor</div>
              <div className="text-[15px] font-semibold text-text-primary font-mono text-sm">{formatDate(data.tanggal_lapor)}</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Status</div>
              <span className={getStatusClass(s.cls)}>{s.label}</span>
            </div>
          </div>

          <div className="mb-8 pb-8 border-b border-border-subtle">
            <span className="text-[13px] font-semibold text-text-primary mb-2 block">Deskripsi Kendala</span>
            <div className="text-[14.5px] text-text-secondary leading-relaxed bg-bg p-4 rounded-[14px] border border-border-subtle">{data.deskripsi}</div>
          </div>

          {data.tanggapan && (
            <div className="mb-8 pb-8 border-b border-border-subtle">
              <span className="text-[13px] font-semibold text-text-primary mb-2 block">Tanggapan</span>
              <div className="text-[14.5px] text-text-secondary leading-relaxed bg-bg p-4 rounded-[14px] border border-border-subtle">{data.tanggapan}</div>
            </div>
          )}

          <div className="pt-6 border-t border-border-subtle flex gap-3 flex-wrap">
            <button className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-bg-hover text-text-secondary border border-border-subtle" onClick={() => navigate("/validasi-laporan")}>Kembali</button>
            {isPending && (
              <>
                <button className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-error text-white" onClick={() => handleAction('REJECTED')} disabled={actionLoading}>Tolak Laporan</button>
                <button className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-success text-white" onClick={() => handleAction('VERIFIED')} disabled={actionLoading}>
                  {actionLoading ? "Memproses..." : "Validasi Laporan"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
