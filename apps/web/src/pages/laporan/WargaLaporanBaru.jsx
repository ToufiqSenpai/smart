import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"

export default function WargaLaporanBaru() {
  var navigate = useNavigate()
  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Laporan Kendala</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Buat Laporan</h1>
        <p className="text-[14.5px] text-text-muted">Laporkan kendala atau masalah di lingkungan RT 08. Akan segera ditindaklanjuti oleh Pengurus RT.</p>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-10">
        <div className="mb-8 pb-6 border-b border-border-subtle">
          <h2 className="font-grotesk text-[22px] font-bold text-text-primary tracking-tight">Form Laporan Kendala</h2>
          <p className="text-sm text-text-secondary mt-1">Isi data dengan lengkap agar laporan Anda cepat diproses.</p>
        </div>

        <form id="reportForm" noValidate>
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="kategori">Kategori Kendala</label>
            <select className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="kategori" required>
              <option value="">-- Pilih Kategori --</option>
              <option value="Lampu Jalan Mati">Lampu Jalan Mati</option>
              <option value="Saluran Air Tersumbat">Saluran Air Tersumbat</option>
              <option value="Sampah Menumpuk">Sampah Menumpuk</option>
              <option value="Keamanan">Keamanan</option>
              <option value="Jalan Rusak">Jalan Rusak</option>
              <option value="Kebersihan">Kebersihan</option>
              <option value="Fasilitas Umum">Fasilitas Umum</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="deskripsi">Deskripsi Kendala</label>
            <textarea className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted" id="deskripsi" placeholder="Jelaskan kendala yang terjadi secara detail..." rows="5" required />
            <div className="text-xs text-text-muted mt-1">Semakin detail deskripsi, semakin cepat kami merespons.</div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1">Foto Kendala <span className="font-normal text-text-muted text-xs">(opsional)</span></label>
            <div className="border-2 border-dashed border-border-subtle rounded-[14px] p-8 text-center cursor-pointer hover:border-primary hover:bg-primary-light transition-all relative" id="uploadArea">
              <svg className="w-10 h-10 text-text-muted mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
              <p className="text-sm text-text-secondary">Klik untuk upload foto kendala</p>
              <span className="text-xs text-text-muted">Format JPG/PNG, max 2MB</span>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" id="fotoKendala" accept="image/*" />
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-border-subtle">
            <button type="button" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-bg-hover text-text-secondary border border-border-subtle" onClick={() => navigate("/monitoring-laporan")}>Lihat Laporan Saya</button>
            <button type="submit" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-primary text-white" id="submitBtn">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              Kirim Laporan
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
