import DashboardLayout from "../../components/layout/DashboardLayout"

export default function WargaTambahUMKM() {
  return (
    <DashboardLayout>
      <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali ke UMKM Saya
      </button>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-10">
        <div className="mb-8 pb-6 border-b border-border-subtle">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-1">Tambah Data</p>
          <h2 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight">Tambah UMKM</h2>
          <p className="text-sm text-text-secondary mt-1">Isi data usaha Anda dengan lengkap. Setelah disimpan, UMKM akan diverifikasi oleh Pengurus RT.</p>
        </div>

        <form noValidate>
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="namaUsaha">Nama Usaha</label>
            <input type="text" className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="namaUsaha" placeholder="Contoh: Warung Makan Sari" required />
            <div className="text-xs text-error mt-1 hidden items-center gap-1.5" id="namaUsahaError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Nama usaha harus diisi</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="jenisUsaha">Jenis Usaha</label>
            <select className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="jenisUsaha" required>
              <option value="">-- Pilih Jenis --</option>
              <option value="Kuliner">Kuliner</option>
              <option value="Fashion">Fashion</option>
              <option value="Kerajinan">Kerajinan</option>
              <option value="Jasa">Jasa</option>
              <option value="Perdagangan">Perdagangan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            <div className="text-xs text-error mt-1 hidden items-center gap-1.5" id="jenisUsahaError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Jenis usaha harus dipilih</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="deskripsiUsaha">Deskripsi Usaha</label>
            <textarea className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="deskripsiUsaha" placeholder="Jelaskan usaha Anda secara singkat..." rows="4" required></textarea>
            <div className="text-xs text-error mt-1 hidden items-center gap-1.5" id="deskripsiUsahaError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Deskripsi harus diisi</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="alamatUsaha">Alamat Usaha</label>
            <input type="text" className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="alamatUsaha" placeholder="Contoh: Jl. Mawar No. 12, RT 08/RW 03" required />
            <div className="text-xs text-error mt-1 hidden items-center gap-1.5" id="alamatUsahaError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Alamat harus diisi</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="kontakUsaha">Kontak Usaha</label>
            <input type="text" className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="kontakUsaha" placeholder="Contoh: 081234567890 atau @warungsari" required />
            <div className="text-xs text-text-muted mt-1">Nomor WhatsApp atau media sosial yang bisa dihubungi.</div>
            <div className="text-xs text-error mt-1 hidden items-center gap-1.5" id="kontakUsahaError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Kontak harus diisi</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1">Foto Usaha</label>
            <div className="border-2 border-dashed border-border-subtle rounded-[14px] p-8 text-center cursor-pointer hover:border-primary hover:bg-primary-light transition-all relative">
              <svg className="w-10 h-10 text-text-muted mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
              <p className="text-sm text-text-secondary">Klik untuk upload foto usaha</p>
              <span className="text-xs text-text-muted">Format JPG/PNG, max 2MB</span>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
            </div>
            <div className="mt-4 hidden">
              <div className="flex items-center gap-4 px-4 py-3 bg-bg rounded-[14px] border border-border-subtle">
                <img className="w-[60px] h-[60px] rounded-[14px] object-cover bg-bg border border-border-subtle" src="" alt="Preview" />
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-text-primary">foto-usaha.jpg</div>
                  <div className="text-xs text-text-muted">0 KB</div>
                </div>
                <button type="button" className="bg-none border-none text-error cursor-pointer p-1.5 flex rounded-full hover:bg-error-bg transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-border-subtle">
            <button type="button" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-bg-hover text-text-secondary border border-border-subtle">Batal</button>
            <button type="submit" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-primary text-white">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              Simpan
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
