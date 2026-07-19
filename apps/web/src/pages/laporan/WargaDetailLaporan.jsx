import DashboardLayout from "../../components/layout/DashboardLayout"

function getStatusClass(s) {
  var base = "inline-flex items-center gap-1.5 px-[14px] py-1 rounded-full text-[11px] font-bold border"
  var map = { menunggu: "bg-warning-bg text-warning border-warning/10", diverifikasi: "bg-teal-bg text-teal border-teal/10", proses: "bg-teal-bg text-teal border-teal/10", selesai: "bg-success-bg text-success border-success/10", ditolak: "bg-error-bg text-error border-error/10" }
  return base + " " + (map[s] || map.menunggu)
}

export default function WargaDetailLaporan() {
  return (
    <DashboardLayout>
      <div className="max-w-[900px]">
        <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" onClick={() => window.history.back()}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Kembali ke daftar laporan
        </button>

        <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
          <div className="p-8 border-b border-border-subtle flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className={getStatusClass("menunggu")}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 14" /></svg>
                Menunggu
              </span>
              <h2 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight">Lampu Jalan Mati</h2>
              <div className="flex flex-wrap gap-2 gap-x-6 mt-2 text-[13px] text-text-secondary">
                <span>No. Laporan: <span className="font-mono text-xs">007/KEND/RT08/VII/2026</span></span>
                <span>•</span>
                <span>Tanggal: <span className="font-mono text-xs">14 Juli 2026</span></span>
                <span>•</span>
                <span>Oleh: <span>Budi Santoso</span></span>
              </div>
            </div>
            <div>
              <button style={{ display: "inline-flex", minHeight: 36, padding: "6px 16px", fontSize: 12, alignItems: "center", gap: 8, border: "none", borderRadius: "var(--radius-pill)", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, background: "var(--navy-brand)", color: "var(--white)" }}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                Edit Laporan
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <div className="font-grotesk text-sm font-bold text-text-primary tracking-tight mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                Deskripsi Kendala
              </div>
              <div className="text-[14.5px] text-text-secondary leading-relaxed bg-bg p-4 rounded-[14px] border border-border-subtle">
                Lampu jalan di depan rumah nomor 12 mati sejak 3 hari lalu. Sangat gelap dan berbahaya bagi pejalan kaki dan pengendara motor di malam hari.
              </div>
            </div>

            <div className="mb-8">
              <div className="font-grotesk text-sm font-bold text-text-primary tracking-tight mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                Foto Kendala
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                <div className="w-[120px] h-[120px] rounded-[14px] overflow-hidden border border-border-subtle bg-bg flex items-center justify-center cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lux-hover hover:border-border-hover">
                  <div className="flex flex-col items-center gap-1 text-text-muted text-[11px]">
                    <svg className="w-7 h-7 text-border-subtle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                    <span>Tidak ada foto</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="font-grotesk text-sm font-bold text-text-primary tracking-tight mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                Tanggapan Pengurus
              </div>
              <div className="bg-primary-light border border-primary/12 rounded-[14px] p-5 mt-2">
                <div className="flex items-center gap-2 mb-2 text-xs text-text-muted">
                  <span>Dari: <strong>-</strong></span>
                  <span>•</span>
                  <span className="font-mono text-[11px]">-</span>
                </div>
                <div className="text-sm text-text-primary leading-relaxed">
                  <span className="text-[13px] text-text-muted italic">Belum ada tanggapan dari pengurus.</span>
                </div>
              </div>
            </div>

            <div className="mb-0">
              <div className="font-grotesk text-sm font-bold text-text-primary tracking-tight mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 14" /></svg>
                Riwayat Status
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 px-4 py-2 bg-bg rounded-lg border border-border-subtle text-[13px]">
                  <span className="w-2 h-2 rounded-full bg-warning flex-shrink-0" />
                  <span className="flex-1 text-text-secondary"><strong className="text-text-primary">Laporan dibuat</strong></span>
                  <span className="font-mono text-[11px] text-text-muted">14 Jul 2026, 08:30</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
