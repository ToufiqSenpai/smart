import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"
import AlertModal from "../../components/ui/AlertModal"
import { getDueById, updateDue } from "../../api/dues.api"

export default function KetuaEditIuran() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nama_iuran: '', jenis_iuran: '', nominal: '', tanggal_jatuh_tempo: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    getDueById(id)
      .then(res => {
        const d = res.data
        setForm({
          nama_iuran: d.nama_iuran || '',
          jenis_iuran: d.jenis_iuran || '',
          nominal: String(d.nominal || ''),
          tanggal_jatuh_tempo: d.tanggal_jatuh_tempo || '',
        })
      })
      .catch(() => setAlert({ type: 'error', title: 'Gagal', message: 'Iuran tidak ditemukan' }))
      .finally(() => setLoading(false))
  }, [id])

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.nama_iuran.trim()) newErrors.nama_iuran = 'Nama iuran harus diisi'
    if (!form.jenis_iuran) newErrors.jenis_iuran = 'Jenis iuran harus dipilih'
    if (!form.nominal || isNaN(form.nominal)) newErrors.nominal = 'Nominal harus berupa angka'
    if (!form.tanggal_jatuh_tempo) newErrors.tanggal_jatuh_tempo = 'Tanggal jatuh tempo harus diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await updateDue(id, {
        nama_iuran: form.nama_iuran,
        jenis_iuran: form.jenis_iuran,
        nominal: Number(form.nominal),
        tanggal_jatuh_tempo: form.tanggal_jatuh_tempo,
      })
      setAlert({ type: 'success', title: 'Berhasil', message: 'Iuran berhasil diperbarui!', onClose: () => { navigate('/kelola-iuran') } })
    } catch (err) {
      setAlert({ type: 'error', title: 'Gagal', message: err?.message || 'Terjadi kesalahan' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <DashboardLayout><div className="text-center py-16 text-text-muted">Memuat data...</div></DashboardLayout>

  return (
    <DashboardLayout>
      <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" onClick={() => navigate('/kelola-iuran')}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali ke daftar iuran
      </button>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-10">
        <div className="mb-8 pb-6 border-b border-border-subtle">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-1">Edit Data</p>
          <h2 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight">Edit Iuran</h2>
          <p className="text-sm text-text-secondary mt-1">Edit jenis iuran untuk warga RT 08.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="namaIuran">Nama Iuran</label>
            <input type="text" className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none transition-all focus:border-primary ${errors.nama_iuran ? 'border-error' : 'border-border-subtle'}`} id="namaIuran" value={form.nama_iuran} onChange={(e) => updateField('nama_iuran', e.target.value)} />
            {errors.nama_iuran && <div className="text-xs text-error mt-1">{errors.nama_iuran}</div>}
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="jenisIuran">Jenis Iuran</label>
            <select className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none transition-all focus:border-primary ${errors.jenis_iuran ? 'border-error' : 'border-border-subtle'}`} id="jenisIuran" value={form.jenis_iuran} onChange={(e) => updateField('jenis_iuran', e.target.value)}>
              <option value="">-- Pilih Jenis --</option>
              <option value="Wajib">Wajib</option>
              <option value="Opsional">Opsional</option>
              <option value="Sosial">Sosial</option>
              <option value="Keamanan">Keamanan</option>
              <option value="Kebersihan">Kebersihan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            {errors.jenis_iuran && <div className="text-xs text-error mt-1">{errors.jenis_iuran}</div>}
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="nominalIuran">Nominal (Rp)</label>
            <input type="text" className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none transition-all focus:border-primary ${errors.nominal ? 'border-error' : 'border-border-subtle'}`} id="nominalIuran" value={form.nominal} onChange={(e) => updateField('nominal', e.target.value)} />
            {errors.nominal && <div className="text-xs text-error mt-1">{errors.nominal}</div>}
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1" htmlFor="tanggalJatuhTempo">Tanggal Jatuh Tempo</label>
            <input type="date" className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border rounded-[14px] outline-none transition-all focus:border-primary ${errors.tanggal_jatuh_tempo ? 'border-error' : 'border-border-subtle'}`} id="tanggalJatuhTempo" value={form.tanggal_jatuh_tempo} onChange={(e) => updateField('tanggal_jatuh_tempo', e.target.value)} />
            {errors.tanggal_jatuh_tempo && <div className="text-xs text-error mt-1">{errors.tanggal_jatuh_tempo}</div>}
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-border-subtle">
            <button type="button" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-bg-hover text-text-secondary border border-border-subtle" onClick={() => navigate('/kelola-iuran')}>Batal</button>
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
