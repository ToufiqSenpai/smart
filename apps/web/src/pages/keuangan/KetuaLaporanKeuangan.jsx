import { useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { createExpense } from "../../api/finance.api"

export default function KetuaTambahPengeluaranKas() {
  const navigate = useNavigate()
  
  const [form, setForm] = useState({ 
    kategoriPengeluaran: '', 
    nominalPengeluaran: '', 
    tanggalKeluar: '', 
    keterangan: '' 
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const newErrors = {}
    
    if (!form.kategoriPengeluaran) {
      newErrors.kategoriPengeluaran = 'Kategori harus dipilih'
    } else if (form.kategoriPengeluaran.trim().length > 15) {
      newErrors.kategoriPengeluaran = 'Maksimal 15 karakter'
    }

    const nominal = Number(form.nominalPengeluaran)
    if (!form.nominalPengeluaran || isNaN(nominal) || nominal <= 0) {
      newErrors.nominalPengeluaran = 'Nominal harus angka valid > 0'
    }

    if (!form.tanggalKeluar) {
      newErrors.tanggalKeluar = 'Tanggal harus diisi'
    }

    if (!form.keterangan.trim()) {
      newErrors.keterangan = 'Keterangan harus diisi'
    } else if (form.keterangan.trim().length > 30) {
      newErrors.keterangan = 'Keterangan maksimal 30 karakter'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    
    setSaving(true)
    try {
      // Pastikan payload dikirim dengan nama properti camelCase dan tipe data yang benar
      const payload = {
        kategoriPengeluaran: form.kategoriPengeluaran.trim(),
        nominalPengeluaran: Number(form.nominalPengeluaran),
        tanggalKeluar: form.tanggalKeluar, // <input type="date"> otomatis berformat YYYY-MM-DD
        keterangan: form.keterangan.trim(),
      }

      console.log("Mengirim payload:", payload)
      
      await createExpense(payload)
      
      alert('Pengeluaran berhasil ditambahkan!')
      navigate('/kelola-pengeluaran-kas')
    } catch (err) {
      console.error("Error Response dari Backend:", err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Terjadi kesalahan'
      alert('Gagal: ' + errorMsg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <button 
        className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" 
        onClick={() => navigate('/kelola-pengeluaran-kas')}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali ke daftar pengeluaran
      </button>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-10">
        <div className="mb-8 pb-6 border-b border-border-subtle">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-1">Tambah Data</p>
          <h2 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight">Tambah Pengeluaran Kas</h2>
          <p className="text-sm text-text-secondary mt-1">Catat data pengeluaran kas RT 08.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1">Kategori Pengeluaran</label>
            <select 
              className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none ${errors.kategoriPengeluaran ? 'border-error' : 'border-border-subtle'}`} 
              value={form.kategoriPengeluaran} 
              onChange={(e) => updateField('kategoriPengeluaran', e.target.value)}
            >
              <option value="">-- Pilih Kategori --</option>
              <option value="Operasional">Operasional</option>
              <option value="Kegiatan">Kegiatan</option>
              <option value="Kebersihan">Kebersihan</option>
              <option value="Keamanan">Keamanan</option>
              <option value="Sosial">Sosial</option>
              <option value="Perbaikan">Perbaikan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            {errors.kategoriPengeluaran && <div className="text-xs text-error mt-1">{errors.kategoriPengeluaran}</div>}
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1">Nominal (Rp)</label>
            <input 
              type="number" 
              className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none ${errors.nominalPengeluaran ? 'border-error' : 'border-border-subtle'}`} 
              placeholder="Contoh: 500000" 
              value={form.nominalPengeluaran} 
              onChange={(e) => updateField('nominalPengeluaran', e.target.value)} 
            />
            {errors.nominalPengeluaran && <div className="text-xs text-error mt-1">{errors.nominalPengeluaran}</div>}
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1">Tanggal Pengeluaran</label>
            <input 
              type="date" 
              className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none ${errors.tanggalKeluar ? 'border-error' : 'border-border-subtle'}`} 
              value={form.tanggalKeluar} 
              onChange={(e) => updateField('tanggalKeluar', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.tanggalKeluar && <div className="text-xs text-error mt-1">{errors.tanggalKeluar}</div>}
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1">Keterangan <span className="text-xs text-text-muted">(Maks. 30 karakter)</span></label>
            <input 
              type="text"
              maxLength={30}
              className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none ${errors.keterangan ? 'border-error' : 'border-border-subtle'}`} 
              placeholder="Contoh: Beli alat tulis (maks 30 karakter)" 
              value={form.keterangan} 
              onChange={(e) => updateField('keterangan', e.target.value)} 
            />
            <div className="text-xs text-text-muted mt-1">{form.keterangan.length}/30 karakter</div>
            {errors.keterangan && <div className="text-xs text-error mt-1">{errors.keterangan}</div>}
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-border-subtle">
            <button 
              type="button" 
              className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-bg-hover text-text-secondary border border-border-subtle" 
              onClick={() => navigate('/kelola-pengeluaran-kas')}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-primary text-white" 
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}