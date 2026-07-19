import DashboardLayout from "../../components/layout/DashboardLayout"

export default function WargaLihatUMKM() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Layanan UMKM</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Daftar UMKM RT 08</h1>
        <p className="text-[14.5px] text-text-muted">Temukan dan jelajahi usaha warga sekitar yang telah terverifikasi.</p>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-[20px] p-4 px-6 flex items-center gap-4 flex-wrap mb-8 shadow-lux">
        <div className="flex-1 min-w-[200px] relative" style={{ flex: 1 }}>
          <svg className="icon absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
          <input type="text" placeholder="Cari nama usaha atau jenis..." className="w-full py-2 pl-[38px] pr-3 font-sans text-[13.5px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] transition-all focus:border-primary focus:ring-3 focus:ring-primary-light" />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="jenisFilter" className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.05em]">Jenis</label>
          <select id="jenisFilter" className="py-1.5 pl-[14px] pr-8 font-sans text-[13px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] appearance-none cursor-pointer transition-all focus:border-primary focus:ring-3 focus:ring-primary-light" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717A' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
            <option value="all">Semua</option>
            <option value="Kuliner">Kuliner</option>
            <option value="Fashion">Fashion</option>
            <option value="Kerajinan">Kerajinan</option>
            <option value="Jasa">Jasa</option>
            <option value="Perdagangan">Perdagangan</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
        <span className="text-[12px] font-semibold text-text-muted bg-bg px-[14px] py-1 rounded-full border border-border-subtle whitespace-nowrap">5 UMKM</span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        <div className="col-span-full text-center py-16 px-6 text-text-muted bg-bg-card rounded-[20px] border border-border-subtle">
          <svg className="w-14 h-14 text-border-subtle mb-4 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21h16" /><path d="M6 21V8.5a3.5 3.5 0 0 1 7 0V21" /><path d="M18 21v-6a4 4 0 0 0-4-4h-2" /><path d="M10 11h2" /></svg>
          <h3 className="font-grotesk text-[20px] font-bold text-text-primary mb-2">Belum ada UMKM terverifikasi</h3>
          <p className="text-[14px]">Belum ada UMKM yang terdaftar di RT 08.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
