import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"
import AlertModal from "../../components/ui/AlertModal"
import ConfirmModal from "../../components/ui/ConfirmModal"
import { getBusinessById, validateBusiness } from "../../api/businesses.api"

const statusMap = {
  PENDING: { cls: "menunggu", label: "Menunggu Validasi" },
  VERIFIED: { cls: "terverifikasi", label: "Terverifikasi" },
  REJECTED: { cls: "ditolak", label: "Ditolak" },
}

function getStatusClass(s) {
  var base = "inline-flex items-center gap-1.5 px-[14px] py-1 rounded-full text-[11px] font-bold border"
  var map = { menunggu: "bg-warning-bg text-warning border-warning/10", terverifikasi: "bg-success-bg text-success border-success/10", ditolak: "bg-error-bg text-error border-error/10" }
  return base + " " + (map[s] || map.menunggu)
}

export default function KetuaDetailValidasiUMKM() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [alert, setAlert] = useState(null)
  const [confirm, setConfirm] = useState(null)

  useEffect(() => {
    getBusinessById(id)
      .then(res => setData(res.data))
      .catch(err => setAlert({ type: 'error', title: 'Gagal', message: err?.message || 'Data UMKM tidak ditemukan' }))
      .finally(() => setLoading(false))
  }, [id])

  const handleAction = (status) => {
    setConfirm({ status })
  }

  const handleConfirm = () => {
    if (!confirm) return
    setActionLoading(true)
    validateBusiness(id, { status: confirm.status })
      .then(() => {
        setConfirm(null)
        setAlert({ type: 'success', title: confirm.status === 'VERIFIED' ? 'UMKM divalidasi!' : 'UMKM ditolak', message: `UMKM ${data.nama_usaha} berhasil ${confirm.status === 'VERIFIED' ? 'divalidasi' : 'ditolak'}.`, onClose: () => { navigate("/validasi-umkm") } })
      })
      .catch(err => setAlert({ type: 'error', title: 'Gagal', message: err?.message || 'Gagal memperbarui status' }))
      .finally(() => setActionLoading(false))
  }

  const handleValidasi = () => handleAction('VERIFIED')
  const handleTolak = () => handleAction('REJECTED')

  if (loading) {
    return <DashboardLayout><div className="text-center py-16 text-text-muted">Memuat data...</div></DashboardLayout>
  }

  if (!data) {
    return (
      <DashboardLayout>
        <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" onClick={() => navigate("/validasi-umkm")}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Kembali ke validasi UMKM
        </button>
        <div className="text-center py-16 text-text-muted">UMKM tidak ditemukan.</div>
      </DashboardLayout>
    )
  }

  const s = statusMap[data.status_verifikasi] || statusMap.PENDING
  const isPending = data.status_verifikasi === 'PENDING'

  return (
    <DashboardLayout>
      <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" onClick={() => navigate("/validasi-umkm")}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali ke validasi UMKM
      </button>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="p-8 border-b border-border-subtle flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className={getStatusClass(s.cls)}>
              {isPending ? (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 14" /></svg>
              ) : data.status_verifikasi === 'VERIFIED' ? (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /></svg>
              ) : (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
              )}
              {s.label}
            </span>
            <h2 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight mt-2">{data.nama_usaha}</h2>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Nama Usaha</div>
              <div className="text-[15px] font-semibold text-text-primary">{data.nama_usaha}</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Pemilik</div>
              <div className="text-[15px] font-semibold text-text-primary">{data.pemilik}</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Jenis</div>
              <div className="text-[15px] font-semibold text-text-primary">{data.jenis_usaha}</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Kontak</div>
              <div className="text-[15px] font-semibold text-text-primary">{data.kontak_usaha}</div>
            </div>
            <div className="col-span-2">
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Alamat</div>
              <div className="text-[15px] font-semibold text-text-primary">{data.alamat_usaha}</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Status</div>
              <div className="text-[15px] font-semibold text-text-primary">
                <span className={getStatusClass(s.cls)}>{s.label}</span>
              </div>
            </div>
          </div>

          <div className="pb-8 border-b border-border-subtle">
            <span className="text-[13px] font-semibold text-text-primary mb-2 block">Deskripsi Usaha</span>
            <div className="text-[14.5px] text-text-secondary leading-relaxed bg-bg p-4 rounded-[14px] border border-border-subtle">{data.deskripsi_usaha}</div>
          </div>

          <div className="pt-6 flex gap-3 flex-wrap">
            <button className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-bg-hover text-text-secondary border border-border-subtle" onClick={() => navigate("/validasi-umkm")}>Kembali</button>
            {isPending && (
              <>
                <button className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-error text-white" onClick={handleTolak} disabled={actionLoading}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
                  Tolak
                </button>
                <button className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-success text-white" onClick={handleValidasi} disabled={actionLoading}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /></svg>
                  {actionLoading ? "Memproses..." : "Validasi"}
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
        title={confirm?.status === 'VERIFIED' ? 'Validasi UMKM' : 'Tolak UMKM'}
        message={confirm ? `${confirm.status === 'VERIFIED' ? 'Validasi' : 'Tolak'} UMKM "${data?.nama_usaha}" milik ${data?.pemilik}?` : ''}
        confirmText={confirm?.status === 'VERIFIED' ? 'Ya, Validasi' : 'Ya, Tolak'}
        variant={confirm?.status === 'VERIFIED' ? 'success' : 'danger'}
      />

      <AlertModal open={!!alert} onClose={() => { const cb = alert?.onClose; setAlert(null); cb?.() }} type={alert?.type} title={alert?.title} message={alert?.message} />
    </DashboardLayout>
  )
}
