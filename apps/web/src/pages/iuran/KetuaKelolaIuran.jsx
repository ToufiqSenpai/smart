import { useState, useEffect } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import Modal from "../../components/ui/Modal"
import Button from "../../components/ui/Button"
import ConfirmModal from "../../components/ui/ConfirmModal"
import AlertModal from "../../components/ui/AlertModal"
import { getDues, createDue, updateDue, toggleDueStatus } from "../../api/dues.api"

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(angka)
}

function formatDate(dateStr) {
  const parts = dateStr.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
  return parseInt(parts[2]) + ' ' + months[parseInt(parts[1]) - 1] + ' ' + parts[0]
}

const initialForm = { nama_iuran: '', jenis_iuran: '', nominal: '', tanggal_jatuh_tempo: '' }

export default function KetuaKelolaIuran() {
  const [alert, setAlert] = useState(null)
  const [iuranData, setIuranData] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalAdd, setModalAdd] = useState(false)
  const [modalEdit, setModalEdit] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const [confirmToggle, setConfirmToggle] = useState(null)

  useEffect(() => {
    getDues().then(res => setIuranData(res.data)).catch(err => console.error('Gagal memuat iuran:', err)).finally(() => setLoading(false))
  }, [])

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  function validate() {
    const newErrors = {}
    if (!form.nama_iuran.trim()) newErrors.nama_iuran = 'Nama iuran harus diisi'
    if (!form.jenis_iuran) newErrors.jenis_iuran = 'Jenis iuran harus dipilih'
    if (!form.nominal || isNaN(form.nominal)) newErrors.nominal = 'Nominal harus berupa angka'
    if (!form.tanggal_jatuh_tempo) newErrors.tanggal_jatuh_tempo = 'Tanggal jatuh tempo harus diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function openAddModal() {
    setForm(initialForm)
    setErrors({})
    setModalAdd(true)
  }

  function openEditModal(iuran) {
    setForm({
      nama_iuran: iuran.nama_iuran || '',
      jenis_iuran: iuran.jenis_iuran || '',
      nominal: String(iuran.nominal || ''),
      tanggal_jatuh_tempo: iuran.tanggal_jatuh_tempo || '',
    })
    setErrors({})
    setModalEdit(iuran.id)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await createDue({
        nama_iuran: form.nama_iuran,
        jenis_iuran: form.jenis_iuran,
        nominal: Number(form.nominal),
        tanggal_jatuh_tempo: form.tanggal_jatuh_tempo,
      })
      const res = await getDues()
      setIuranData(res.data)
      setAlert({ type: 'success', title: 'Berhasil', message: 'Data berhasil disimpan', onClose: () => { setModalAdd(false) } })
    } catch (err) {
      setAlert({ type: 'error', title: 'Gagal', message: err?.response?.data?.message || err?.message || 'Terjadi kesalahan' })
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await updateDue(modalEdit, {
        nama_iuran: form.nama_iuran,
        jenis_iuran: form.jenis_iuran,
        nominal: Number(form.nominal),
        tanggal_jatuh_tempo: form.tanggal_jatuh_tempo,
      })
      const res = await getDues()
      setIuranData(res.data)
      setAlert({ type: 'success', title: 'Berhasil', message: 'Data berhasil disimpan', onClose: () => { setModalEdit(null) } })
    } catch (err) {
      setAlert({ type: 'error', title: 'Gagal', message: err?.response?.data?.message || err?.message || 'Terjadi kesalahan' })
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleStatus(id, currentStatus) {
    try {
      await toggleDueStatus(id, { status: currentStatus ? 'INACTIVE' : 'ACTIVE' })
      setIuranData(prev => prev.map(i => i.id === id ? { ...i, status_aktif: !currentStatus } : i))
      setConfirmToggle(null)
      setAlert({ type: 'success', title: 'Berhasil', message: `Iuran berhasil ${currentStatus ? 'dinonaktifkan' : 'diaktifkan'}` })
    } catch (err) {
      setAlert({ type: 'error', title: 'Gagal', message: err?.response?.data?.message || err?.message || 'Terjadi kesalahan' })
      setConfirmToggle(null)
    }
  }

  const formFields = (
    <>
      <div className="mb-5">
        <label className="block text-[13px] font-semibold text-text-primary mb-1">Nama Iuran</label>
        <input type="text" className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-white border rounded-[14px] outline-none transition-all focus:border-primary ${errors.nama_iuran ? 'border-error' : 'border-border-subtle'}`} placeholder="Contoh: Iuran Keamanan" value={form.nama_iuran} onChange={(e) => updateField('nama_iuran', e.target.value)} />
        {errors.nama_iuran && <div className="text-xs text-error mt-1">{errors.nama_iuran}</div>}
      </div>
      <div className="mb-5">
        <label className="block text-[13px] font-semibold text-text-primary mb-1">Jenis Iuran</label>
        <select className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-white border rounded-[14px] outline-none transition-all focus:border-primary ${errors.jenis_iuran ? 'border-error' : 'border-border-subtle'}`} value={form.jenis_iuran} onChange={(e) => updateField('jenis_iuran', e.target.value)}>
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
      <div className="mb-5">
        <label className="block text-[13px] font-semibold text-text-primary mb-1">Nominal (Rp)</label>
        <input type="text" className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-white border rounded-[14px] outline-none transition-all focus:border-primary ${errors.nominal ? 'border-error' : 'border-border-subtle'}`} placeholder="Contoh: 50000" value={form.nominal} onChange={(e) => updateField('nominal', e.target.value)} />
        {errors.nominal && <div className="text-xs text-error mt-1">{errors.nominal}</div>}
      </div>
      <div className="mb-5">
        <label className="block text-[13px] font-semibold text-text-primary mb-1">Tanggal Jatuh Tempo</label>
        <input type="date" className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-white border rounded-[14px] outline-none transition-all focus:border-primary ${errors.tanggal_jatuh_tempo ? 'border-error' : 'border-border-subtle'}`} value={form.tanggal_jatuh_tempo} onChange={(e) => updateField('tanggal_jatuh_tempo', e.target.value)} />
        {errors.tanggal_jatuh_tempo && <div className="text-xs text-error mt-1">{errors.tanggal_jatuh_tempo}</div>}
      </div>
    </>
  )

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Manajemen Keuangan</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Kelola Data Iuran</h1>
        <p className="text-[14.5px] text-text-muted">Kelola master data iuran warga RT 08.</p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold text-text-muted px-3.5 py-1.5 bg-bg-card rounded-full border border-border-subtle shadow-lux">{iuranData.length} iuran</span>
        </div>
        <Button onClick={openAddModal}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Tambah Iuran
        </Button>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between">
          <h3 className="font-grotesk text-base font-bold text-text-primary">Daftar Iuran</h3>
          <span style={{ fontSize: "12px", color: "var(--ink-subtle)" }}>Total: {iuranData.length} iuran</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-bg">
              <tr>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">No</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">Nama Iuran</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">Jenis</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">Nominal</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">Jatuh Tempo</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">Status</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-12 text-text-muted text-[13.5px]">Memuat data...</td></tr>
              ) : iuranData.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-12 text-text-muted text-[13.5px]">Tidak ada data iuran.</td></tr>
              ) : iuranData.map((iuran, index) => (
                <tr key={iuran.id} className="hover:bg-primary-lighter">
                  <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6">{index + 1}</td>
                  <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6" style={{ fontWeight: 600, color: "var(--ink-black)" }}>{iuran.nama_iuran}</td>
                  <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6">{iuran.jenis_iuran}</td>
                  <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6 font-mono text-[13px]">{formatRupiah(iuran.nominal)}</td>
                  <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6 font-mono text-[13px]">{formatDate(iuran.tanggal_jatuh_tempo)}</td>
                  <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6">
                    <span className={"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap " + (iuran.status_aktif ? 'bg-success-bg text-success border border-success/10' : 'bg-error-bg text-error border border-error/10')}>{iuran.status_aktif ? 'Aktif' : 'Nonaktif'}</span>
                  </td>
                  <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6 text-right pr-6">
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(iuran)}>Edit</Button>
                      <Button variant={iuran.status_aktif ? "secondary" : "primary"} size="sm" onClick={() => setConfirmToggle(iuran)}>{iuran.status_aktif ? 'Nonaktifkan' : 'Aktifkan'}</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalAdd}
        onClose={() => setModalAdd(false)}
        title="Tambah Iuran"
        subtitle="Tambahkan jenis iuran baru untuk warga RT 08."
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalAdd(false)}>Batal</Button>
            <Button onClick={handleAdd} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
          </>
        }
      >
        <form onSubmit={handleAdd}>{formFields}</form>
      </Modal>

      <Modal
        open={!!modalEdit}
        onClose={() => setModalEdit(null)}
        title="Edit Iuran"
        subtitle="Edit jenis iuran untuk warga RT 08."
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalEdit(null)}>Batal</Button>
            <Button onClick={handleEdit} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
          </>
        }
      >
        <form onSubmit={handleEdit}>{formFields}</form>
      </Modal>

      <ConfirmModal
        open={!!confirmToggle}
        onClose={() => setConfirmToggle(null)}
        onConfirm={() => handleToggleStatus(confirmToggle?.id, confirmToggle?.status_aktif)}
        title={confirmToggle?.status_aktif ? 'Nonaktifkan Iuran' : 'Aktifkan Iuran'}
        message={`Apakah Anda yakin ingin ${confirmToggle?.status_aktif ? 'menonaktifkan' : 'mengaktifkan'} iuran "${confirmToggle?.nama_iuran}"?`}
        confirmText={confirmToggle?.status_aktif ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
        variant={confirmToggle?.status_aktif ? 'danger' : 'primary'}
      />

      <AlertModal
        open={!!alert}
        onClose={() => { const cb = alert?.onClose; setAlert(null); cb?.() }}
        type={alert?.type}
        title={alert?.title}
        message={alert?.message}
      />
    </DashboardLayout>
  )
}
