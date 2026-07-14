import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Toast } from '@/components/ui/Toast'
import { PageHeader } from '@/components/ui/PageHeader'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { FileUploader } from '@/components/ui/FileUploader'
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

export const Route = createFileRoute('/_dashboard/complaints/')({
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
          icon: TrashIconPlaceholder,
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
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('mock_complaints')
    if (saved) {
      const parsed = JSON.parse(saved)
      const combined = [...parsed]
      INITIAL_COMPLAINTS.forEach((def) => {
        if (!combined.some((c) => c.id === def.id)) {
          combined.push(def)
        }
      })
      return combined
    }
    return INITIAL_COMPLAINTS
  })

  const [category, setCategory] = useState<
    'Infrastructure' | 'Sanitation' | 'Security' | 'Public Facility'
  >('Infrastructure')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low')
  const [description, setDescription] = useState('')

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

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

      const trimmedDesc = description.trim()
      const title =
        trimmedDesc.length > 35 ? `${trimmedDesc.slice(0, 35)}...` : trimmedDesc

      const newComplaint: Complaint = {
        id: Date.now().toString(),
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
        statusProgress: 15,
        photoUrl: photoPreview,
        photoName: photoFile?.name || null,
        officerName: null,
        adminResponse: null,
      }

      const updated = [newComplaint, ...complaints]
      setComplaints(updated)
      localStorage.setItem('mock_complaints', JSON.stringify(updated))

      // Reset form
      setCategory('Infrastructure')
      setPriority('Low')
      setDescription('')
      setPhotoFile(null)
      setPhotoPreview(null)
      setIsSubmitting(false)

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
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Page Title */}
      <PageHeader title="Keluhan Warga" />

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
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Kategori"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                >
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Security">Security</option>
                  <option value="Public Facility">Public Facility</option>
                </Select>

                <Select
                  label="Prioritas"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Select>
              </div>

              <Textarea
                label="Deskripsi Keluhan"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan detail masalah..."
                className="h-32"
              />

              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                  Foto Pendukung
                </label>
                <FileUploader
                  previewUrl={photoPreview}
                  fileName={photoFile?.name || null}
                  onFileSelected={(file) => {
                    setPhotoFile(file)
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setPhotoPreview(reader.result as string)
                    }
                    reader.readAsDataURL(file)
                  }}
                  onClear={() => {
                    setPhotoFile(null)
                    setPhotoPreview(null)
                  }}
                />
              </div>

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
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#edf4ff] text-[#0047cc] flex items-center justify-center shrink-0">
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
                  <div className="flex gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${styles.bg}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-slate-900 font-bold text-sm leading-snug">
                        {c.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">
                        {c.ticketNumber} • {c.timeAgo}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0 select-none">
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

                  <p className="text-slate-500 text-xs leading-relaxed">
                    {c.description}
                  </p>

                  {c.photoUrl && (
                    <div className="mt-0.5">
                      <img
                        src={c.photoUrl}
                        alt="Foto Pendukung"
                        className="max-h-36 rounded-2xl object-cover border border-slate-100"
                      />
                    </div>
                  )}

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
                    <div className="bg-emerald-50/50 border border-emerald-100/30 rounded-2xl p-3 flex items-center gap-2 mt-0.5 text-emerald-800 text-xs font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Selesai pada {c.date}</span>
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
