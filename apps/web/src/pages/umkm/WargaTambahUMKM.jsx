import { useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { createBusiness } from "../../api/businesses.api"

export default function WargaTambahUMKM() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nama_usaha: '',
    jenis_usaha: '',
    deskripsi_usaha: '',
    alamat_usaha: '',
    kontak_usaha: '',
    foto_usaha: null,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState([])

  const addToast = (type, title, message) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.nama_usaha.trim()) newErrors.nama_usaha = 'Nama usaha harus diisi'
    if (!form.jenis_usaha) newErrors.jenis_usaha = 'Jenis usaha harus dipilih'
    if (!form.deskripsi_usaha.trim()) newErrors.deskripsi_usaha = 'Deskripsi harus diisi'
    if (!form.alamat_usaha.trim()) newErrors.alamat_usaha = 'Alamat harus diisi'
    if (!form.kontak_usaha.trim()) newErrors.kontak_usaha = 'Kontak harus diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await createBusiness({
        nama_usaha: form.nama_usaha,
        jenis_usaha: form.jenis_usaha,
        deskripsi_usaha: form.deskripsi_usaha,
        alamat_usaha: form.alamat_usaha,
        kontak_usaha: form.kontak_usaha,
        foto_usaha: form.foto_usaha,
      })
      addToast('success', 'UMKM berhasil didaftarkan!', 'Data UMKM Anda telah dikirim. Menunggu verifikasi Pengurus RT.')
      setTimeout(() => navigate('/umkm-saya'), 2000)
    } catch (err) {
      addToast('error', 'Gagal mendaftarkan UMKM', err?.message || 'Terjadi kesalahan, coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleBatal = () => navigate('/umkm-saya')

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
            <button className="bg-transparent border-none text-text-muted cursor-pointer p-0.5 flex rounded-full hover:text-text-primary hover:bg-bg-hover transition-all" onClick={() => setToasts(prev => prev.filter((x) => x.id !== t.id))}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        ))}
      </div>

      <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" onClick={handleBatal}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali ke UMKM Saya
      </button>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-10">
        <div className="mb-8 pb-6 border-b border-border-subtle">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-1">Tambah Data</p>
          <h2 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight">Tambah UMKM</h2>
          <p className="text-sm text-text-secondary mt-1">Isi data usaha Anda dengan lengkap. Setelah disimpan, UMKM akan diverifikasi oleh Pengurus RT.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="namaUsaha">Nama Usaha</label>
            <input type="text" className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted ${errors.nama_usaha ? 'border-error' : 'border-border-subtle'}`} id="namaUsaha" placeholder="Contoh: Warung Makan Sari" value={form.nama_usaha} onChange={(e) => updateField('nama_usaha', e.target.value)} />
            <div className={`text-xs text-error mt-1 items-center gap-1.5 ${errors.nama_usaha ? 'flex' : 'hidden'}`}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{errors.nama_usaha}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="jenisUsaha">Jenis Usaha</label>
            <select className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] ${errors.jenis_usaha ? 'border-error' : 'border-border-subtle'}`} id="jenisUsaha" value={form.jenis_usaha} onChange={(e) => updateField('jenis_usaha', e.target.value)}>
              <option value="">-- Pilih Jenis --</option>
              <option value="Kuliner">Kuliner</option>
              <option value="Fashion">Fashion</option>
              <option value="Kerajinan">Kerajinan</option>
              <option value="Jasa">Jasa</option>
              <option value="Perdagangan">Perdagangan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            <div className={`text-xs text-error mt-1 items-center gap-1.5 ${errors.jenis_usaha ? 'flex' : 'hidden'}`}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{errors.jenis_usaha}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="deskripsiUsaha">Deskripsi Usaha</label>
            <textarea className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted ${errors.deskripsi_usaha ? 'border-error' : 'border-border-subtle'}`} id="deskripsiUsaha" placeholder="Jelaskan usaha Anda secara singkat..." rows="4" value={form.deskripsi_usaha} onChange={(e) => updateField('deskripsi_usaha', e.target.value)} />
            <div className={`text-xs text-error mt-1 items-center gap-1.5 ${errors.deskripsi_usaha ? 'flex' : 'hidden'}`}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{errors.deskripsi_usaha}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="alamatUsaha">Alamat Usaha</label>
            <input type="text" className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted ${errors.alamat_usaha ? 'border-error' : 'border-border-subtle'}`} id="alamatUsaha" placeholder="Contoh: Jl. Mawar No. 12, RT 08/RW 03" value={form.alamat_usaha} onChange={(e) => updateField('alamat_usaha', e.target.value)} />
            <div className={`text-xs text-error mt-1 items-center gap-1.5 ${errors.alamat_usaha ? 'flex' : 'hidden'}`}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{errors.alamat_usaha}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="kontakUsaha">Kontak Usaha</label>
            <input type="text" className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted ${errors.kontak_usaha ? 'border-error' : 'border-border-subtle'}`} id="kontakUsaha" placeholder="Contoh: 081234567890 atau @warungsari" value={form.kontak_usaha} onChange={(e) => updateField('kontak_usaha', e.target.value)} />
            <div className="text-xs text-text-muted mt-1">Nomor WhatsApp atau media sosial yang bisa dihubungi.</div>
            <div className={`text-xs text-error mt-1 items-center gap-1.5 ${errors.kontak_usaha ? 'flex' : 'hidden'}`}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{errors.kontak_usaha}</span>
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
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-border-subtle">
            <button type="button" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-bg-hover text-text-secondary border border-border-subtle" onClick={handleBatal}>Batal</button>
            <button type="submit" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-primary text-white" disabled={loading}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
