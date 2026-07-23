import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"
import AlertModal from "../../components/ui/AlertModal"
import { getExpenseById, updateExpense } from "../../api/finance.api"

export default function KetuaEditPengeluaranKas() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ kategori_pengeluaran: '', nominal_pengeluaran: '', tanggal_keluar: '', keterangan: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    getExpenseById(id)
      .then(res => {
        const d = res.data
        setForm({
          kategori_pengeluaran: d.kategori_pengeluaran || '',
          nominal_pengeluaran: String(d.nominal_pengeluaran || ''),
          tanggal_keluar: d.tanggal_keluar || '',
          keterangan: d.keterangan || '',
        })
      })
      .catch(() => setAlert({ type: 'error', title: 'Gagal', message: 'Data tidak ditemukan' }))
      .finally(() => setLoading(false))
  }, [id])

  var updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  var validate = () => {
    var newErrors = {}
    if (!form.kategori_pengeluaran) newErrors.kategori_pengeluaran = 'Kategori harus dipilih'
    if (!form.nominal_pengeluaran || isNaN(form.nominal_pengeluaran)) newErrors.nominal_pengeluaran = 'Nominal harus berupa angka'
    if (!form.tanggal_keluar) newErrors.tanggal_keluar = 'Tanggal harus diisi'
    if (!form.keterangan.trim()) newErrors.keterangan = 'Keterangan harus diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  var handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await updateExpense(id, {
        kategori_pengeluaran: form.kategori_pengeluaran,
        nominal_pengeluaran: Number(form.nominal_pengeluaran),
        tanggal_keluar: form.tanggal_keluar,
        keterangan: form.keterangan,
      })
      setAlert({ type: 'success', title: 'Berhasil', message: 'Pengeluaran berhasil diperbarui!', onClose: () => { navigate('/kelola-pengeluaran-kas') } })
    } catch (err) {
      setAlert({ type: 'error', title: 'Gagal', message: err?.message || 'Terjadi kesalahan' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <DashboardLayout><div className="text-center py-16 text-text-muted">Memuat data...</div></DashboardLayout>

  return (
    <DashboardLayout>
      <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" onClick={() => navigate('/kelola-pengeluaran-kas')}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali ke daftar pengeluaran
      </button>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-10">
        <div className="mb-8 pb-6 border-b border-border-subtle">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-1">Edit Data</p>
          <h2 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight">Edit Pengeluaran Kas</h2>
          <p className="text-sm text-text-secondary mt-1">Perbarui data pengeluaran kas RT 08.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1">Kategori Pengeluaran</label>
            <select className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none ${errors.kategori_pengeluaran ? 'border-error' : 'border-border-subtle'}`} value={form.kategori_pengeluaran} onChange={(e) => updateField('kategori_pengeluaran', e.target.value)}>
              <option value="">-- Pilih Kategori --</option>
              <option value="Operasional">Operasional</option>
              <option value="Kegiatan">Kegiatan</option>
              <option value="Kebersihan">Kebersihan</option>
              <option value="Keamanan">Keamanan</option>
              <option value="Sosial">Sosial</option>
              <option value="Perbaikan">Perbaikan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            {errors.kategori_pengeluaran && <div className="text-xs text-error mt-1">{errors.kategori_pengeluaran}</div>}
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1">Nominal (Rp)</label>
            <input type="text" className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none ${errors.nominal_pengeluaran ? 'border-error' : 'border-border-subtle'}`} placeholder="Contoh: 500000" value={form.nominal_pengeluaran} onChange={(e) => updateField('nominal_pengeluaran', e.target.value)} />
            {errors.nominal_pengeluaran && <div className="text-xs text-error mt-1">{errors.nominal_pengeluaran}</div>}
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1">Tanggal Pengeluaran</label>
            <input type="date" className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none ${errors.tanggal_keluar ? 'border-error' : 'border-border-subtle'}`} value={form.tanggal_keluar} onChange={(e) => updateField('tanggal_keluar', e.target.value)} />
            {errors.tanggal_keluar && <div className="text-xs text-error mt-1">{errors.tanggal_keluar}</div>}
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1">Keterangan</label>
            <textarea className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none ${errors.keterangan ? 'border-error' : 'border-border-subtle'}`} placeholder="Deskripsi pengeluaran..." rows="4" value={form.keterangan} onChange={(e) => updateField('keterangan', e.target.value)} />
            {errors.keterangan && <div className="text-xs text-error mt-1">{errors.keterangan}</div>}
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-border-subtle">
            <button type="button" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-bg-hover text-text-secondary border border-border-subtle" onClick={() => navigate('/kelola-pengeluaran-kas')}>Batal</button>
            <button type="submit" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-primary text-white" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>

      <AlertModal open={!!alert} onClose={() => { const cb = alert?.onClose; setAlert(null); cb?.() }} type={alert?.type} title={alert?.title} message={alert?.message} />
    </DashboardLayout>
  )
}
