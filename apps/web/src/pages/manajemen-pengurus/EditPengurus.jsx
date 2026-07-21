import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { getOfficers, updateOfficerRole } from "../../api/residents.api"

var jabatanOptions = [
  { value: 'KETUA_RT', label: 'Ketua RT' },
  { value: 'SEKRETARIS', label: 'Sekretaris' },
  { value: 'BENDAHARA', label: 'Bendahara' },
  { value: 'HUMAS', label: 'Humas' },
  { value: 'KEAMANAN', label: 'Keamanan' },
]

export default function EditPengurus() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [jabatan, setJabatan] = useState('')
  const [periode, setPeriode] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getOfficers()
      .then(res => {
        const officer = res.data.find(o => o.id === id)
        if (officer) {
          setJabatan(officer.jabatan || '')
          setPeriode(officer.periodeJabatan || '')
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  var handleSubmit = async (e) => {
    e.preventDefault()
    if (!jabatan) return
    setSaving(true)
    try {
      // Need residentId for updateOfficerRole, officers list doesn't return it
      // Use officer id directly — backend needs idWarga
      alert('Update jabatan pengurus saat ini perlu ID warga yang tidak tersedia di response GET /officers')
      navigate('/kelola-pengurus')
    } catch (err) {
      alert('Gagal: ' + (err?.message || 'Terjadi kesalahan'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <DashboardLayout><div className="text-center py-16 text-text-muted">Memuat data...</div></DashboardLayout>

  return (
    <DashboardLayout>
      <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" onClick={() => navigate('/kelola-pengurus')}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali ke daftar pengurus
      </button>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-10">
        <div className="mb-8 pb-6 border-b border-border-subtle">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-1">Edit Data</p>
          <h2 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight">Edit Pengurus RT</h2>
          <p className="text-sm text-text-secondary mt-1">Edit data kepengurusan RT 08.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1">Jabatan</label>
            <select className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none" value={jabatan} onChange={(e) => setJabatan(e.target.value)}>
              <option value="">-- Pilih Jabatan --</option>
              {jabatanOptions.map(j => <option key={j.value} value={j.value}>{j.label}</option>)}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-text-primary mb-1">Periode Jabatan</label>
            <input type="text" className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-bg-card border border-border-subtle rounded-[14px] outline-none" placeholder="Contoh: 2026-2028" value={periode} onChange={(e) => setPeriode(e.target.value)} />
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-border-subtle">
            <button type="button" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-bg-hover text-text-secondary border border-border-subtle" onClick={() => navigate('/kelola-pengurus')}>Batal</button>
            <button type="submit" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-primary text-white" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
