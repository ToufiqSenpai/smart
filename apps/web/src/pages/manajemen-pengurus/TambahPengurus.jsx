import DashboardLayout from "../../components/layout/DashboardLayout"

var wargaOptions = [
  { id: 1, nama: 'Budi Santoso', nik: '3275010101010001' },
  { id: 2, nama: 'Ani Wijaya', nik: '3275010101010002' },
  { id: 3, nama: 'Siti Rahayu', nik: '3275010101010003' },
  { id: 4, nama: 'Joko Prasetyo', nik: '3275010101010004' },
  { id: 5, nama: 'Eko Prabowo', nik: '3275010101010005' },
  { id: 6, nama: 'Dewi Lestari', nik: '3275010101010006' },
  { id: 7, nama: 'Agus Saputra', nik: '3275010101010007' },
  { id: 8, nama: 'Rina Marlina', nik: '3275010101010008' },
  { id: 9, nama: 'Hendra Gunawan', nik: '3275010101010009' },
  { id: 10, nama: 'Fitri Handayani', nik: '3275010101010010' },
]

var jabatanOptions = [
  { value: 'Ketua RT', label: 'Ketua RT' },
  { value: 'Wakil Ketua', label: 'Wakil Ketua' },
  { value: 'Sekretaris', label: 'Sekretaris' },
  { value: 'Bendahara', label: 'Bendahara' },
  { value: 'Sie Keamanan', label: 'Sie Keamanan' },
  { value: 'Sie Kebersihan', label: 'Sie Kebersihan' },
  { value: 'Sie Sosial', label: 'Sie Sosial' },
  { value: 'Sie Olahraga', label: 'Sie Olahraga' },
]

export default function TambahPengurus() {
  return (
    <DashboardLayout>
      <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" onClick={() => window.history.back()}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali ke daftar pengurus
      </button>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-10">
        <div className="mb-8 pb-6 border-b border-border-subtle">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-1">Tambah Data</p>
          <h2 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight">Tambah Pengurus RT</h2>
          <p className="text-sm text-text-secondary mt-1">Tambahkan pengurus baru untuk kepengurusan RT 08.</p>
        </div>

        <form id="pengurusForm" noValidate>
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="wargaSelect">Pilih Warga</label>
            <select className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="wargaSelect" required>
              <option value="">-- Pilih Warga --</option>
              {wargaOptions.map(function(w) {
                return <option key={w.id} value={w.id}>{w.nama} - {w.nik}</option>
              })}
            </select>
            <div className="text-xs text-text-muted mt-1">Pilih warga yang akan diangkat sebagai pengurus.</div>
            <div className="text-xs text-error mt-1 hidden items-center gap-1.5" id="wargaError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Warga harus dipilih</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="jabatanSelect">Jabatan</label>
            <select className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="jabatanSelect" required>
              <option value="">-- Pilih Jabatan --</option>
              {jabatanOptions.map(function(j, i) {
                return <option key={i} value={j.value}>{j.label}</option>
              })}
            </select>
            <div className="text-xs text-text-muted mt-1">Jabatan yang akan diemban oleh pengurus.</div>
            <div className="text-xs text-error mt-1 hidden items-center gap-1.5" id="jabatanError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Jabatan harus dipilih</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="periodeInput">Periode Jabatan</label>
            <input type="text" className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="periodeInput" placeholder="Contoh: 2026-2028" required />
            <div className="text-xs text-text-muted mt-1">Masukkan periode jabatan (contoh: 2026-2028).</div>
            <div className="text-xs text-error mt-1 hidden items-center gap-1.5" id="periodeError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Periode harus diisi</span>
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
