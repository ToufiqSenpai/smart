import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import {
  Utensils,
  User,
  ShoppingBag,
  Smartphone,
  Star,
  Phone,
  MessageSquare,
  MapPin,
  Plus,
  X,
  Loader2,
  UploadCloud,
  CheckCircle2,
  LayoutGrid,
} from 'lucide-react'

export const Route = createFileRoute('/_dashboard/marketplace')({
  component: MarketplacePage,
})

interface Umkm {
  id: string
  name: string
  rating: number
  category: 'Makanan & Minuman' | 'Jasa' | 'Sembako' | 'Elektronik'
  location: string
  phone: string
  imageUrl: string
  imageName?: string | null
}

const INITIAL_UMKM: Umkm[] = [
  {
    id: '1',
    name: 'Bakso Pak Slamet',
    rating: 4.8,
    category: 'Makanan & Minuman',
    location: '200m dari lokasi Anda',
    phone: '081234567890',
    imageUrl:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    name: 'Jasa Jahit Pakaian',
    rating: 4.5,
    category: 'Jasa',
    location: '150m dari lokasi Anda',
    phone: '089876543210',
    imageUrl:
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    name: 'Toko Sembako Pak Rusdi',
    rating: 4.6,
    category: 'Sembako',
    location: '250m dari lokasi Anda',
    phone: '085432109876',
    imageUrl:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: '4',
    name: 'Toko Pulsa Mas Amba',
    rating: 4.8,
    category: 'Elektronik',
    location: '100m dari lokasi Anda',
    phone: '086767676769',
    imageUrl:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60',
  },
]

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Makanan & Minuman':
      return Utensils
    case 'Jasa':
      return User
    case 'Sembako':
      return ShoppingBag
    case 'Elektronik':
      return Smartphone
    default:
      return LayoutGrid
  }
}

function MarketplacePage() {
  const [umkmList, setUmkmList] = useState<Umkm[]>(INITIAL_UMKM)
  const [selectedFilter, setSelectedFilter] = useState<string>('Semua')

  // Registration modal state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false)
  const [selectedUmkm, setSelectedUmkm] = useState<Umkm | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [category, setCategory] = useState<
    'Makanan & Minuman' | 'Jasa' | 'Sembako' | 'Elektronik'
  >('Makanan & Minuman')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filters mapping
  const filters = [
    { name: 'Semua', icon: LayoutGrid },
    { name: 'Makanan & Minuman', icon: Utensils },
    { name: 'Jasa', icon: User },
    { name: 'Sembako', icon: ShoppingBag },
    { name: 'Elektronik', icon: Smartphone },
  ]

  const filteredList = umkmList.filter((item) => {
    if (selectedFilter === 'Semua') return true
    return item.category === selectedFilter
  })

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    processFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    processFile(file)
  }

  const processFile = (file?: File) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal adalah 5MB.')
        return
      }
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Silakan isi nama UMKM.')
      return
    }
    if (!location.trim()) {
      alert('Silakan isi lokasi UMKM.')
      return
    }
    if (!phone.trim()) {
      alert('Silakan isi nomor Whatsapp.')
      return
    }

    setIsSubmitting(true)

    // Simulate database write
    setTimeout(() => {
      const defaultMockImages: Record<string, string> = {
        'Makanan & Minuman':
          'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60',
        Jasa: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&auto=format&fit=crop&q=60',
        Sembako:
          'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60',
        Elektronik:
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60',
      }

      const newUmkm: Umkm = {
        id: (umkmList.length + 1).toString(),
        name: name.trim(),
        rating: 5.0, // New registered stores get 5.0 initially!
        category,
        location: location.trim(),
        phone: phone.trim(),
        imageUrl: photoPreview || defaultMockImages[category],
        imageName: photoFile?.name || null,
      }

      setUmkmList([newUmkm, ...umkmList])

      // Reset form
      setName('')
      setCategory('Makanan & Minuman')
      setLocation('')
      setPhone('')
      setPhotoFile(null)
      setPhotoPreview(null)
      setIsRegisterModalOpen(false)
      setIsSubmitting(false)
      setSelectedFilter('Semua') // Move to all to see the newly registered item

      // Toast Success
      setToastMessage(
        `UMKM "${newUmkm.name}" berhasil terdaftar di lingkungan RT 05!`,
      )
      setTimeout(() => setToastMessage(null), 4000)
    }, 1500)
  }

  const handleHubungiClick = (item: Umkm) => {
    setSelectedUmkm(item)
    setIsContactModalOpen(true)
  }

  const handleWhatsappClick = (item: Umkm) => {
    setSelectedUmkm(item)
    setIsWhatsappModalOpen(true)
  }

  return (
    <div className="max-w-6xl mx-auto p-1 animate-[fadeIn_0.3s_ease-out] relative">
      {/* Toast Alert */}
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

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#0047cc] tracking-tight">
          Marketplace
        </h1>
      </div>

      {/* Action Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            UMKM Lingkungan RT 05
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Temukan produk, jasa, dan usaha lokal buatan warga RT 05 di sekitar
            Anda.
          </p>
        </div>
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="bg-[#0047cc] hover:bg-[#003bb3] active:bg-[#003399] text-white font-bold rounded-xl px-5 py-3.5 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#0047cc]/15 transition-all self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Daftar UMKM</span>
        </button>
      </div>

      {/* Section Filter and Title */}
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">
            UMKM Sekitar Anda
          </h2>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const isActive = selectedFilter === f.name
              const FilterIcon = f.icon
              return (
                <button
                  key={f.name}
                  onClick={() => setSelectedFilter(f.name)}
                  className={`px-4.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                    isActive
                      ? 'bg-[#0047cc] text-white shadow-sm shadow-[#0047cc]/25'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 bg-white border border-slate-100'
                  }`}
                >
                  <FilterIcon className="w-3.5 h-3.5" />
                  <span>{f.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* UMKM Cards List */}
        <div className="space-y-4">
          {filteredList.length > 0 ? (
            filteredList.map((item) => {
              const CatIcon = getCategoryIcon(item.category)
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:shadow-[0_8px_30px_rgba(0,71,204,0.02)] transition-all duration-300 flex flex-col md:flex-row gap-5 relative overflow-hidden"
                >
                  {/* Image wrapper */}
                  <div className="w-full md:w-56 h-36 md:h-36 shrink-0 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative shadow-inner">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback image source if Unsplash fails
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60'
                      }}
                    />
                  </div>

                  {/* Content details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-slate-800 font-bold text-base leading-snug">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100/40 select-none">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-[10px] font-bold text-amber-700">
                            {item.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-lg text-[9px] font-bold tracking-wide uppercase inline-flex items-center gap-1.5 select-none">
                        <CatIcon className="w-3 h-3" />
                        {item.category}
                      </span>

                      {/* Location details */}
                      <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold select-none">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.location}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 mt-4 md:mt-0 select-none">
                      <button
                        onClick={() => handleHubungiClick(item)}
                        className="border border-slate-200 hover:border-blue-200 hover:bg-[#edf4ff]/30 text-slate-600 hover:text-[#0047cc] font-bold rounded-xl px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Hubungi</span>
                      </button>
                      <button
                        onClick={() => handleWhatsappClick(item)}
                        className="bg-[#0047cc] hover:bg-[#003bb3] text-white font-bold rounded-xl px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-[#0047cc]/10 shrink-0"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Whatsapp</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-slate-700 font-bold text-sm">
                Belum ada UMKM terdaftar
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Jadilah yang pertama mendaftarkan usaha kategori "
                {selectedFilter}" di sini!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Daftar UMKM (Registration Form) */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full p-6 relative animate-[scaleIn_0.2s_ease-out] overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
              <h2 className="text-base font-bold text-slate-800">
                Daftar UMKM Baru
              </h2>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 -mr-1">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Nama UMKM
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Laundry Neng Yangyang"
                    className="w-full bg-slate-50 hover:bg-slate-100/30 border border-slate-200/80 text-slate-700 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Gambar (Image)
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group ${
                      isDragging
                        ? 'border-[#0047cc] bg-blue-50/20'
                        : 'border-slate-200/80 hover:border-[#0047cc]/40 bg-slate-50/40 hover:bg-slate-50/70'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    {photoPreview ? (
                      <div className="relative w-full flex flex-col items-center gap-2 animate-[fadeIn_0.2s_ease-out]">
                        <img
                          src={photoPreview}
                          alt="UMKM Preview"
                          className="max-h-24 rounded-lg object-cover border border-slate-100"
                        />
                        <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[200px]">
                          {photoFile?.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setPhotoFile(null)
                            setPhotoPreview(null)
                          }}
                          className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-sm transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-[#edf4ff] group-hover:text-[#0047cc] transition-colors shrink-0">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-600">
                          Tarik file ke sini atau klik untuk memilih file
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Pill Selectors for Types */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-2.5 block">
                    Jenis UMKM Anda
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        'Makanan & Minuman',
                        'Jasa',
                        'Sembako',
                        'Elektronik',
                      ] as const
                    ).map((catName) => {
                      const isActive = category === catName
                      const CatPillIcon = getCategoryIcon(catName)
                      return (
                        <button
                          type="button"
                          key={catName}
                          onClick={() => setCategory(catName)}
                          className={`px-3 py-2.5 text-[11px] font-semibold border rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none ${
                            isActive
                              ? 'border-[#0047cc] bg-[#edf4ff] text-[#0047cc]'
                              : 'border-slate-200/80 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                          }`}
                        >
                          <CatPillIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{catName}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh : Blok B7/67"
                    className="w-full bg-slate-50 hover:bg-slate-100/30 border border-slate-200/80 text-slate-700 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Nomor Whatsapp
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh : 086767676769"
                    className="w-full bg-slate-50 hover:bg-slate-100/30 border border-slate-200/80 text-slate-700 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all font-semibold"
                  />
                </div>

                <div className="pt-2 flex gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl py-3 text-xs transition-all cursor-pointer text-center"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#0047cc] hover:bg-[#003bb3] active:bg-[#003399] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl py-3 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#0047cc]/10 transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mendaftarkan...</span>
                      </>
                    ) : (
                      <span>Kirim Konfirmasi</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Kontak Details */}
      {isContactModalOpen && selectedUmkm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-xs w-full p-6 relative animate-[scaleIn_0.2s_ease-out]">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">
                Kontak UMKM
              </h2>
              <button
                onClick={() => {
                  setIsContactModalOpen(false)
                  setSelectedUmkm(null)
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details */}
            <div className="py-4 space-y-3.5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  Nama Usaha
                </span>
                <span className="text-slate-800 font-bold text-sm block mt-0.5">
                  {selectedUmkm.name}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  Lokasi/Alamat
                </span>
                <span className="text-slate-600 font-semibold text-xs block mt-0.5">
                  {selectedUmkm.location}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  Nomor Telepon
                </span>
                <span className="text-slate-800 font-bold text-sm block mt-0.5">
                  {selectedUmkm.phone}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsContactModalOpen(false)
                  setSelectedUmkm(null)
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl py-3 text-xs transition-all cursor-pointer text-center"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Whatsapp Chat Mock */}
      {isWhatsappModalOpen && selectedUmkm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-sm w-full p-6 relative animate-[scaleIn_0.2s_ease-out]">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 text-[#0047cc]" />
                WhatsApp Chat
              </h2>
              <button
                onClick={() => {
                  setIsWhatsappModalOpen(false)
                  setSelectedUmkm(null)
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details */}
            <div className="py-4 space-y-4">
              <p className="text-xs text-slate-500 leading-normal">
                Mengirim pesan WhatsApp ke <strong>{selectedUmkm.name}</strong>{' '}
                ({selectedUmkm.phone}):
              </p>
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-xs italic text-slate-600 leading-relaxed shadow-inner">
                "Halo {selectedUmkm.name}, saya warga RT 05 tertarik dengan
                produk/jasa Anda. Apakah masih bisa dipesan? Terima kasih."
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  setIsWhatsappModalOpen(false)
                  setSelectedUmkm(null)
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl py-3 text-xs transition-all cursor-pointer text-center"
              >
                Kembali
              </button>
              <a
                href={`https://wa.me/${selectedUmkm.phone}?text=${encodeURIComponent(`Halo ${selectedUmkm.name}, saya warga RT 05 tertarik dengan produk/jasa Anda. Apakah masih bisa dipesan? Terima kasih.`)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  setIsWhatsappModalOpen(false)
                  setSelectedUmkm(null)
                }}
                className="flex-1 bg-[#0047cc] hover:bg-[#003bb3] text-white font-bold rounded-xl py-3 text-xs cursor-pointer shadow-md shadow-[#0047cc]/10 transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Buka WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
