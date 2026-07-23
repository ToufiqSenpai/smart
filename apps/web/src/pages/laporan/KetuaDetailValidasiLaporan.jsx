import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"
import AlertModal from "../../components/ui/AlertModal"
import ConfirmModal from "../../components/ui/ConfirmModal"
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
  const [alert, setAlert] = useState(null)
  const [confirm, setConfirm] = useState(null)

  useEffect(() => {
    getIssueById(id)
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleAction = (status) => {
    setConfirm({ status })
  }

  const handleConfirm = () => {
    if (!confirm) return
    setActionLoading(true)
    verifyIssue(id, { status: confirm.status })
      .then(() => {
        setConfirm(null)
        setAlert({ type: 'success', title: confirm.status === 'VERIFIED' ? 'Laporan divalidasi!' : 'Laporan ditolak', message: `Laporan ${data.kategori_kendala} berhasil ${confirm.status === 'VERIFIED' ? 'divalidasi' : 'ditolak'}.`, onClose: () => { navigate("/validasi-laporan") } })
      })
      .catch(err => setAlert({ type: 'error', title: 'Gagal', message: err?.message || 'Terjadi kesalahan' }))
      .finally(() => setActionLoading(false))
  }

  if (loading) return <DashboardLayout><div className="text-center py-16 text-text-muted">Memuat data...</div></DashboardLayout>
  if (!data) return <DashboardLayout><div className="text-center py-16 text-text-muted">Laporan tidak ditemukan.</div></DashboardLayout>

  const s = statusMap[data.status_laporan] || statusMap.PENDING
  const isPending = data.status_laporan === 'PENDING'

  return (
    <DashboardLayout>
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

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleConfirm}
        title={confirm?.status === 'VERIFIED' ? 'Validasi Laporan' : 'Tolak Laporan'}
        message={confirm ? `${confirm.status === 'VERIFIED' ? 'Validasi' : 'Tolak'} laporan "${data?.kategori_kendala}" dari ${data?.pelapor}?` : ''}
        confirmText={confirm?.status === 'VERIFIED' ? 'Ya, Validasi' : 'Ya, Tolak'}
        variant={confirm?.status === 'VERIFIED' ? 'success' : 'danger'}
      />

      <AlertModal open={!!alert} onClose={() => { const cb = alert?.onClose; setAlert(null); cb?.() }} type={alert?.type} title={alert?.title} message={alert?.message} />
    </DashboardLayout>
  )
}
