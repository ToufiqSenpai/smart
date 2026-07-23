import { useState, useEffect } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import Modal from "../../components/ui/Modal"
import Button from "../../components/ui/Button"
import ConfirmModal from "../../components/ui/ConfirmModal"
import AlertModal from "../../components/ui/AlertModal"
import { getAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement } from "../../api/announcements.api"

const statusClass = {
  PUBLISHED: "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold border bg-success-bg text-success border-success/10",
  DRAFT: "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold border bg-warning-bg text-warning border-warning/10",
}

function formatDate(dateStr) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
  const parts = dateStr.split('-')
  return parseInt(parts[2]) + ' ' + months[parseInt(parts[1]) - 1] + ' ' + parts[0]
}

const initialForm = { judul: '', isi: '', status: '' }

export default function KetuaPengumuman() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
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
    getAnnouncements()
      .then(res => setData(res.data))
      .catch(err => console.error('Gagal memuat pengumuman:', err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = data.filter((p) => {
    const matchSearch = p.judul.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || p.status_publikasi === statusFilter
    return matchSearch && matchStatus
  })

  function refresh() {
    getAnnouncements()
      .then(res => setData(res.data))
      .catch(err => console.error('Gagal memuat pengumuman:', err))
  }

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  function validate() {
    const newErrors = {}
    if (!form.judul.trim()) newErrors.judul = 'Judul harus diisi'
    if (!form.isi.trim()) newErrors.isi = 'Isi pengumuman harus diisi'
    if (!form.status) newErrors.status = 'Status harus dipilih'
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
      const res = await getAnnouncementById(id)
      const d = res.data
      setForm({
        judul: d.judul || '',
        isi: d.isi_pengumuman || '',
        status: d.status_publikasi === 'PUBLISHED' ? 'publik' : 'draft',
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
      await createAnnouncement({
        judul: form.judul,
        isi_pengumuman: form.isi,
        status_publikasi: form.status === 'publik' ? 'PUBLISHED' : 'DRAFT',
      })
      setAlert({ type: 'success', title: 'Berhasil', message: 'Pengumuman berhasil ditambahkan', onClose: () => { refresh(); setModalAdd(false) } })
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
      await updateAnnouncement(modalEdit, {
        judul: form.judul,
        isi_pengumuman: form.isi,
        status_publikasi: form.status === 'publik' ? 'PUBLISHED' : 'DRAFT',
      })
      setAlert({ type: 'success', title: 'Berhasil', message: 'Pengumuman berhasil diperbarui', onClose: () => { refresh(); setModalEdit(null) } })
    } catch (err) {
      setAlert({ type: 'error', title: 'Gagal', message: err?.response?.data?.message || err?.message || 'Terjadi kesalahan' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteAnnouncement(id)
      refresh()
      setConfirmDelete(null)
      setAlert({ type: 'success', title: 'Berhasil', message: 'Pengumuman berhasil dihapus' })
    } catch (err) {
      setAlert({ type: 'error', title: 'Gagal', message: err?.response?.data?.message || err?.message || 'Terjadi kesalahan' })
      setConfirmDelete(null)
    }
  }

  const formFields = (
    <>
      <div className="mb-5">
        <label className="block text-[13px] font-semibold text-text-primary mb-1">Judul Pengumuman</label>
        <input type="text" className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-white border rounded-[14px] outline-none transition-all focus:border-primary ${errors.judul ? 'border-error' : 'border-border-subtle'}`} placeholder="Masukkan judul pengumuman" value={form.judul} onChange={(e) => updateField('judul', e.target.value)} />
        {errors.judul && <div className="text-xs text-error mt-1">{errors.judul}</div>}
      </div>
      <div className="mb-5">
        <label className="block text-[13px] font-semibold text-text-primary mb-1">Isi Pengumuman</label>
        <textarea className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-white border rounded-[14px] outline-none transition-all focus:border-primary ${errors.isi ? 'border-error' : 'border-border-subtle'}`} placeholder="Tulis isi pengumuman di sini..." rows="5" value={form.isi} onChange={(e) => updateField('isi', e.target.value)} />
        {errors.isi && <div className="text-xs text-error mt-1">{errors.isi}</div>}
      </div>
      <div className="mb-5">
        <label className="block text-[13px] font-semibold text-text-primary mb-1">Status Publikasi</label>
        <select className={`w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-white border rounded-[14px] outline-none transition-all focus:border-primary ${errors.status ? 'border-error' : 'border-border-subtle'}`} value={form.status} onChange={(e) => updateField('status', e.target.value)}>
          <option value="">-- Pilih Status --</option>
          <option value="draft">Draft (belum dipublikasikan)</option>
          <option value="publik">Publik (langsung terlihat warga)</option>
        </select>
        {errors.status && <div className="text-xs text-error mt-1">{errors.status}</div>}
      </div>
    </>
  )

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Manajemen Informasi</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Kelola Pengumuman</h1>
        <p className="text-[14.5px] text-text-muted">Buat dan kelola pengumuman untuk warga RT 08.</p>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-[20px] p-4 px-6 flex items-center justify-between gap-4 flex-wrap mb-8 shadow-lux">
        <div className="flex items-center gap-4 flex-wrap flex-1">
          <div className="flex-1 min-w-[200px] relative">
            <svg className="icon absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            <input type="text" placeholder="Cari judul pengumuman..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full py-2 pl-[38px] pr-3 font-sans text-[13.5px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(30,75,133,0.06)]" />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="statusFilter" className="text-xs font-semibold text-text-muted uppercase tracking-[0.05em]">Status</label>
            <select id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3.5 py-1.5 pl-[14px] pr-[32px] font-sans text-[13px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] appearance-none cursor-pointer transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(30,75,133,0.06)]">
              <option value="all">Semua</option>
              <option value="PUBLISHED">Publik</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
          <span className="text-xs font-semibold text-text-muted bg-bg px-3.5 py-1 rounded-full border border-border-subtle whitespace-nowrap">{filtered.length} pengumuman</span>
        </div>
        <Button onClick={openAddModal}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Tambah Pengumuman
        </Button>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-grotesk text-base font-bold text-text-primary">Daftar Pengumuman</h3>
          <span style={{ fontSize: "12px", color: "var(--ink-subtle)" }}>Total: {filtered.length} pengumuman</span>
        </div>
        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">No</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Judul</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Tanggal</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Status</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-12 text-text-muted text-[13.5px]">Memuat data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-12 text-text-muted text-[13.5px]">Tidak ada pengumuman.</td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p.id} className="hover:bg-bg">
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle">{i + 1}</td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle"><span className="font-semibold text-text-primary">{p.judul}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle"><span className="font-mono text-[12px] text-text-primary">{formatDate(p.tanggal_pengumuman)}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle"><span className={statusClass[p.status_publikasi]}>{p.status_publikasi === "PUBLISHED" ? "Publik" : "Draft"}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(p.id)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => setConfirmDelete(p)}>Hapus</Button>
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
        title="Tambah Pengumuman"
        subtitle="Buat pengumuman baru untuk warga RT 08."
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
        title="Edit Pengumuman"
        subtitle="Ubah pengumuman untuk warga RT 08."
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
        title="Hapus Pengumuman"
        message={`Apakah Anda yakin ingin menghapus pengumuman "${confirmDelete?.judul}"?`}
        confirmText="Ya, Hapus"
        variant="danger"
      />

      <AlertModal open={!!alert} onClose={() => { const cb = alert?.onClose; setAlert(null); cb?.() }} type={alert?.type} title={alert?.title} message={alert?.message} />
    </DashboardLayout>
  )
}
