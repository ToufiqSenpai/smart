import DashboardLayout from "../../components/layout/DashboardLayout"

function getStatusClass(s) {
  var base = "inline-flex items-center gap-1.5 px-[14px] py-1 rounded-full text-[11px] font-bold border"
  var map = { menunggu: "bg-warning-bg text-warning border-warning/10", diverifikasi: "bg-teal-bg text-teal border-teal/10", proses: "bg-teal-bg text-teal border-teal/10", selesai: "bg-success-bg text-success border-success/10", ditolak: "bg-error-bg text-error border-error/10" }
  return base + " " + (map[s] || map.menunggu)
}

export default function KetuaDetailTindakLanjut() {

  return (
    <DashboardLayout>
      <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" onClick={() => window.history.back()}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali ke tindak lanjut laporan
      </button>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="p-8 border-b border-border-subtle flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className={getStatusClass("diverifikasi")} id="statusBadge">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /></svg>
              Diverifikasi
            </span>
            <h2 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight" id="judul">Laporan Kendala</h2>
            <div className="flex flex-wrap gap-2 gap-x-6 mt-2 text-[13px] text-text-secondary">
              <span>No. Laporan: <span className="font-mono text-xs" id="noLaporan">007/KEND/RT08/VII/2026</span></span>
              <span>•</span>
              <span>Tanggal: <span className="font-mono text-xs" id="tanggalLapor">14 Juli 2026</span></span>
              <span>•</span>
              <span>Oleh: <span id="namaPelapor">Budi Santoso</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{fontSize: "12px", color: "var(--ink-subtle)"}} id="statusInfo">Menunggu tindak lanjut</span>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-border-subtle">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Kategori</div>
              <div className="text-[15px] font-semibold text-text-primary" id="infoKategori">Lampu Jalan Mati</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Pelapor</div>
              <div className="text-[15px] font-semibold text-text-primary" id="infoPelapor">Budi Santoso</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Tanggal Lapor</div>
              <div className="text-[15px] font-semibold text-text-primary font-mono text-sm" id="infoTanggal">14 Juli 2026</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Status</div>
              <div className="text-[15px] font-semibold text-text-primary" id="infoStatus">-</div>
            </div>
          </div>

          <div className="mb-8 pb-8 border-b border-border-subtle">
            <span className="text-[13px] font-semibold text-text-primary mb-2 block">📝 Deskripsi Kendala</span>
            <div className="text-[14.5px] text-text-secondary leading-relaxed bg-bg p-4 rounded-[14px] border border-border-subtle" id="deskripsiText">
              Lampu jalan di depan rumah nomor 12 mati sejak 3 hari lalu. Sangat gelap dan berbahaya bagi pejalan kaki dan pengendara motor di malam hari.
            </div>
          </div>

          <div className="mb-8 pb-8 border-b border-border-subtle">
            <span className="text-[13px] font-semibold text-text-primary mb-3 block">📷 Foto Kendala</span>
            <div className="flex flex-wrap gap-3" id="fotoContainer">
              <div className="w-[150px] h-[150px] rounded-[14px] overflow-hidden border border-border-subtle bg-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-text-muted text-xs p-4 text-center">
                  <svg className="w-8 h-8 text-border-subtle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                  <span>Tidak ada foto</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 pb-8 border-b border-border-subtle" id="tanggapanSection" style={{display: "none"}}>
            <span className="text-[13px] font-semibold text-text-primary mb-2 block">💬 Tanggapan Sebelumnya</span>
            <div className="bg-primary-light border border-primary/12 rounded-[14px] p-4">
              <div className="text-xs text-text-muted mb-1">
                Dari: <strong id="tanggapanPengurus">Bendahara</strong>
                <span>•</span>
                <span className="font-mono text-[11px]" id="tanggapanTanggal">14 Juli 2026</span>
              </div>
              <div className="text-sm text-text-primary leading-relaxed" id="tanggapanText">
                Laporan telah diverifikasi, menunggu penjadwalan perbaikan.
              </div>
            </div>
          </div>

          <div id="formSection">
            <form id="tindakLanjutForm" noValidate>
              <div className="mb-6">
                <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="tanggapanInput">Tanggapan / Tindak Lanjut <span className="font-normal text-text-muted text-xs">(wajib)</span></label>
                <textarea className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="tanggapanInput" placeholder="Tulis tanggapan atau tindak lanjut dari laporan ini..." rows="4" required></textarea>
                <div className="text-xs text-text-muted mt-1">Isi dengan jelas langkah yang akan diambil untuk menangani kendala ini.</div>
                <div className="text-xs text-error mt-1 hidden items-center gap-1.5" id="tanggapanError">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  <span>Tanggapan harus diisi</span>
                </div>
              </div>

              <div className="mb-6" style={{marginBottom: 0}}>
                <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="statusLaporanInput">Update Status</label>
                <select className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="statusLaporanInput" required>
                  <option value="proses">Dalam Proses</option>
                  <option value="selesai">Selesai</option>
                </select>
                <div className="text-xs text-text-muted mt-1">Pilih <strong>Dalam Proses</strong> jika masih ditangani, atau <strong>Selesai</strong> jika sudah selesai.</div>
              </div>

              <input type="hidden" id="editId" value="1" />
            </form>
          </div>

          <div className="pt-6 border-t border-border-subtle flex gap-3 flex-wrap">
            <button className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-bg-hover text-text-secondary border border-border-subtle" onClick={() => window.history.back()}>Kembali</button>
            <button className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-primary text-white" id="submitBtn">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              Kirim Tindak Lanjut
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
