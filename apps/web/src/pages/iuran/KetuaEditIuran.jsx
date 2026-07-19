import { useState } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"

export default function KetuaEditIuran() {
  const [form, setForm] = useState({
    nama: "Iuran RT",
    jenis: "Wajib",
    nominal: "50000",
    tanggalJatuhTempo: "",
    status: "active",
  })

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <DashboardLayout>
      <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" onClick={() => window.history.back()}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali ke daftar iuran
      </button>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-10">
        <div className="mb-8 pb-6 border-b border-border-subtle">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-1">Edit Data</p>
          <h2 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight">Edit Iuran</h2>
          <p className="text-sm text-text-secondary mt-1">Edit jenis iuran untuk warga RT 08.</p>
        </div>

        <form id="iuranForm" noValidate>
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="namaIuran">Nama Iuran</label>
            <input type="text" className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="namaIuran" placeholder="Contoh: Iuran Keamanan" required value={form.nama} onChange={(e) => updateField("nama", e.target.value)} />
            <div className="text-xs text-text-muted mt-1">Nama iuran yang akan terlihat oleh warga.</div>
            <div className="text-xs text-error mt-1 hidden items-center gap-1.5" id="namaIuranError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Nama iuran harus diisi</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="jenisIuran">Jenis Iuran</label>
            <select className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="jenisIuran" required value={form.jenis} onChange={(e) => updateField("jenis", e.target.value)}>
              <option value="">-- Pilih Jenis --</option>
              <option value="Wajib">Wajib</option>
              <option value="Opsional">Opsional</option>
              <option value="Sosial">Sosial</option>
              <option value="Keamanan">Keamanan</option>
              <option value="Kebersihan">Kebersihan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            <div className="text-xs text-text-muted mt-1">Jenis iuran menentukan kategori tagihan.</div>
            <div className="text-xs text-error mt-1 hidden items-center gap-1.5" id="jenisIuranError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Jenis iuran harus dipilih</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="nominalIuran">Nominal <span className="font-normal text-text-muted text-xs">(Rp)</span></label>
            <input type="text" className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="nominalIuran" placeholder="Contoh: 50000" required value={form.nominal} onChange={(e) => updateField("nominal", e.target.value)} />
            <div className="text-xs text-text-muted mt-1">Masukkan nominal tanpa titik atau koma (contoh: 50000)</div>
            <div className="text-xs text-error mt-1 hidden items-center gap-1.5" id="nominalIuranError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Nominal harus diisi (angka)</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="tanggalJatuhTempo">Tanggal Jatuh Tempo</label>
            <input type="date" className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="tanggalJatuhTempo" required value={form.tanggalJatuhTempo} onChange={(e) => updateField("tanggalJatuhTempo", e.target.value)} />
            <div className="text-xs text-text-muted mt-1">Tanggal terakhir warga dapat membayar iuran ini.</div>
            <div className="text-xs text-error mt-1 hidden items-center gap-1.5" id="tanggalJatuhTempoError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Tanggal jatuh tempo harus diisi</span>
            </div>
          </div>

          <div className="mb-6" style={{ marginBottom: 0 }}>
            <label className="block text-[13px] font-semibold text-text-primary mb-1">Status</label>
            <div style={{ marginTop: "var(--sp-4)" }}>
              <span className="inline-flex items-center gap-1.5 px-[14px] py-1 rounded-full text-xs font-bold border bg-success-bg text-success border-success/10">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /></svg>
                Aktif (langsung terlihat warga)
              </span>
            </div>
            <div className="text-xs text-text-muted mt-1">Iuran akan otomatis aktif setelah ditambahkan.</div>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-border-subtle">
            <button type="button" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-bg-hover text-text-secondary border border-border-subtle" onClick={() => window.history.back()}>Batal</button>
            <button type="submit" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-primary text-white" id="submitBtn">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
