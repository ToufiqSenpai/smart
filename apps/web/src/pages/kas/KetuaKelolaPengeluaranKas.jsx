import { useState, useEffect } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import Modal from "../../components/ui/Modal"
import Button from "../../components/ui/Button"
import ConfirmModal from "../../components/ui/ConfirmModal"
import AlertModal from "../../components/ui/AlertModal"
import { getExpenses, getExpenseById, createExpense, updateExpense, deleteExpense } from "../../api/finance.api"

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(angka)
}

function formatDate(dateStr) {
  const parts = dateStr.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
  return parseInt(parts[2]) + ' ' + months[parseInt(parts[1]) - 1] + ' ' + parts[0]
}

const initialForm = { kategori_pengeluaran: '', nominal_pengeluaran: '', tanggal_keluar: '', keterangan: '' }

export default function KetuaKelolaPengeluaranKas() {
  const [search, setSearch] = useState('')
  const [kategoriFilter, setKategoriFilter] = useState('all')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalAdd, setModalAdd] = useState(false)
  const [modalEdit, setModalEdit] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [loadingEdit, setLoadingEdit] = useState(false)

  const [confirmDelete, setConfirmDelete] = useState(null)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    getExpenses().then(res => setData(res.data)).catch(err => console.error('Gagal memuat:', err)).finally(() => setLoading(false))
  }, [])

  const filtered = data.filter((item) => {
    const matchSearch = item.kategori_pengeluaran.toLowerCase().includes(search.toLowerCase())
    const matchKategori = kategoriFilter === "all" || item.kategori_pengeluaran === kategoriFilter
    return matchSearch && matchKategori
  })

  const total = filtered.reduce((sum, i) => sum + i.nominal_pengeluaran, 0)

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  function validate() {
    const newErrors = {}
    if (!form.kategori_pengeluaran) newErrors.kategori_pengeluaran = 'Kategori harus dipilih'
    if (!form.nominal_pengeluaran || isNaN(form.nominal_pengeluaran)) newErrors.nominal_pengeluaran = 'Nominal harus berupa angka'
    if (!form.tanggal_keluar) newErrors.tanggal_keluar = 'Tanggal harus diisi'
    if (!form.keterangan.trim()) newErrors.keterangan = 'Keterangan harus diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function openAddModal() {
    setForm(initialForm)
    setErrors({})
    setModalAdd(true)
  }

  async function openEditModal(id) {
    setLoadingEdit(true)
    setErrors({})
    try {
      const res = await getExpenseById(id)
      const d = res.data
      setForm({
        kategori_pengeluaran: d.kategori_pengeluaran || '',
        nominal_pengeluaran: String(d.nominal_pengeluaran || ''),
        tanggal_keluar: d.tanggal_keluar || '',
        keterangan: d.keterangan || '',
      })
      setModalEdit(id)
    } catch {
      setAlert({ type: 'error', title: 'Gagal', message: 'Gagal memuat data' })
    } finally {
      setLoadingEdit(false)
    }
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await createExpense({
        kategori_pengeluaran: form.kategori_pengeluaran,
        nominal_pengeluaran: Number(form.nominal_pengeluaran),
        tanggal_keluar: form.tanggal_keluar,
        keterangan: form.keterangan,
      })
      const res = await getExpenses()
      setData(res.data)
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
      await updateExpense(modalEdit, {
        kategori_pengeluaran: form.kategori_pengeluaran,
        nominal_pengeluaran: Number(form.nominal_pengeluaran),
        tanggal_keluar: form.tanggal_keluar,
        keterangan: form.keterangan,
      })
      const res = await getExpenses()
      setData(res.data)
      setAlert({ type: 'success', title: 'Berhasil', message: 'Data berhasil disimpan', onClose: () => { setModalEdit(null) } })
    } catch (err) {
      setAlert({ type: 'error', title: 'Gagal', message: err?.response?.data?.message || err?.message || 'Terjadi kesalahan' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteExpense(id)
      setData(prev => prev.filter(i => i.id !== id))
      setConfirmDelete(null)
      setAlert({ type: 'success', title: 'Berhasil', message: 'Data berhasil dihapus' })
    } catch (err) {
      setAlert({ type: 'error', title: 'Gagal', message: err?.response?.data?.message || err?.message || 'Terjadi kesalahan' })
      setConfirmDelete(null)
    }
  }

  const formFields = (
    <>
      <div className="mb-5">
        <label className="block text-[13px] font-semibold text-text-primary mb-1">Kategori Pengeluaran</label>
        <select className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-white border rounded-[14px] outline-none transition-all focus:border-primary ${errors.kategori_pengeluaran ? 'border-error' : 'border-border-subtle'}`} value={form.kategori_pengeluaran} onChange={(e) => updateField('kategori_pengeluaran', e.target.value)}>
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
      <div className="mb-5">
        <label className="block text-[13px] font-semibold text-text-primary mb-1">Nominal (Rp)</label>
        <input type="text" className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-white border rounded-[14px] outline-none transition-all focus:border-primary ${errors.nominal_pengeluaran ? 'border-error' : 'border-border-subtle'}`} placeholder="Contoh: 500000" value={form.nominal_pengeluaran} onChange={(e) => updateField('nominal_pengeluaran', e.target.value)} />
        {errors.nominal_pengeluaran && <div className="text-xs text-error mt-1">{errors.nominal_pengeluaran}</div>}
      </div>
      <div className="mb-5">
        <label className="block text-[13px] font-semibold text-text-primary mb-1">Tanggal Pengeluaran</label>
        <input type="date" className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-white border rounded-[14px] outline-none transition-all focus:border-primary ${errors.tanggal_keluar ? 'border-error' : 'border-border-subtle'}`} value={form.tanggal_keluar} onChange={(e) => updateField('tanggal_keluar', e.target.value)} max={new Date().toISOString().split('T')[0]} />
        {errors.tanggal_keluar && <div className="text-xs text-error mt-1">{errors.tanggal_keluar}</div>}
      </div>
      <div className="mb-5">
        <label className="block text-[13px] font-semibold text-text-primary mb-1">Keterangan</label>
        <textarea className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-white border rounded-[14px] outline-none transition-all focus:border-primary ${errors.keterangan ? 'border-error' : 'border-border-subtle'}`} placeholder="Deskripsi pengeluaran..." rows="4" value={form.keterangan} onChange={(e) => updateField('keterangan', e.target.value)} />
        {errors.keterangan && <div className="text-xs text-error mt-1">{errors.keterangan}</div>}
      </div>
    </>
  )

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Manajemen Keuangan</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Kelola Pengeluaran Kas</h1>
        <p className="text-[14.5px] text-text-muted">Kelola data pengeluaran kas RT 08.</p>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-[20px] p-4 px-6 flex items-center justify-between gap-4 flex-wrap mb-8 shadow-lux">
        <div className="flex items-center gap-4 flex-wrap flex-1">
          <div className="flex-1 min-w-[200px] relative">
            <svg className="icon absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            <input type="text" placeholder="Cari kategori..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full py-2 pl-[38px] pr-3 font-sans text-[13.5px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(30,75,133,0.06)]" />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="kategoriFilter" className="text-xs font-semibold text-text-muted uppercase tracking-[0.05em]">Kategori</label>
            <select id="kategoriFilter" value={kategoriFilter} onChange={(e) => setKategoriFilter(e.target.value)} className="px-3.5 py-1.5 pl-[14px] pr-[32px] font-sans text-[13px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] appearance-none cursor-pointer transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(30,75,133,0.06)]">
              <option value="all">Semua</option>
              <option value="Operasional">Operasional</option>
              <option value="Kegiatan">Kegiatan</option>
              <option value="Kebersihan">Kebersihan</option>
              <option value="Keamanan">Keamanan</option>
              <option value="Sosial">Sosial</option>
              <option value="Perbaikan">Perbaikan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <span className="text-xs font-semibold text-text-muted bg-bg px-3.5 py-1 rounded-full border border-border-subtle whitespace-nowrap">{filtered.length} pengeluaran</span>
        </div>
        <Button onClick={openAddModal}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Tambah Pengeluaran
        </Button>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-grotesk text-base font-bold text-text-primary">Daftar Pengeluaran Kas</h3>
          <span style={{ fontSize: "12px", color: "var(--ink-subtle)" }}>Total: {formatRupiah(total)}</span>
        </div>
        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">No</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Kategori</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Nominal</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Tanggal</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Keterangan</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-12 text-text-muted text-[13.5px]">Memuat data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-text-muted text-[13.5px]">Tidak ada pengeluaran.</td></tr>
              ) : filtered.map((item, index) => (
                <tr key={item.id} className="hover:bg-bg">
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle">{index + 1}</td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle"><span className="font-semibold text-text-primary">{item.kategori_pengeluaran}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle"><span className="font-mono text-[12px] text-text-primary">{formatRupiah(item.nominal_pengeluaran)}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle"><span className="font-mono text-[12px] text-text-primary">{formatDate(item.tanggal_keluar)}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle">{item.keterangan}</td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(item.id)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => setConfirmDelete(item)}>Hapus</Button>
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
        title="Tambah Pengeluaran Kas"
        subtitle="Catat pengeluaran kas RT 08."
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
        title="Edit Pengeluaran Kas"
        subtitle="Perbarui data pengeluaran kas RT 08."
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalEdit(null)}>Batal</Button>
            <Button onClick={handleEdit} disabled={saving || loadingEdit}>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
          </>
        }
      >
        {loadingEdit ? (
          <div className="text-center py-8 text-text-muted text-[13.5px]">Memuat data...</div>
        ) : (
          <form onSubmit={handleEdit}>{formFields}</form>
        )}
      </Modal>

      <ConfirmModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete?.id)}
        title="Hapus Pengeluaran"
        message={`Apakah Anda yakin ingin menghapus pengeluaran "${confirmDelete?.keterangan}" sebesar ${formatRupiah(confirmDelete?.nominal_pengeluaran)}?`}
        confirmText="Ya, Hapus"
        variant="danger"
      />

      <AlertModal open={!!alert} onClose={() => { const cb = alert?.onClose; setAlert(null); cb?.() }} type={alert?.type} title={alert?.title} message={alert?.message} />
    </DashboardLayout>
  )
}
