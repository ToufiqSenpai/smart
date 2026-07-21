import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { createAnnouncement } from "../../api/announcements.api"

const ICONS = {
  check: (
    <svg className="w-4 h-4 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-4" /></svg>
  ),
  alert: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
  ),
  x: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  ),
}

function Toast({ type, title, message, onClose }) {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => { setVisible(false); onClose() }, 4000)
    return () => clearTimeout(timer)
  }, [onClose])
  if (!visible) return null
  return (
    <div className={`flex items-start gap-3 p-4 bg-bg-card rounded-[14px] shadow-[0_20px_40px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.02)] border border-border-subtle animate-[slideInUp_0.3s_cubic-bezier(0.16,1,0.3,1)] ${type === "success" ? "border-t-success border-t-3" : ""}`}>
      {type === "success" ? ICONS.check : ICONS.alert}
      <div className="flex-1 text-[13px]">
        <div className="font-bold text-text-primary mb-0.5">{title}</div>
        <div className="text-text-secondary">{message}</div>
      </div>
      <button className="bg-transparent border-none text-text-muted cursor-pointer p-0.5 flex rounded-full hover:text-text-primary hover:bg-bg-hover transition-all" aria-label="Tutup notifikasi" onClick={() => { setVisible(false); onClose() }}>{ICONS.x}</button>
    </div>
  )
}

export default function KetuaTambahPengumuman() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ judul: "", isi: "", status: "" })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((type, title, message) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, type, title, message }])
  }, [])
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (value && String(value).trim()) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (f) setFile(f)
  }
  const removeFile = () => {
    setFile(null)
  }

  const validate = () => {
    const newErrors = {}
    if (!form.judul.trim()) newErrors.judul = "Judul harus diisi"
    if (!form.isi.trim()) newErrors.isi = "Isi pengumuman harus diisi"
    if (!form.status) newErrors.status = "Status harus dipilih"
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      await createAnnouncement({
        judul: form.judul,
        isi_pengumuman: form.isi,
        status_publikasi: form.status === 'publik' ? 'PUBLISHED' : 'DRAFT',
        lampiran: file ? file.name : null,
      })
      addToast("success", "Pengumuman ditambahkan!", `"${form.judul}" berhasil ditambahkan.`)
      setTimeout(() => navigate("/kelola-pengumuman"), 1500)
    } catch (err) {
      addToast("error", "Gagal menambahkan", err?.message || "Terjadi kesalahan, coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" onClick={() => navigate(-1)}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali ke daftar pengumuman
      </button>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-10">
        <div className="mb-8 pb-6 border-b border-border-subtle">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-1">Tambah Data</p>
          <h2 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight">Tambah Pengumuman</h2>
          <p className="text-sm text-text-secondary mt-1">Buat pengumuman baru untuk warga RT 08. Pengumuman dengan status <strong>Publik</strong> akan langsung terlihat oleh warga.</p>
        </div>

        <form id="pengumumanForm" noValidate onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="judulInput">Judul Pengumuman</label>
            <input type="text" className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted${errors.judul ? " border-error" : ""}`} id="judulInput" placeholder="Masukkan judul pengumuman" required value={form.judul} onChange={(e) => updateField("judul", e.target.value)} />
            <div className={`text-xs text-error mt-1 ${errors.judul ? "flex" : "hidden"} items-center gap-1.5`} id="judulError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{errors.judul}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="isiInput">Isi Pengumuman</label>
            <textarea className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted${errors.isi ? " border-error" : ""}`} id="isiInput" placeholder="Tulis isi pengumuman di sini..." rows="6" required value={form.isi} onChange={(e) => updateField("isi", e.target.value)}></textarea>
            <div className="text-xs text-text-muted mt-1">Tulis informasi yang jelas dan lengkap agar mudah dipahami warga.</div>
            <div className={`text-xs text-error mt-1 ${errors.isi ? "flex" : "hidden"} items-center gap-1.5`} id="isiError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{errors.isi}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="statusInput">Status Publikasi</label>
            <select className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--navy-brand-light)] placeholder:text-text-muted${errors.status ? " border-error" : ""}`} id="statusInput" required value={form.status} onChange={(e) => updateField("status", e.target.value)}>
              <option value="">-- Pilih Status --</option>
              <option value="draft">Draft (belum dipublikasikan)</option>
              <option value="publik">Publik (langsung terlihat warga)</option>
            </select>
            <div className="text-xs text-text-muted mt-1">Pilih <strong>Draft</strong> jika ingin menyimpan sementara, atau <strong>Publik</strong> untuk langsung ditampilkan ke warga.</div>
            <div className={`text-xs text-error mt-1 ${errors.status ? "flex" : "hidden"} items-center gap-1.5`} id="statusError">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{errors.status}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1">Lampiran <span className="font-normal text-text-muted text-xs">(opsional)</span></label>
            <div className="border-2 border-dashed border-border-subtle rounded-[14px] p-6 text-center cursor-pointer hover:border-primary hover:bg-primary-light transition-all relative" id="uploadArea">
              <svg className="w-10 h-10 text-text-muted mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
              <p className="text-sm text-text-secondary">Klik untuk upload lampiran</p>
              <span className="text-xs text-text-muted">Format JPG/PNG/PDF, max 2MB</span>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" id="lampiranInput" accept="image/*,application/pdf" onChange={handleFileChange} />
            </div>
            <div className={`mt-4 ${file ? "block" : "hidden"}`} id="previewArea">
              <div className="flex items-center gap-3 px-4 py-3 bg-bg rounded-[14px] border border-border-subtle">
                <svg className="w-8 h-8 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-text-primary" id="previewName">{file ? file.name : ""}</div>
                  <div className="text-xs text-text-muted" id="previewSize">{file ? (file.size / 1024).toFixed(1) + " KB" : ""}</div>
                </div>
                <button type="button" className="bg-none border-none text-error cursor-pointer p-1 flex rounded-full hover:bg-error-bg transition-all" id="removeLampiran" onClick={removeFile}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-border-subtle">
            <button type="button" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-bg-hover text-text-secondary border border-border-subtle" onClick={() => navigate(-1)}>Batal</button>
            <button type="submit" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-primary text-white" id="submitBtn" disabled={loading}>
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M4.93 19.07l2.83-2.83" /><path d="M16.24 7.76l2.83-2.83" /></svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                  Simpan
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="fixed top-6 right-6 z-[1000] flex flex-col gap-2 max-w-[380px] w-full">
        {toasts.map((t) => (
          <Toast key={t.id} type={t.type} title={t.title} message={t.message} onClose={() => removeToast(t.id)} />
        ))}
      </div>

    </DashboardLayout>
  )
}
