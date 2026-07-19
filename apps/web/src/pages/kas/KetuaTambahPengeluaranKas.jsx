import DashboardLayout from "../../components/layout/DashboardLayout"

export default function KetuaTambahPengeluaranKas() {
  return (
    <DashboardLayout>
      <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" onClick={() => window.history.back()}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali ke daftar pengeluaran
      </button>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-10">
        <div className="mb-8 pb-6 border-b border-border-subtle">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-1">Tambah Data</p>
          <h2 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight">Tambah Pengeluaran Kas</h2>
          <p className="text-sm text-text-secondary mt-1">Catat pengeluaran kas RT 08 dengan melengkapi data di bawah ini.</p>
        </div>

        <form id="pengeluaranForm" noValidate>
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="kategoriInput">Kategori Pengeluaran</label>
            <select className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="kategoriInput" required>
              <option value="">-- Pilih Kategori --</option>
              <option value="Operasional">Operasional</option>
              <option value="Kegiatan">Kegiatan</option>
              <option value="Kebersihan">Kebersihan</option>
              <option value="Keamanan">Keamanan</option>
              <option value="Sosial">Sosial</option>
              <option value="Perbaikan">Perbaikan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            <div className="text-xs text-error mt-1 hidden items-center gap-1.5" id="kategoriError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Kategori harus dipilih</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="nominalInput">Nominal <span className="font-normal text-text-muted text-xs">(Rp)</span></label>
            <input type="text" className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="nominalInput" placeholder="Contoh: 500000" required />
            <div className="text-xs text-text-muted mt-1">Masukkan nominal tanpa titik atau koma (contoh: 500000)</div>
            <div className="text-xs text-error mt-1 hidden items-center gap-1.5" id="nominalError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Nominal harus diisi (angka)</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="tanggalInput">Tanggal Pengeluaran</label>
            <input type="date" className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="tanggalInput" required />
            <div className="text-xs text-error mt-1 hidden items-center gap-1.5" id="tanggalError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Tanggal harus diisi</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="keteranganInput">Keterangan</label>
            <textarea className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="keteranganInput" placeholder="Deskripsi pengeluaran..." rows="4" required></textarea>
            <div className="text-xs text-text-muted mt-1">Jelaskan detail pengeluaran dengan jelas.</div>
            <div className="text-xs text-error mt-1 hidden items-center gap-1.5" id="keteranganError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Keterangan harus diisi</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1">Bukti Nota <span className="font-normal text-text-muted text-xs">(opsional)</span></label>
            <div className="border-2 border-dashed border-border-subtle rounded-[14px] p-6 text-center cursor-pointer hover:border-primary hover:bg-primary-light transition-all relative" id="uploadArea">
              <svg className="w-10 h-10 text-text-muted mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
              <p className="text-sm text-text-secondary">Klik untuk upload bukti nota</p>
              <span className="text-xs text-text-muted">Format JPG/PNG/PDF, max 2MB</span>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" id="buktiInput" accept="image/*,application/pdf" />
            </div>
            <div className="mt-4 hidden" id="previewArea">
              <div className="flex items-center gap-3 px-4 py-3 bg-bg rounded-[14px] border border-border-subtle">
                <svg className="w-8 h-8 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-text-primary" id="previewName">nota.pdf</div>
                  <div className="text-xs text-text-muted" id="previewSize">0 KB</div>
                </div>
                <button type="button" className="bg-none border-none text-error cursor-pointer p-1 flex rounded-full hover:bg-error-bg transition-all" id="removeBukti">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-border-subtle">
            <button type="button" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-bg-hover text-text-secondary border border-border-subtle" onClick={() => window.history.back()}>Batal</button>
            <button type="submit" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-primary text-white" id="submitBtn">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              Simpan
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
