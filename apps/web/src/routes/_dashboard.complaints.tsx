import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import {
  AlertTriangle,
  Droplet,
  Shield,
  History,
  UploadCloud,
  X,
  Loader2,
  MessageSquare,
  CheckCircle2,
  User,
  ClipboardList,
  ChevronDown,
  Info,
  Trash2,
} from 'lucide-react'

export const Route = createFileRoute('/_dashboard/complaints')({
  component: ComplaintsPage,
})

interface Complaint {
  id: string
  ticketNumber: string
  title: string
  category: 'Infrastructure' | 'Sanitation' | 'Security' | 'Public Facility'
  priority: 'Low' | 'Medium' | 'High'
  status: 'PENDING' | 'IN PROGRESS' | 'RESOLVED'
  description: string
  timeAgo: string
  date: string
  statusProgress: number
  photoUrl?: string | null
  photoName?: string | null
  officerName?: string | null
  adminResponse?: string | null
}

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: '1',
    ticketNumber: 'INF-9021',
    title: 'Tiang Lampu Jalan Padam',
    category: 'Infrastructure',
    priority: 'High',
    status: 'PENDING',
    description:
      'Lampu jalan di depan Blok C1 nomor 12 mati total sejak kemarin malam. Area menjadi sangat gelap dan rawan.',
    timeAgo: '2 Jam yang lalu',
    date: '11 Jul 2026, 07:18',
    statusProgress: 15,
    photoUrl: null,
    officerName: null,
    adminResponse: null,
  },
  {
    id: '2',
    ticketNumber: 'SAN-8832',
    title: 'Pipa Air Bocor di Gerbang Timur',
    category: 'Sanitation',
    priority: 'Medium',
    status: 'IN PROGRESS',
    description:
      'Ada genangan air cukup besar di dekat pos satpam gerbang timur. Sepertinya ada kebocoran pipa bawah tanah.',
    timeAgo: 'Kemarin, 14:20',
    date: '10 Jul 2026, 14:20',
    statusProgress: 65,
    photoUrl: null,
    officerName: 'Bp. Sukirman',
    adminResponse:
      'Laporan diterima. Tim teknis PAM sudah dihubungi dan dijadwalkan tiba sore ini jam 16:00. Mohon warga berhati-hati saat melintas.',
  },
  {
    id: '3',
    ticketNumber: 'SAN-4112',
    title: 'Sampah Menumpuk di Area Taman',
    category: 'Sanitation',
    priority: 'Low',
    status: 'RESOLVED',
    description:
      'Sampah di tempat sampah taman utama menumpuk dan mulai menimbulkan bau tidak sedap.',
    timeAgo: '12 Oct 2023, 09:00',
    date: '12 Oct 2023, 09:00',
    statusProgress: 100,
    photoUrl: null,
    officerName: 'Petugas Kebersihan',
    adminResponse:
      'Sampah sudah diangkut oleh armada dinas kebersihan pagi ini.',
  },
]

const getCategoryStyles = (category: string, status?: string) => {
  switch (category) {
    case 'Infrastructure':
      return {
        icon: AlertTriangle,
        bg: 'bg-rose-50 border-rose-100 text-rose-500',
      }
    case 'Sanitation':
      if (status === 'RESOLVED') {
        return {
          icon: TrashIconPlaceholder, // We can use dynamic check or direct Icon
          bg: 'bg-slate-50 border-slate-100 text-slate-500',
        }
      }
      return {
        icon: Droplet,
        bg: 'bg-emerald-50 border-emerald-100 text-emerald-600',
      }
    case 'Security':
      return {
        icon: Shield,
        bg: 'bg-amber-50 border-amber-100 text-amber-600',
      }
    default:
      return {
        icon: Info,
        bg: 'bg-slate-50 border-slate-100 text-slate-500',
      }
  }
}
const TrashIconPlaceholder = Trash2

function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS)
  const [category, setCategory] = useState<
    'Infrastructure' | 'Sanitation' | 'Security' | 'Public Facility'
  >('Infrastructure')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low')
  const [description, setDescription] = useState('')

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) {
      alert('Silakan isi deskripsi keluhan terlebih dahulu.')
      return
    }

    setIsSubmitting(true)

    // Simulate database submission latency
    setTimeout(() => {
      const ticketPrefix =
        category === 'Infrastructure'
          ? 'INF'
          : category === 'Sanitation'
            ? 'SAN'
            : category === 'Security'
              ? 'SEC'
              : 'PUB'
      const ticketNumber = `${ticketPrefix}-${Math.floor(1000 + Math.random() * 9000)}`

      // Derive title from description
      const trimmedDesc = description.trim()
      const title =
        trimmedDesc.length > 35 ? `${trimmedDesc.slice(0, 35)}...` : trimmedDesc

      const newComplaint: Complaint = {
        id: (complaints.length + 1).toString(),
        ticketNumber,
        title,
        category,
        priority,
        status: 'PENDING',
        description: trimmedDesc,
        timeAgo: 'Baru saja',
        date: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        statusProgress: 15, // initial progress matching the pending state flow
        photoUrl: photoPreview,
        photoName: photoFile?.name || null,
        officerName: null,
        adminResponse: null,
      }

      setComplaints([newComplaint, ...complaints])

      // Reset form
      setCategory('Infrastructure')
      setPriority('Low')
      setDescription('')
      setPhotoFile(null)
      setPhotoPreview(null)
      setIsSubmitting(false)

      // Trigger Toast
      setToastMessage('Laporan keluhan Anda berhasil dikirim!')
      setTimeout(() => {
        setToastMessage(null)
      }, 4000)
    }, 1200)
  }

  const activeCount = complaints.filter((c) => c.status !== 'RESOLVED').length

  return (
    <div className="max-w-6xl mx-auto p-1 animate-[fadeIn_0.3s_ease-out] relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white font-semibold text-xs px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 animate-[slideIn_0.2s_ease-out]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-emerald-700 rounded-lg transition-colors ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#0047cc] tracking-tight">
          Keluhan Warga
        </h1>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Buat Laporan Baru */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex flex-col">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#edf4ff] text-[#0047cc] flex items-center justify-center shrink-0">
                <ClipboardList className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-base font-bold text-slate-800">
                Buat Laporan Baru
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category & Priority Select Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Kategori
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200/80 text-slate-700 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all appearance-none cursor-pointer pr-9 font-medium"
                    >
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Sanitation">Sanitation</option>
                      <option value="Security">Security</option>
                      <option value="Public Facility">Public Facility</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Prioritas
                  </label>
                  <div className="relative">
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200/80 text-slate-700 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all appearance-none cursor-pointer pr-9 font-medium"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Complaint Description */}
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                  Deskripsi Keluhan
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200/80 text-slate-700 placeholder-slate-400 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all resize-none h-32 leading-relaxed"
                  placeholder="Jelaskan detail masalah..."
                />
              </div>

              {/* Supporting Photo Upload Area */}
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                  Foto Pendukung
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
                        alt="Preview"
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
                        Unggah atau tarik foto ke sini
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        MAKSIMAL 5MB (JPG, PNG)
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0047cc] hover:bg-[#003bb3] active:bg-[#003399] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none text-white font-bold rounded-xl py-3 mt-4 transition-all shadow-md shadow-[#0047cc]/15 text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Kirim Laporan...</span>
                  </>
                ) : (
                  <span>Kirim Laporan</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Riwayat Keluhan */}
        <div className="lg:col-span-7 space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <History className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-base font-bold text-slate-800">
                Riwayat Keluhan
              </h2>
            </div>
            <span className="bg-[#edf4ff] text-[#0047cc] font-semibold text-xs px-2.5 py-0.5 rounded-full select-none">
              {activeCount} Aktif
            </span>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {complaints.map((c) => {
              const isPending = c.status === 'PENDING'
              const isInProgress = c.status === 'IN PROGRESS'
              const isResolved = c.status === 'RESOLVED'

              const styles = getCategoryStyles(c.category, c.status)
              const IconComponent = styles.icon

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:shadow-[0_8px_30px_rgba(0,71,204,0.02)] transition-all duration-300 flex flex-col gap-4 relative animate-[fadeIn_0.3s_ease-out]"
                >
                  {/* Card Header Row */}
                  <div className="flex gap-4">
                    {/* Category Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${styles.bg}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Title and Details */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-slate-900 font-bold text-sm leading-snug">
                        {c.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">
                        {c.ticketNumber} • {c.timeAgo}
                      </p>
                    </div>

                    {/* Right Badges */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0 select-none">
                      {/* Priority Badge */}
                      {c.priority === 'High' && (
                        <span className="bg-rose-100 text-rose-700 border border-rose-200/50 font-bold px-2 py-0.5 rounded text-[9px] tracking-wide uppercase">
                          High Priority
                        </span>
                      )}
                      {c.priority === 'Medium' && (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200/50 font-bold px-2 py-0.5 rounded text-[9px] tracking-wide uppercase">
                          Medium Priority
                        </span>
                      )}
                      {c.priority === 'Low' && (
                        <span className="bg-slate-100 text-slate-600 border border-slate-200/50 font-bold px-2 py-0.5 rounded text-[9px] tracking-wide uppercase">
                          Low Priority
                        </span>
                      )}

                      {/* Status Badge */}
                      {isPending && (
                        <span className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded text-[9px] tracking-wide uppercase">
                          Pending
                        </span>
                      )}
                      {isInProgress && (
                        <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-[9px] tracking-wide uppercase">
                          In Progress
                        </span>
                      )}
                      {isResolved && (
                        <span className="bg-emerald-700 text-white font-bold px-2 py-0.5 rounded text-[9px] tracking-wide uppercase">
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Description */}
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {c.description}
                  </p>

                  {/* Attachment Photo Thumbnail */}
                  {c.photoUrl && (
                    <div className="mt-0.5">
                      <img
                        src={c.photoUrl}
                        alt="Foto Pendukung"
                        className="max-h-36 rounded-2xl object-cover border border-slate-100"
                      />
                    </div>
                  )}

                  {/* Admin Tanggapan Box */}
                  {c.adminResponse && isInProgress && (
                    <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 flex gap-3 mt-0.5">
                      <MessageSquare className="text-blue-500 shrink-0 w-4 h-4 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-blue-900 block">
                          Tanggapan Admin (RT/RW)
                        </span>
                        <p className="text-xs text-slate-600 italic mt-1 leading-relaxed">
                          "{c.adminResponse}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Progress Bar (Visible for Pending and In Progress) */}
                  {!isResolved && (
                    <div className="mt-0.5">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-slate-500">Status Perbaikan</span>
                        <span className="text-blue-600">
                          {c.statusProgress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${c.statusProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Officer Footer (Pending & In Progress) or Resolved Footer */}
                  {!isResolved ? (
                    <div className="flex items-center gap-2 mt-1 pt-3.5 border-t border-slate-100/60">
                      {c.officerName ? (
                        <>
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0047cc] font-bold flex items-center justify-center text-[10px] border border-blue-200/50">
                            {c.officerName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <span className="text-xs font-semibold text-slate-700">
                            Ditangani: {c.officerName}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-6 h-6 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-200">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-semibold text-slate-400">
                            Petugas: Belum Ditunjuk
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="bg-emerald-50/50 border border-emerald-100/30 rounded-2xl p-3 flex items-center gap-2 mt-0.5 text-emerald-800 text-xs font-medium animate-[fadeIn_0.2s_ease-out]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Selesai pada {c.timeAgo}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
