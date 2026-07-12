import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  AlertTriangle,
  Droplet,
  Shield,
  History,
  X,
  CheckCircle2,
  User,
  MessageSquare,
  ClipboardList,
  Info,
  Trash2,
} from 'lucide-react'

export const Route = createFileRoute('/_dashboard/complaints/warga')({
  component: BoardComplaintsPage,
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
  officerName?: string | null
  adminResponse?: string | null
}

const INITIAL_HISTORY: Complaint[] = [
  {
    id: 'h1',
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
    id: 'h2',
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
    id: 'h3',
    ticketNumber: 'SAN-4112',
    title: 'Sampah Menumpuk di Area Taman',
    category: 'Sanitation',
    priority: 'Low',
    status: 'RESOLVED',
    description:
      'Sampah di tempat sampah taman utama menumpuk dan mulai menimbulkan bau tidak sedap.',
    timeAgo: '12 Okt 2023, 09:00',
    date: '12 Okt 2023, 09:00',
    statusProgress: 100,
    photoUrl: null,
    officerName: 'Petugas Kebersihan',
    adminResponse:
      'Sampah sudah diangkut oleh armada dinas kebersihan pagi ini.',
  },
]

const INITIAL_PENDING: Complaint[] = [
  {
    id: 'p1',
    ticketNumber: 'INF-9022',
    title: 'Jalan Berlubang',
    category: 'Infrastructure',
    priority: 'High',
    status: 'PENDING',
    description:
      'Jalan berlubang di depan Blok C1 nomor 12 buat anak saya jatuh, bahaya harus cepet diperbaiki.',
    timeAgo: '2 Jam yang lalu',
    date: '11 Jul 2026, 07:18',
    statusProgress: 15,
  },
  {
    id: 'p2',
    ticketNumber: 'SAN-8833',
    title: 'Sampah Menumpuk dekat masjid',
    category: 'Sanitation',
    priority: 'Medium',
    status: 'PENDING',
    description:
      'Sampah deket masjid numpuk banget, baunya gaenak untuk sekitar tempat sholat, tolong panggil petugas kebersihan.',
    timeAgo: 'Kemarin, 14:20',
    date: '10 Jul 2026, 14:20',
    statusProgress: 15,
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
          icon: Trash2,
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

function BoardComplaintsPage() {
  const [historyList, setHistoryList] = useState<Complaint[]>(() => {
    const savedHist = localStorage.getItem('board_complaints_history')
    return savedHist ? JSON.parse(savedHist) : INITIAL_HISTORY
  })

  const [pendingList, setPendingList] = useState<Complaint[]>(() => {
    const savedPend = localStorage.getItem('board_complaints_pending')
    return savedPend ? JSON.parse(savedPend) : INITIAL_PENDING
  })

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(
      'board_complaints_history',
      JSON.stringify(historyList),
    )
  }, [historyList])

  useEffect(() => {
    localStorage.setItem(
      'board_complaints_pending',
      JSON.stringify(pendingList),
    )
  }, [pendingList])

  const handleAccept = (item: Complaint) => {
    // Move to History list as IN PROGRESS
    const acceptedItem: Complaint = {
      ...item,
      status: 'IN PROGRESS',
      statusProgress: 40,
      officerName: 'Bp. Sukirman',
      adminResponse:
        'Laporan diterima dan sedang ditindaklanjuti oleh petugas teknis lapangan.',
      timeAgo: 'Baru saja',
    }

    setPendingList((prev) => prev.filter((p) => p.id !== item.id))
    setHistoryList((prev) => [acceptedItem, ...prev])

    setToastMessage(`Laporan "${item.title}" berhasil diterima dan diproses!`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleReject = (item: Complaint) => {
    // Remove from validation list
    setPendingList((prev) => prev.filter((p) => p.id !== item.id))

    setToastMessage(`Laporan "${item.title}" ditolak.`)
    setTimeout(() => setToastMessage(null), 4000)
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

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#0047cc] tracking-tight">
          Keluhan Warga
        </h1>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Riwayat Laporan */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2.5 mb-2 select-none">
            <div className="w-8 h-8 rounded-lg bg-[#edf4ff] text-[#0047cc] flex items-center justify-center shrink-0 border border-slate-50 shadow-sm">
              <History className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-base font-bold text-slate-800">
              Riwayat Laporan
            </h2>
          </div>

          <div className="space-y-4">
            {historyList.map((c) => {
              const isPending = c.status === 'PENDING'
              const isInProgress = c.status === 'IN PROGRESS'
              const isResolved = c.status === 'RESOLVED'

              const styles = getCategoryStyles(c.category, c.status)
              const IconComponent = styles.icon

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:shadow-[0_8px_30px_rgba(0,71,204,0.02)] transition-all duration-300 flex flex-col gap-4 relative"
                >
                  {/* Card Header Row */}
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
                        <span className="bg-slate-100 text-slate-650 font-bold px-2 py-0.5 rounded text-[9px] tracking-wide uppercase">
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

                  {/* Progress Bar */}
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

                  {/* Officer Footer or Resolved Banner */}
                  {!isResolved ? (
                    <div className="flex items-center gap-2 mt-1 pt-3.5 border-t border-slate-100/60">
                      {c.officerName ? (
                        <>
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0047cc] font-bold flex items-center justify-center text-[10px] border border-blue-200/50 select-none">
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
                          <div className="w-6 h-6 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-200 select-none">
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
                      <span>Selesai pada {c.timeAgo}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Validasi Laporan */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2.5 mb-2 select-none">
            <div className="w-8 h-8 rounded-lg bg-[#edf4ff] text-[#0047cc] flex items-center justify-center shrink-0 border border-slate-50 shadow-sm">
              <ClipboardList className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-base font-bold text-slate-800">
              Validasi Laporan
            </h2>
          </div>

          <div className="space-y-4">
            {pendingList.length > 0 ? (
              pendingList.map((item) => {
                const styles = getCategoryStyles(item.category)
                const IconComponent = styles.icon

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex flex-col gap-4 relative animate-[fadeIn_0.3s_ease-out]"
                  >
                    {/* Header Row */}
                    <div className="flex gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${styles.bg}`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-slate-900 font-bold text-sm leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">
                          {item.ticketNumber} • {item.timeAgo}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0 select-none">
                        {item.priority === 'High' && (
                          <span className="bg-rose-100 text-rose-700 border border-rose-200/50 font-bold px-2 py-0.5 rounded text-[9px] tracking-wide uppercase">
                            High
                          </span>
                        )}
                        {item.priority === 'Medium' && (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200/50 font-bold px-2 py-0.5 rounded text-[9px] tracking-wide uppercase">
                            Medium
                          </span>
                        )}
                        {item.priority === 'Low' && (
                          <span className="bg-slate-100 text-slate-650 border border-slate-200/50 font-bold px-2 py-0.5 rounded text-[9px] tracking-wide uppercase">
                            Low
                          </span>
                        )}
                        <span className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded text-[9px] tracking-wide uppercase">
                          Pending
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-500 text-xs leading-relaxed">
                      {item.description}
                    </p>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 pt-2">
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
                )
              })
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center shadow-sm">
                <Info className="w-9 h-9 text-slate-350 mx-auto mb-2.5" />
                <h3 className="text-slate-700 font-bold text-sm">
                  Semua keluhan tervalidasi
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Tidak ada keluhan warga baru yang menunggu persetujuan.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
