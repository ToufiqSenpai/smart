import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Info } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'

export const Route = createFileRoute('/_dashboard/marketplace/validasi')({
  component: ValidasiUmkmPage,
})

interface PendingUmkm {
  id: string
  name: string
  category: 'Makanan & Minuman' | 'Jasa' | 'Sembako' | 'Elektronik'
  location: string
  phone: string
  imageUrl: string
}

const INITIAL_PENDING_UMKM: PendingUmkm[] = [
  {
    id: 'p_umkm_1',
    name: 'Warung Steak A5 Japan',
    category: 'Makanan & Minuman',
    location: 'Jalan Tokyo Blok C / No. 7',
    phone: '081234567801',
    imageUrl:
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 'p_umkm_2',
    name: 'Tempat Jahit 5 Menit Selesai',
    category: 'Jasa',
    location: 'Jalan Sydney Blok H / No. 32',
    phone: '089876543202',
    imageUrl:
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 'p_umkm_3',
    name: 'Warung Madura Tutup Pas Kiamat',
    category: 'Sembako',
    location: 'Jalan Ngawi Blok U / No. 67',
    phone: '085432109803',
    imageUrl:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60',
  },
]

function ValidasiUmkmPage() {
  const navigate = useNavigate()
  const [pendingList, setPendingList] = useState<PendingUmkm[]>(() => {
    const saved = localStorage.getItem('board_umkm_pending')
    return saved ? JSON.parse(saved) : INITIAL_PENDING_UMKM
  })

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('board_umkm_pending', JSON.stringify(pendingList))
  }, [pendingList])

  const handleAccept = (item: PendingUmkm) => {
    // 1. Retrieve the verified lists from localStorage
    const savedUmkm = localStorage.getItem('mock_umkm')
    const currentList = savedUmkm ? JSON.parse(savedUmkm) : []

    const acceptedUmkm = {
      id: item.id,
      name: item.name,
      rating: 5.0,
      category: item.category,
      location: item.location,
      phone: item.phone,
      imageUrl: item.imageUrl,
    }

    // Append and save
    const updatedList = [acceptedUmkm, ...currentList]
    localStorage.setItem('mock_umkm', JSON.stringify(updatedList))

    // 2. Remove from pending list
    setPendingList((prev) => prev.filter((p) => p.id !== item.id))

    setToastMessage(`UMKM "${item.name}" berhasil disetujui dan diterbitkan!`)
    setTimeout(() => {
      setToastMessage(null)
      // Redirect to the main marketplace directory
      navigate({ to: '/marketplace' })
    }, 1500)
  }

  const handleReject = (item: PendingUmkm) => {
    // Remove from pending validation list
    setPendingList((prev) => prev.filter((p) => p.id !== item.id))

    setToastMessage(`Pendaftaran "${item.name}" ditolak.`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  return (
    <div className="max-w-6xl mx-auto p-1 animate-[fadeIn_0.3s_ease-out] relative">
      {/* Toast Alert */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Page Title */}
      <PageHeader title="Validasi UMKM" />

      {/* Roster Grid list of pending registrations */}
      {pendingList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,71,204,0.02)] transition-all duration-300"
            >
              {/* Image banner */}
              <div className="w-full h-44 bg-slate-50 border-b border-slate-100 relative shadow-inner overflow-hidden select-none">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60'
                  }}
                />
              </div>

              {/* Card content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Nama UMKM */}
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Nama UMKM
                    </span>
                    <h3 className="text-slate-800 font-bold text-sm block mt-0.5 leading-snug">
                      {item.name}
                    </h3>
                  </div>

                  {/* Jenis UMKM */}
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Jenis UMKM
                    </span>
                    <span className="text-slate-600 font-semibold text-xs block mt-0.5">
                      {item.category}
                    </span>
                  </div>

                  {/* Lokasi */}
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Lokasi
                    </span>
                    <span className="text-slate-650 font-semibold text-xs block mt-0.5">
                      {item.location}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2 shrink-0 select-none">
                  <button
                    onClick={() => handleReject(item)}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer text-center"
                  >
                    Tolak
                  </button>
                  <button
                    onClick={() => handleAccept(item)}
                    className="flex-1 bg-[#0047cc] hover:bg-[#003bb3] active:bg-[#003399] text-white rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer text-center shadow-sm shadow-[#0047cc]/15"
                  >
                    Terima
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Info className="w-10 h-10" />}
          title="Semua UMKM tervalidasi"
          description="Tidak ada pengajuan pendaftaran UMKM baru yang menunggu persetujuan."
        />
      )}
    </div>
  )
}
