import DashboardLayout from "../../components/layout/DashboardLayout"

export default function WargaPembayaranIuran() {
  return (
    <DashboardLayout>
      <div className="max-w-[820px]">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Pembayaran Iuran</p>
          <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Kirim Pembayaran</h1>
          <p className="text-[14.5px] text-text-muted">Pilih iuran yang ingin dibayar dan upload bukti transfer.</p>
        </div>

        <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-10 px-12">
          <div className="mb-8 pb-6 border-b border-border-subtle">
            <h2 className="font-grotesk text-[22px] font-bold text-text-primary tracking-tight">Pilih Tagihan</h2>
            <p className="text-[14px] text-text-muted mt-1">Pilih salah satu iuran yang belum dibayar di bawah ini.</p>
          </div>

          <form id="paymentForm" noValidate>
            <div className="mb-8" id="tagihanList">
              <div className="flex items-center justify-between p-4 px-5 border border-primary bg-primary-light border-[1.5px] rounded-[12px] mb-3 cursor-pointer bg-bg-card transition-all">
                <div className="flex flex-col gap-1">
                  <div className="font-semibold text-text-primary text-[14px]">Iuran RT</div>
                  <div className="text-[12.5px] text-text-secondary flex items-center gap-3">
                    <span>Wajib</span>
                    <span>•</span>
                    <span className="font-mono">Juli 2026</span>
                    <span>•</span>
                    <span className="font-mono">Jatuh tempo: 31 Jul 2026</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-12)" }}>
                  <span className="font-mono text-[16px] font-semibold text-text-primary">Rp50.000</span>
                  <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary flex items-center justify-center shrink-0 transition-all">
                    <span className="w-2 h-2 rounded-full bg-white block" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 px-5 border border-border-subtle rounded-[12px] mb-3 cursor-pointer bg-bg-card transition-all hover:border-border-hover hover:shadow-lux-hover">
                <div className="flex flex-col gap-1">
                  <div className="font-semibold text-text-primary text-[14px]">Iuran Keamanan</div>
                  <div className="text-[12.5px] text-text-secondary flex items-center gap-3">
                    <span>Keamanan</span>
                    <span>•</span>
                    <span className="font-mono">Juli 2026</span>
                    <span>•</span>
                    <span className="font-mono">Jatuh tempo: 31 Jul 2026</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-12)" }}>
                  <span className="font-mono text-[16px] font-semibold text-text-primary">Rp30.000</span>
                  <div className="w-5 h-5 rounded-full border-2 border-border-subtle flex items-center justify-center shrink-0 transition-all" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 px-5 border border-border-subtle rounded-[12px] mb-3 bg-bg-card" style={{ opacity: 0.5, cursor: "default" }}>
                <div className="flex flex-col gap-1">
                  <div className="font-semibold text-text-primary text-[14px]">Iuran Sosial</div>
                  <div className="text-[12.5px] text-text-secondary flex items-center gap-3">
                    <span>Sosial</span>
                    <span>•</span>
                    <span className="font-mono">Juni 2026</span>
                    <span>•</span>
                    <span className="font-mono">Jatuh tempo: 30 Jun 2026</span>
                    <span style={{ color: "var(--status-green)", fontWeight: 600 }}>✓ Lunas</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-12)" }}>
                  <span className="font-mono text-[16px] font-semibold text-text-primary">Rp20.000</span>
                  <div className="w-5 h-5 rounded-full border-2 border-border-subtle flex items-center justify-center shrink-0 transition-all" />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="metodeBayar" className="block text-[13px] font-semibold text-text-primary mb-1">Metode Pembayaran</label>
              <select className="w-full px-[14px] py-[10px] font-sans text-[14px] text-text-primary bg-bg-card border border-border-subtle rounded-[12px] outline-none h-11 transition-all focus:border-primary focus:ring-3 focus:ring-primary-light appearance-none cursor-pointer" id="metodeBayar" required defaultValue="" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717A' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}>
                <option value="" disabled>-- Pilih Metode --</option>
                <option value="Transfer Bank">Transfer Bank</option>
                <option value="Tunai">Tunai</option>
                <option value="QRIS">QRIS</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-[13px] font-semibold text-text-primary mb-1">Upload Bukti Pembayaran</label>
              <div className="border-[1.5px] border-dashed border-border-subtle rounded-[12px] p-8 text-center cursor-pointer transition-all hover:border-primary hover:bg-primary-light relative" id="uploadArea">
                <svg className="w-10 h-10 text-text-muted mb-3 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                <p className="text-[14px] text-text-muted">Klik untuk upload bukti pembayaran</p>
                <span className="text-[12px] text-text-secondary">Format JPG/PNG/PDF, max 2MB</span>
                <input type="file" id="buktiBayar" accept="image/*,application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-border-subtle">
              <button type="submit" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-[14px] font-semibold border-none rounded-full cursor-pointer min-h-11 transition-all bg-primary text-white hover:bg-[#163b6a] hover:shadow-[0_4px_12px_rgba(30,75,133,0.25)] hover:-translate-y-px" id="submitBtn">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                Kirim Pembayaran
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
