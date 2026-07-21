import { useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { createIssue } from "../../api/issues.api"

export default function WargaLaporanBaru() {
  var navigate = useNavigate()
  var [form, setForm] = useState({ kategori_kendala: '', deskripsi: '' })
  var [errors, setErrors] = useState({})
  var [loading, setLoading] = useState(false)

  var updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  var validate = () => {
    var newErrors = {}
    if (!form.kategori_kendala) newErrors.kategori_kendala = 'Kategori harus dipilih'
    if (!form.deskripsi.trim()) newErrors.deskripsi = 'Deskripsi harus diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  var handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await createIssue({ kategori_kendala: form.kategori_kendala, deskripsi: form.deskripsi })
      alert('Laporan berhasil dikirim!')
      navigate('/monitoring-laporan')
    } catch (err) {
      alert('Gagal: ' + (err?.message || 'Terjadi kesalahan'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Laporan Kendala</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Buat Laporan</h1>
        <p className="text-[14.5px] text-text-muted">Laporkan kendala atau masalah di lingkungan RT 08.</p>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-10">
        <div className="mb-8 pb-6 border-b border-border-subtle">
          <h2 className="font-grotesk text-[22px] font-bold text-text-primary tracking-tight">Form Laporan Kendala</h2>
          <p className="text-sm text-text-secondary mt-1">Isi data dengan lengkap agar laporan Anda cepat diproses.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="kategori">Kategori Kendala</label>
            <select className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none transition-all focus:border-primary ${errors.kategori_kendala ? 'border-error' : 'border-border-subtle'}`} id="kategori" value={form.kategori_kendala} onChange={(e) => updateField('kategori_kendala', e.target.value)}>
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
            {errors.kategori_kendala && <div className="text-xs text-error mt-1">{errors.kategori_kendala}</div>}
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="deskripsi">Deskripsi Kendala</label>
            <textarea className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none transition-all focus:border-primary ${errors.deskripsi ? 'border-error' : 'border-border-subtle'}`} id="deskripsi" placeholder="Jelaskan kendala yang terjadi secara detail..." rows="5" value={form.deskripsi} onChange={(e) => updateField('deskripsi', e.target.value)} />
            {errors.deskripsi && <div className="text-xs text-error mt-1">{errors.deskripsi}</div>}
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-border-subtle">
            <button type="button" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-bg-hover text-text-secondary border border-border-subtle" onClick={() => navigate("/monitoring-laporan")}>Lihat Laporan Saya</button>
            <button type="submit" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-primary text-white" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Laporan'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
