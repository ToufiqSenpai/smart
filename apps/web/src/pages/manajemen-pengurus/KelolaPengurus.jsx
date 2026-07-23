import { useState, useEffect } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import Modal from "../../components/ui/Modal"
import Button from "../../components/ui/Button"
import ConfirmModal from "../../components/ui/ConfirmModal"
import AlertModal from "../../components/ui/AlertModal"
import { useAuth } from "../../context/AuthContext"
import { getOfficers, getResidents, updateOfficerRole } from "../../api/residents.api"

const jabatanOptions = [
  { value: 'KETUA_RT', label: 'Ketua RT' },
  { value: 'SEKRETARIS', label: 'Sekretaris' },
  { value: 'BENDAHARA', label: 'Bendahara' },
  { value: 'HUMAS', label: 'Humas' },
  { value: 'KEAMANAN', label: 'Keamanan' },
]

export default function KelolaPengurus() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalAdd, setModalAdd] = useState(false)
  const [modalEdit, setModalEdit] = useState(null)
  const [wargaList, setWargaList] = useState([])
  const [selectedWarga, setSelectedWarga] = useState('')
  const [jabatan, setJabatan] = useState('')
  const [periode, setPeriode] = useState('')
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    getOfficers()
      .then(res => setData(res.data))
      .catch(err => console.error('Gagal memuat data pengurus:', err))
      .finally(() => setLoading(false))
  }, [])

  const filteredData = data
    .filter(p => p.nama !== user?.nama)
    .filter(p => {
      return p.nama.toLowerCase().includes(search.toLowerCase()) ||
             p.nik.includes(search) ||
             p.jabatan.toLowerCase().includes(search.toLowerCase())
    })

  function loadWarga() {
    getResidents({ status: 'AKTIF' })
      .then(res => {
        const existingIds = new Set(data.map(o => o.idWarga))
        setWargaList(res.data.filter(w => !existingIds.has(w.id)))
      })
      .catch(err => console.error(err))
  }

  function openAddModal() {
    setSelectedWarga('')
    setJabatan('')
    setPeriode('')
    loadWarga()
    setModalAdd(true)
  }

  function openEditModal(officer) {
    setSelectedWarga(officer.idWarga || '')
    setJabatan(officer.jabatan || '')
    setPeriode(officer.periodeJabatan || '')
    setModalEdit(officer)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!selectedWarga || !jabatan) return
    setSaving(true)
    try {
      await updateOfficerRole(selectedWarga, { jabatan, periodeJabatan: periode })
      const res = await getOfficers()
      setData(res.data)
      setAlert({ type: 'success', title: 'Berhasil', message: 'Pengurus berhasil ditambahkan', onClose: () => { setModalAdd(false) } })
    } catch (err) {
      setAlert({ type: 'error', title: 'Gagal', message: err?.response?.data?.message || err?.message || 'Terjadi kesalahan' })
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit(e) {
    e.preventDefault()
    if (!jabatan) return
    setSaving(true)
    try {
      await updateOfficerRole(selectedWarga, { jabatan, periodeJabatan: periode })
      const res = await getOfficers()
      setData(res.data)
      setAlert({ type: 'success', title: 'Berhasil', message: 'Pengurus berhasil diperbarui', onClose: () => { setModalEdit(null) } })
    } catch (err) {
      setAlert({ type: 'error', title: 'Gagal', message: err?.response?.data?.message || err?.message || 'Terjadi kesalahan' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(officer) {
    try {
      await updateOfficerRole(officer.idWarga, { jabatan: null })
      setData(prev => prev.filter(p => p.id !== officer.id))
      setAlert({ type: 'success', title: 'Berhasil', message: `${officer.nama} sudah tidak menjadi pengurus` })
    } catch (err) {
      setAlert({ type: 'error', title: 'Gagal', message: err?.response?.data?.message || err?.message || 'Terjadi kesalahan' })
    }
    setConfirmDelete(null)
  }

  const formFields = (
    <>
      {!modalEdit && (
        <div className="mb-5">
          <label className="block text-[13px] font-semibold text-text-primary mb-1">Pilih Warga</label>
          <select className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-white border border-border-subtle rounded-[14px] outline-none" value={selectedWarga} onChange={(e) => setSelectedWarga(e.target.value)}>
            <option value="">-- Pilih Warga --</option>
            {wargaList.map(w => <option key={w.id} value={w.id}>{w.nama} - {w.nik}</option>)}
          </select>
        </div>
      )}
      <div className="mb-5">
        <label className="block text-[13px] font-semibold text-text-primary mb-1">Jabatan</label>
        <select className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-white border border-border-subtle rounded-[14px] outline-none" value={jabatan} onChange={(e) => setJabatan(e.target.value)}>
          <option value="">-- Pilih Jabatan --</option>
          {jabatanOptions.map(j => <option key={j.value} value={j.value}>{j.label}</option>)}
        </select>
      </div>
      <div className="mb-5">
        <label className="block text-[13px] font-semibold text-text-primary mb-1">Periode Jabatan</label>
        <input type="text" className="w-full px-[14px] py-[10px] font-sans text-sm text-text-primary bg-white border border-border-subtle rounded-[14px] outline-none" placeholder="Contoh: 2026-2028" value={periode} onChange={(e) => setPeriode(e.target.value)} />
      </div>
    </>
  )

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Manajemen Pengurus</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Kelola Pengurus RT</h1>
        <p className="text-[14.5px] text-text-muted">Kelola data kepengurusan RT 08.</p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex items-center">
            <svg className="icon absolute left-3.5 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            <input type="text" placeholder="Cari nama, NIK, atau jabatan..." className="w-[260px] py-2.5 pl-[42px] pr-3.5 rounded-[10px] border border-border-subtle bg-bg-card text-[13.5px] text-text-primary font-sans transition-all shadow-lux focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(30,75,133,0.08)] placeholder:text-text-muted" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span className="text-xs font-semibold text-text-muted px-3.5 py-1.5 bg-bg-card rounded-full border border-border-subtle shadow-lux">{filteredData.length} pengurus</span>
        </div>
        <Button onClick={openAddModal}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Tambah Pengurus
        </Button>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between">
          <h3 className="font-grotesk text-base font-bold text-text-primary">Daftar Pengurus RT</h3>
          <span style={{ fontSize: "12px", color: "var(--ink-subtle)" }}>Total: {filteredData.length} pengurus</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-bg">
              <tr>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">No</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">Nama</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">NIK</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">Jabatan</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-12 text-text-muted text-[13.5px]">Memuat data...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-12 text-text-muted text-[13.5px]">Tidak ada data pengurus.</td></tr>
              ) : filteredData.map((p, index) => {
                const isKetua = p.jabatan === 'CHAIRPERSON' || p.jabatan === 'KETUA_RT'
                return (
                  <tr key={p.id} className="hover:bg-primary-lighter">
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6">{index + 1}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6" style={{ fontWeight: 600, color: "var(--ink-black)" }}>{p.nama}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6 font-mono text-[13px]">{p.nik}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6">{p.jabatan}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6 text-right pr-6">
                      <div className="flex items-center gap-2 justify-end">
                        {!isKetua && (
                          <Button variant="outline" size="sm" onClick={() => openEditModal(p)}>Edit</Button>
                        )}
                        {!isKetua && (
                          <Button variant="danger" size="sm" onClick={() => setConfirmDelete(p)}>
                            Hapus
                          </Button>
                        )}
                        {isKetua && (
                          <span className="text-[11px] text-text-muted italic">Ketua RT</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalAdd}
        onClose={() => setModalAdd(false)}
        title="Tambah Pengurus RT"
        subtitle="Tambahkan pengurus baru untuk kepengurusan RT 08."
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalAdd(false)}>Batal</Button>
            <Button onClick={handleAdd} disabled={saving || !selectedWarga || !jabatan}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
          </>
        }
      >
        <form onSubmit={handleAdd}>{formFields}</form>
      </Modal>

      <Modal
        open={!!modalEdit}
        onClose={() => setModalEdit(null)}
        title="Edit Pengurus RT"
        subtitle="Edit data kepengurusan RT 08."
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalEdit(null)}>Batal</Button>
            <Button onClick={handleEdit} disabled={saving || !jabatan}>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
          </>
        }
      >
        <form onSubmit={handleEdit}>{formFields}</form>
      </Modal>

      <ConfirmModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete)}
        title="Hapus Pengurus"
        message={`Apakah Anda yakin ingin menghapus "${confirmDelete?.nama}" dari kepengurusan RT?`}
        confirmText="Ya, Hapus"
        variant="danger"
      />

      <AlertModal open={!!alert} onClose={() => { const cb = alert?.onClose; setAlert(null); cb?.() }} type={alert?.type} title={alert?.title} message={alert?.message} />
    </DashboardLayout>
  )
}
