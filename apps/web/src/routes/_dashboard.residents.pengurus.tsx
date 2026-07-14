import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Toast } from '@/components/ui/Toast'
import { Select } from '@/components/ui/Select'
import { Loader2, Search } from 'lucide-react'

export const Route = createFileRoute('/_dashboard/residents/pengurus')({
  component: PengurusPage,
})

interface Officer {
  id: string
  name: string
  role: 'Ketua RT' | 'Sekretaris' | 'Bendahara'
  address: string
  phone: string
  imageUrl: string
}

const INITIAL_OFFICERS: Officer[] = [
  {
    id: '1',
    name: 'Cristiano Ronaldo',
    role: 'Ketua RT',
    address: 'Blok R / No. 7',
    phone: '086767676769',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    name: 'Jessica Paimon',
    role: 'Sekretaris',
    address: 'Blok B / No. 12',
    phone: '0812-3456-7891',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    name: 'Ayu Tingting',
    role: 'Bendahara',
    address: 'Blok C / No. 3',
    phone: '0898-7654-3212',
    imageUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60',
  },
]

const MOCK_CITIZENS = [
  {
    name: 'Ahmad Subarjo',
    address: 'Blok A / No. 12',
    phone: '0812-3456-7890',
  },
  { name: 'Siti Dewi', address: 'Blok B / No. 05', phone: '0819-8765-4321' },
  { name: 'Budi Pratama', address: 'Blok A / No. 01', phone: '0811-2233-4455' },
  { name: 'Steve Rogers', address: 'Blok D / No. 04', phone: '0899-8888-7777' },
]

function PengurusPage() {
  const [officers, setOfficers] = useState<Officer[]>(INITIAL_OFFICERS)

  // Left detail view selector
  const [selectedDetailName, setSelectedDetailName] =
    useState('Cristiano Ronaldo')

  // Edit form states
  const [editName, setEditName] = useState('Jessica Paimon')
  const [editRole, setEditRole] = useState<
    'Ketua RT' | 'Sekretaris' | 'Bendahara'
  >('Sekretaris')

  // Add form states
  const [addName, setAddName] = useState('Budi Pratama')
  const [addRole, setAddRole] = useState<
    'Ketua RT' | 'Sekretaris' | 'Bendahara'
  >('Bendahara')

  const [isSearching, setIsSearching] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [isAddingOfficer, setIsAddingOfficer] = useState(false)

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Find selected officer details for left card
  const activeDetailOfficer =
    officers.find((o) => o.name === selectedDetailName) || officers[0]

  const handleSearchDetail = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
      setToastMessage(
        `Detail pengurus "${selectedDetailName}" berhasil dimuat!`,
      )
      setTimeout(() => setToastMessage(null), 3000)
    }, 800)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingEdit(true)

    setTimeout(() => {
      setOfficers((prev) =>
        prev.map((off) => {
          if (off.name === editName) {
            return { ...off, role: editRole }
          }
          // If the new role clashes with another officer, demote/swap or just overwrite
          if (off.role === editRole && off.name !== editName) {
            // Swap roles to maintain single officer per role structure
            const oldRoleOfEdited =
              prev.find((o) => o.name === editName)?.role || 'Sekretaris'
            return { ...off, role: oldRoleOfEdited }
          }
          return off
        }),
      )

      setIsSavingEdit(false)
      setToastMessage(
        `Jabatan "${editName}" berhasil diubah menjadi ${editRole}!`,
      )
      setTimeout(() => setToastMessage(null), 4000)
    }, 1200)
  }

  const handleAddOfficer = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddingOfficer(true)

    setTimeout(() => {
      // Find citizen details
      const citizen =
        MOCK_CITIZENS.find((c) => c.name === addName) || MOCK_CITIZENS[0]

      const newOfficer: Officer = {
        id: (officers.length + 1).toString(),
        name: citizen.name,
        role: addRole,
        address: citizen.address,
        phone: citizen.phone,
        imageUrl:
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=60',
      }

      setOfficers((prev) => {
        // Filter out any clashing officer in that role to keep it unique
        const cleanList = prev.filter(
          (o) => o.role !== addRole && o.name !== citizen.name,
        )
        return [...cleanList, newOfficer]
      })

      // Update dropdown view to the newly added officer
      setSelectedDetailName(citizen.name)
      setIsAddingOfficer(false)
      setToastMessage(
        `"${citizen.name}" berhasil ditambahkan sebagai ${addRole}!`,
      )
      setTimeout(() => setToastMessage(null), 4000)
    }, 1200)
  }

  // Helper selectors for roles
  const getOfficerByRole = (role: 'Ketua RT' | 'Sekretaris' | 'Bendahara') => {
    return officers.find((o) => o.role === role)?.name || 'Belum Ditunjuk'
  }

  return (
    <div className="max-w-6xl mx-auto p-1 animate-[fadeIn_0.3s_ease-out] relative space-y-8">
      {/* Toast Alert */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Page Title */}
      <PageHeader title="Daftar Pengurus RT" />

      {/* Grid Roster Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Detail Pengurus Card */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
            <h2 className="text-base font-bold text-slate-800 mb-5">
              Detail Pengurus
            </h2>

            <form onSubmit={handleSearchDetail} className="space-y-6">
              <Select
                label="Nama"
                value={selectedDetailName}
                onChange={(e) => setSelectedDetailName(e.target.value)}
                options={officers.map((off) => ({
                  value: off.name,
                  label: off.name,
                }))}
              />

              {/* Detail Profile Avatar & Info Card */}
              <div className="flex flex-col items-center py-4 border-t border-b border-slate-100/60 space-y-4">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-50 shadow bg-slate-50 flex items-center justify-center shrink-0">
                  <img
                    src={activeDetailOfficer.imageUrl}
                    alt={activeDetailOfficer.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60'
                    }}
                  />
                </div>

                <div className="w-full space-y-3 pt-2">
                  <div className="flex justify-between items-start text-xs border-b border-slate-50 pb-2">
                    <span className="text-slate-400 font-bold uppercase">
                      Jabatan
                    </span>
                    <span className="text-slate-800 font-bold bg-[#edf4ff] text-[#0047cc] px-2.5 py-0.5 rounded-lg">
                      {activeDetailOfficer.role}
                    </span>
                  </div>

                  <div className="flex justify-between items-start text-xs border-b border-slate-50 pb-2">
                    <span className="text-slate-400 font-bold uppercase">
                      Alamat
                    </span>
                    <span className="text-slate-700 font-semibold text-right">
                      {activeDetailOfficer.address}
                    </span>
                  </div>

                  <div className="flex justify-between items-start text-xs">
                    <span className="text-slate-400 font-bold uppercase">
                      Nomor Telepon
                    </span>
                    <span className="text-slate-700 font-bold">
                      {activeDetailOfficer.phone}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="w-full bg-[#0047cc] hover:bg-[#003bb3] active:bg-[#003399] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl py-3 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#0047cc]/15 transition-all"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mencari...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Cari Pengurus</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: active roster, Edit, Add Cards */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Roster */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
            <h2 className="text-base font-bold text-slate-800 mb-4">
              Pengurus RT
            </h2>
            <div className="space-y-3.5 py-1">
              <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Ketua RT
                  </span>
                  <span className="text-slate-800 font-bold text-sm block">
                    {getOfficerByRole('Ketua RT')}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Sekretaris
                  </span>
                  <span className="text-slate-800 font-bold text-sm block">
                    {getOfficerByRole('Sekretaris')}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Bendahara
                  </span>
                  <span className="text-slate-800 font-bold text-sm block">
                    {getOfficerByRole('Bendahara')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Role Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
            <h2 className="text-base font-bold text-slate-800 mb-4">
              Edit Pengurus
            </h2>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Nama"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  options={officers.map((o) => ({
                    value: o.name,
                    label: o.name,
                  }))}
                />

                <Select
                  label="Jabatan"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  options={[
                    { value: 'Ketua RT', label: 'Ketua RT' },
                    { value: 'Sekretaris', label: 'Sekretaris' },
                    { value: 'Bendahara', label: 'Bendahara' },
                  ]}
                />
              </div>

              <button
                type="submit"
                disabled={isSavingEdit}
                className="w-full bg-[#0047cc] hover:bg-[#003bb3] active:bg-[#003399] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl py-3 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#0047cc]/10 transition-all"
              >
                {isSavingEdit ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Edit</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Section 3: Tambah Pengurus Card (Full width at bottom) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
        <h2 className="text-base font-bold text-slate-800 mb-4">
          Tambah Pengurus
        </h2>

        <form onSubmit={handleAddOfficer} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Nama"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              options={MOCK_CITIZENS.map((c) => ({
                value: c.name,
                label: c.name,
              }))}
            />

            <Select
              label="Jabatan"
              value={addRole}
              onChange={(e) => setAddRole(e.target.value as any)}
              options={[
                { value: 'Ketua RT', label: 'Ketua RT' },
                { value: 'Sekretaris', label: 'Sekretaris' },
                { value: 'Bendahara', label: 'Bendahara' },
              ]}
            />
          </div>

          <button
            type="submit"
            disabled={isAddingOfficer}
            className="w-full bg-[#0047cc] hover:bg-[#003bb3] active:bg-[#003399] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl py-3 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#0047cc]/10 transition-all"
          >
            {isAddingOfficer ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menambahkan...</span>
              </>
            ) : (
              <span>Tambah Pengurus</span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
