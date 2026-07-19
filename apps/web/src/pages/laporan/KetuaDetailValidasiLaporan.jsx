import { useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"

const laporanData = {
  id: 1,
  kategori: "Lampu Jalan Mati",
  pelapor: "Budi Santoso",
  deskripsi: "Lampu jalan di depan rumah nomor 12 mati sejak 3 hari lalu. Sangat gelap dan berbahaya bagi pejalan kaki dan pengendara motor di malam hari.",
  tanggal: "2026-07-14",
  status: "menunggu",
  foto: null,
}

function formatDate(dateStr) {
  const parts = dateStr.split("-")
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
  return parseInt(parts[2]) + " " + months[parseInt(parts[1]) - 1] + " " + parts[0]
}

const statusMap = {
  menunggu: { cls: "menunggu", label: "Menunggu Validasi" },
  diverifikasi: { cls: "diverifikasi", label: "Diverifikasi" },
  proses: { cls: "proses", label: "Dalam Proses" },
  selesai: { cls: "selesai", label: "Selesai" },
  ditolak: { cls: "ditolak", label: "Ditolak" },
}

function getStatusClass(s) {
  var base = "inline-flex items-center gap-1.5 px-[14px] py-1 rounded-full text-[11px] font-bold border"
  var map = { menunggu: "bg-warning-bg text-warning border-warning/10", diverifikasi: "bg-teal-bg text-teal border-teal/10", proses: "bg-teal-bg text-teal border-teal/10", selesai: "bg-success-bg text-success border-success/10", ditolak: "bg-error-bg text-error border-error/10" }
  return base + " " + (map[s] || map.menunggu)
}

export default function KetuaDetailValidasiLaporan() {
  const navigate = useNavigate()
  const [status, setStatus] = useState(laporanData.status)
  const [toasts, setToasts] = useState([])

  const addToast = (type, title, message) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, type, title, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  const handleValidasi = () => {
    if (confirm('Validasi laporan "' + laporanData.kategori + '" dari ' + laporanData.pelapor + "?")) {
      setStatus("diverifikasi")
      addToast("success", "Laporan divalidasi!", "Laporan " + laporanData.kategori + " berhasil divalidasi.")
      setTimeout(() => navigate("/ketua/validasi-laporan"), 1500)
    }
  }

  const handleTolak = () => {
    if (confirm('Tolak laporan "' + laporanData.kategori + '" dari ' + laporanData.pelapor + "?")) {
      setStatus("ditolak")
      addToast("error", "Laporan ditolak", "Laporan " + laporanData.kategori + " telah ditolak.")
      setTimeout(() => navigate("/ketua/validasi-laporan"), 1500)
    }
  }

  const s = statusMap[status] || statusMap.menunggu

  return (
    <DashboardLayout>
      <div className="fixed bottom-8 right-8 z-[1000] flex flex-col gap-3 max-w-[360px]" style={{width: "calc(100% - 64px)"}}>
        {toasts.map((t) => (
          <div key={t.id} className={`flex items-start gap-4 p-5 bg-bg-card rounded-[14px] shadow-[0_20px_40px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.02)] border border-border-subtle animate-[slideInUp_0.3s_cubic-bezier(0.16,1,0.3,1)] ${t.type === "success" ? "border-t-success border-t-3" : "border-t-error border-t-3"}`}>
            {t.type === "success" ? (
              <svg className="w-4 h-4 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-4" /></svg>
            ) : (
              <svg className="w-4 h-4 text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            )}
            <div className="flex-1 text-[13px]">
              <div className="font-bold text-text-primary mb-0.5">{t.title}</div>
              <div className="text-text-secondary">{t.message}</div>
            </div>
            <button className="bg-transparent border-none text-text-muted cursor-pointer p-0.5 flex rounded-full hover:text-text-primary hover:bg-bg-hover transition-all" onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        ))}
      </div>

      <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" onClick={() => navigate("/ketua/validasi-laporan")}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali ke validasi laporan
      </button>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="p-8 border-b border-border-subtle flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className={getStatusClass(s.cls)}>
              {status === "menunggu" ? (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 14" /></svg>
              ) : status === "diverifikasi" || status === "selesai" ? (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /></svg>
              ) : (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
              )}
              {s.label}
            </span>
            <h2 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight">Laporan {laporanData.kategori}</h2>
            <div className="flex flex-wrap gap-2 gap-x-6 mt-2 text-[13px] text-text-secondary">
              <span>Tanggal: <span className="font-mono text-xs">{formatDate(laporanData.tanggal)}</span></span>
              <span>&bull;</span>
              <span>Oleh: <span>{laporanData.pelapor}</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{ fontSize: "12px", color: "var(--ink-subtle)" }}>{s.label}</span>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-border-subtle">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Kategori</div>
              <div className="text-[15px] font-semibold text-text-primary">{laporanData.kategori}</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Pelapor</div>
              <div className="text-[15px] font-semibold text-text-primary">{laporanData.pelapor}</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Tanggal Lapor</div>
              <div className="text-[15px] font-semibold text-text-primary font-mono text-sm">{formatDate(laporanData.tanggal)}</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Status</div>
              <div className="text-[15px] font-semibold text-text-primary">
                <span className={getStatusClass(s.cls)}>
                  {status === "diverifikasi" || status === "selesai" ? (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /></svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 14" /></svg>
                  )}
                  {s.label}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8 pb-8 border-b border-border-subtle">
            <span className="text-[13px] font-semibold text-text-primary mb-2 block">&#x1F4DD; Deskripsi Kendala</span>
            <div className="text-[14.5px] text-text-secondary leading-relaxed bg-bg p-4 rounded-[14px] border border-border-subtle">{laporanData.deskripsi}</div>
          </div>

          <div className="mb-8">
            <span className="text-[13px] font-semibold text-text-primary mb-3 block">&#x1F4F7; Foto Kendala</span>
            <div className="flex flex-wrap gap-3">
              <div className="w-[150px] h-[150px] rounded-[14px] overflow-hidden border border-border-subtle bg-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-text-muted text-xs p-4 text-center">
                  <svg className="w-8 h-8 text-border-subtle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                  <span>Tidak ada foto</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border-subtle flex gap-3 flex-wrap" id="actionSection">
            <button className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-bg-hover text-text-secondary border border-border-subtle" onClick={() => navigate("/ketua/validasi-laporan")}>Kembali</button>
            {status === "menunggu" && (
              <>
                <button className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-error text-white" onClick={handleTolak}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
                  Tolak Laporan
                </button>
                <button className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-success text-white" onClick={handleValidasi}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /></svg>
                  Validasi Laporan
                </button>
              </>
            )}
          </div>
        </div>
      </div>

    </DashboardLayout>
  )
}
