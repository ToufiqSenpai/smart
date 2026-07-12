import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  PlusCircle,
  Loader2,
} from 'lucide-react'

export const Route = createFileRoute('/_dashboard/residents/warga')({
  component: WargaPage,
})

interface Citizen {
  id: string
  name: string
  nationality: string
  age: number
  kkNumber: string
  address: string
  phone: string
  job: string
  role: 'KK' | 'Anggota'
  billingStatus: 'Lunas' | 'Menunggak'
}

const INITIAL_CITIZENS: Citizen[] = [
  {
    id: '1',
    name: 'Ahmad Subarjo',
    nationality: 'WNI',
    age: 42,
    kkNumber: '3273112405820001',
    address: 'Blok A / No. 12',
    phone: '0812-3456-7890',
    job: 'Wiraswasta',
    role: 'KK',
    billingStatus: 'Lunas',
  },
  {
    id: '2',
    name: 'Siti Dewi',
    nationality: 'WNI',
    age: 38,
    kkNumber: '3273112405820005',
    address: 'Blok B / No. 05',
    phone: '0819-8765-4321',
    job: 'IRT',
    role: 'Anggota',
    billingStatus: 'Menunggak',
  },
  {
    id: '3',
    name: 'Budi Pratama',
    nationality: 'WNI',
    age: 50,
    kkNumber: '3273112405820003',
    address: 'Blok A / No. 01',
    phone: '0811-2233-4455',
    job: 'Karyawan Swasta',
    role: 'KK',
    billingStatus: 'Lunas',
  },
]

function WargaPage() {
  const [citizens, setCitizens] = useState<Citizen[]>(INITIAL_CITIZENS)

  // Form states
  const [name, setName] = useState('')
  const [kkNumber, setKkNumber] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [job, setJob] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleAddWarga = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Nama wajib diisi.')
      return
    }
    if (!kkNumber.trim()) {
      alert('Nomor KK wajib diisi.')
      return
    }
    if (!address.trim()) {
      alert('Alamat wajib diisi.')
      return
    }
    if (!phone.trim()) {
      alert('Nomor telepon wajib diisi.')
      return
    }
    if (!job.trim()) {
      alert('Pekerjaan wajib diisi.')
      return
    }

    setIsSubmitting(true)

    // Simulate saving citizen
    setTimeout(() => {
      const newCitizen: Citizen = {
        id: (citizens.length + 1).toString(),
        name: name.trim(),
        nationality: 'WNI',
        age: Math.floor(18 + Math.random() * 50),
        kkNumber: kkNumber.trim(),
        address: address.trim(),
        phone: phone.trim(),
        job: job.trim(),
        role:
          citizens.filter((c) => c.kkNumber === kkNumber.trim()).length > 0
            ? 'Anggota'
            : 'KK',
        billingStatus: 'Lunas',
      }

      setCitizens([newCitizen, ...citizens])

      // Reset form
      setName('')
      setKkNumber('')
      setAddress('')
      setPhone('')
      setJob('')
      setIsSubmitting(false)

      // Toast Notification
      setToastMessage(
        `Warga "${newCitizen.name}" berhasil ditambahkan ke database!`,
      )
      setTimeout(() => setToastMessage(null), 4000)
    }, 1200)
  }

  // Get initials for avatar icon
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  // Avatar bg colors based on index/name
  const getAvatarBg = (id: string) => {
    const num = parseInt(id) || 0
    const colors = [
      'bg-blue-100 text-blue-700 border-blue-200/50',
      'bg-emerald-100 text-emerald-700 border-emerald-200/50',
      'bg-amber-100 text-amber-700 border-amber-200/50',
      'bg-indigo-100 text-indigo-700 border-indigo-200/50',
      'bg-rose-100 text-rose-700 border-rose-200/50',
    ]
    return colors[num % colors.length]
  }

  return (
    <div className="max-w-6xl mx-auto p-1 animate-[fadeIn_0.3s_ease-out] relative space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0047cc] text-white font-semibold text-xs px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 animate-[slideIn_0.2s_ease-out]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-[#003bb3] rounded-lg transition-colors ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-[#0047cc] tracking-tight">
          Data Warga
        </h1>
      </div>

      {/* Section 1: Tambah Warga Form */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#edf4ff] text-[#0047cc] flex items-center justify-center shrink-0 border border-slate-50 shadow-sm">
            <PlusCircle className="w-4.5 h-4.5" />
          </div>
          <h2 className="text-base font-bold text-slate-800">Tambah Warga</h2>
        </div>

        <form onSubmit={handleAddWarga} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                Nama
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh : Steve Roger"
                className="w-full bg-slate-50 hover:bg-slate-100/30 border border-slate-200/80 text-slate-700 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                No. KK
              </label>
              <input
                type="text"
                value={kkNumber}
                onChange={(e) => setKkNumber(e.target.value)}
                placeholder="Contoh : 3273082005820003"
                className="w-full bg-slate-50 hover:bg-slate-100/30 border border-slate-200/80 text-slate-700 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                Alamat (Blok/No)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Contoh : Blok B/ No. 7"
                className="w-full bg-slate-50 hover:bg-slate-100/30 border border-slate-200/80 text-slate-700 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                Nomor Telepon
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh : 086767676769"
                className="w-full bg-slate-50 hover:bg-slate-100/30 border border-slate-200/80 text-slate-700 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                Pekerjaan
              </label>
              <input
                type="text"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                placeholder="Contoh : Youtuber"
                className="w-full bg-slate-50 hover:bg-slate-100/30 border border-slate-200/80 text-slate-700 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0047cc] hover:bg-[#003bb3] active:bg-[#003399] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl py-3 mt-4 transition-all shadow-md shadow-[#0047cc]/15 text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menambahkan...</span>
              </>
            ) : (
              <span>Tambah Warga</span>
            )}
          </button>
        </form>
      </div>

      {/* Section 2: Warga List Table */}
      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] overflow-hidden flex flex-col">
        {/* Table responsive view */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-6 py-4 bg-slate-50/20 border-b border-slate-100">
                  Nama Lengkap
                </th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-6 py-4 bg-slate-50/20 border-b border-slate-100">
                  No. KK
                </th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-6 py-4 bg-slate-50/20 border-b border-slate-100">
                  Alamat (Blok/No)
                </th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-6 py-4 bg-slate-50/20 border-b border-slate-100">
                  Telepon
                </th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-6 py-4 bg-slate-50/20 border-b border-slate-100">
                  Pekerjaan
                </th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-6 py-4 bg-slate-50/20 border-b border-slate-100">
                  Status Peran
                </th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-6 py-4 bg-slate-50/20 border-b border-slate-100">
                  Status Iuran
                </th>
              </tr>
            </thead>
            <tbody>
              {citizens.map((citizen) => (
                <tr
                  key={citizen.id}
                  className="border-b border-slate-100/60 hover:bg-slate-50/10 transition-colors"
                >
                  {/* Name and avatar info */}
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center shrink-0 border shadow-inner select-none ${getAvatarBg(
                        citizen.id,
                      )}`}
                    >
                      {getInitials(citizen.name)}
                    </div>
                    <div className="min-w-0">
                      <span className="text-slate-800 font-bold text-xs block leading-tight">
                        {citizen.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">
                        {citizen.nationality} • {citizen.age} Thn
                      </span>
                    </div>
                  </td>

                  {/* KK Number */}
                  <td className="px-6 py-4 text-xs text-slate-500 font-semibold">
                    {citizen.kkNumber}
                  </td>

                  {/* Address */}
                  <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                    {citizen.address}
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4 text-xs text-slate-500 font-semibold">
                    {citizen.phone}
                  </td>

                  {/* Job */}
                  <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                    {citizen.job}
                  </td>

                  {/* Role status badge */}
                  <td className="px-6 py-4 text-xs">
                    {citizen.role === 'KK' ? (
                      <span className="bg-[#0047cc] text-white font-bold px-2 py-0.5 rounded text-[9px] tracking-wide uppercase inline-block select-none">
                        KK
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 border border-slate-200/50 font-bold px-2 py-0.5 rounded text-[9px] tracking-wide uppercase inline-block select-none">
                        Anggota
                      </span>
                    )}
                  </td>

                  {/* Billing status badge */}
                  <td className="px-6 py-4 text-xs">
                    {citizen.billingStatus === 'Lunas' ? (
                      <span className="text-emerald-600 font-bold text-xs flex items-center gap-1.5 select-none">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                        Lunas
                      </span>
                    ) : (
                      <span className="text-rose-600 font-bold text-xs flex items-center gap-1.5 select-none">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0" />
                        Menunggak
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-slate-100 bg-slate-50/10 text-xs">
          <span className="text-slate-400 font-semibold">
            Menampilkan {citizens.length} dari 452 warga
          </span>
          <div className="flex items-center gap-1.5 select-none">
            <button
              className="p-1 border border-slate-200 text-slate-400 hover:text-slate-700 disabled:text-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              disabled
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 bg-[#0047cc] text-white font-bold rounded-lg text-xs flex items-center justify-center cursor-pointer shadow-sm shadow-[#0047cc]/15">
              1
            </button>
            <button className="w-7 h-7 border border-slate-200 text-slate-500 hover:text-slate-800 font-bold rounded-lg text-xs flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
              2
            </button>
            <button className="w-7 h-7 border border-slate-200 text-slate-500 hover:text-slate-800 font-bold rounded-lg text-xs flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
              3
            </button>
            <span className="text-slate-400 font-bold px-1 select-none">
              ...
            </span>
            <button className="w-7 h-7 border border-slate-200 text-slate-500 hover:text-slate-800 font-bold rounded-lg text-xs flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
              12
            </button>
            <button className="p-1 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
