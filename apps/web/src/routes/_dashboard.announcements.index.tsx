import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import {
  Shield,
  Calendar,
  Coins,
  Wrench,
  Info,
  Clock,
  MessageSquarePlus,
  Mail,
  BarChart3,
} from 'lucide-react'

export const Route = createFileRoute('/_dashboard/announcements/')({
  component: AnnouncementsPage,
})

const getCategoryStyles = (category: string) => {
  switch (category) {
    case 'Keamanan':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        badge: 'bg-emerald-100 text-emerald-800',
        icon: Shield,
        iconBg: 'bg-emerald-50 text-emerald-600',
      }
    case 'Kegiatan':
      return {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        badge: 'bg-indigo-100 text-indigo-800',
        icon: Calendar,
        iconBg: 'bg-indigo-50 text-indigo-600',
      }
    case 'Iuran':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-100',
        badge: 'bg-amber-100 text-amber-800',
        icon: Coins,
        iconBg: 'bg-amber-50 text-amber-600',
      }
    case 'Pembangunan':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-100',
        badge: 'bg-rose-100 text-rose-800',
        icon: Wrench,
        iconBg: 'bg-rose-50 text-rose-600',
      }
    default:
      return {
        bg: 'bg-slate-50 text-slate-700 border-slate-100',
        badge: 'bg-slate-100 text-slate-800',
        icon: Info,
        iconBg: 'bg-slate-50 text-slate-600',
      }
  }
}

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: '1',
    category: 'Keamanan',
    title: 'Rilis Jadwal Ronda Malam Periode November 2023',
    date: '18 Okt 2023',
    time: '09:15',
    body: 'Bapak/Ibu warga RT 05, jadwal ronda terbaru telah disusun. Mohon kesediaannya untuk mengecek tanggal jaga masing-masing di pos ronda atau melalui lampiran dokumen digital ini demi menjaga keamanan lingkungan bersama. Ronda malam dimulai pukul 22:00 WIB hingga 04:00 WIB setiap harinya.',
    read: false,
  },
  {
    id: '2',
    category: 'Kegiatan',
    title: 'Kerja Bakti Bersama Pembersihan Saluran Air',
    date: '15 Okt 2023',
    time: '08:00',
    body: 'Diberitahukan kepada seluruh warga RT 05 untuk berpartisipasi dalam kegiatan kerja bakti pembersihan saluran air (selokan) untuk mengantisipasi musim hujan. Mohon membawa peralatan kerja masing-masing seperti cangkul, sapu lidi, dan karung sampah. Kumpul di depan balai RT pukul 08:00 WIB.',
    read: false,
  },
  {
    id: '3',
    category: 'Iuran',
    title: 'Penyesuaian Tarif Iuran Sampah Bulanan',
    date: '10 Okt 2023',
    time: '14:30',
    body: 'Mulai periode November 2023, iuran kebersihan/sampah bulanan disesuaikan menjadi Rp 35.000,- berdasarkan hasil musyawarah warga RT 05 bulan lalu. Penyesuaian ini dikarenakan peningkatan biaya operasional pengangkutan sampah dari TPA daerah.',
    read: false,
  },
  {
    id: '4',
    category: 'Pembangunan',
    title: 'Renovasi Paving Block Gang Utama RT 05',
    date: '05 Okt 2023',
    time: '10:00',
    body: 'Proses renovasi dan pengaspalan ulang paving block di gang utama RT 05 akan dimulai minggu depan. Mohon untuk memarkirkan kendaraan di area sementara yang telah disediakan selama proses pengerjaan berlangsung demi kelancaran dan keselamatan pekerja.',
    read: true,
  },
]

function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>(() => {
    const saved = localStorage.getItem('mock_announcements')
    if (saved) {
      const parsed = JSON.parse(saved)
      const combined = [...parsed]
      DEFAULT_ANNOUNCEMENTS.forEach((def) => {
        if (!combined.some((c) => c.id === def.id)) {
          combined.push(def)
        }
      })
      return combined
    }
    return DEFAULT_ANNOUNCEMENTS
  })

  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null)

  const categories = ['Semua', 'Kegiatan', 'Keamanan', 'Iuran', 'Pembangunan']

  const filteredAnnouncements = announcements.filter((item) => {
    if (selectedCategory === 'Semua') return true
    return item.category.toLowerCase() === selectedCategory.toLowerCase()
  })

  const unreadCount = announcements.filter((item) => !item.read).length
  const upcomingEventsCount = announcements.filter(
    (item) => item.category === 'Kegiatan',
  ).length

  const handleCardClick = (announcement: any) => {
    setSelectedAnnouncement(announcement)
    setAnnouncements((prev) =>
      prev.map((item) =>
        item.id === announcement.id ? { ...item, read: true } : item,
      ),
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-1 animate-[fadeIn_0.3s_ease-out]">
      {/* Page Header */}
      <PageHeader title="Pengumuman" />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0047cc] text-white shadow-sm shadow-[#0047cc]/25'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 bg-white/50 border border-slate-100'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Announcements List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((ann) => {
              const styles = getCategoryStyles(ann.category)
              const CategoryIcon = styles.icon
              return (
                <div
                  key={ann.id}
                  onClick={() => handleCardClick(ann)}
                  className="bg-white border border-slate-100 hover:border-slate-200/80 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,71,204,0.03)] transition-all duration-300 flex gap-5 cursor-pointer relative overflow-hidden group"
                >
                  {/* Unread Glow Badge */}
                  {!ann.read && (
                    <span className="absolute top-6 right-6 w-2 h-2 bg-[#0047cc] rounded-full" />
                  )}

                  {/* Icon Badge */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${styles.iconBg}`}
                  >
                    <CategoryIcon
                      className="w-5 h-5"
                      fill="currentColor"
                      fillOpacity={0.1}
                    />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md tracking-wider ${styles.bg}`}
                      >
                        {ann.category.toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-xs font-medium">
                        {ann.date} • {ann.time}
                      </span>
                    </div>
                    <h3 className="text-slate-900 font-bold text-base mt-3 leading-snug group-hover:text-[#0047cc] transition-colors">
                      {ann.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-2.5 leading-relaxed line-clamp-2">
                      {ann.body}
                    </p>
                  </div>
                </div>
              )
            })
          ) : (
            <EmptyState
              icon={<Info className="w-10 h-10" />}
              title="Tidak ada pengumuman"
              description={`Belum ada pengumuman resmi di kategori ${selectedCategory}.`}
            />
          )}
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-[#edf4ff]/40 border border-[#0047cc]/5 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,71,204,0.02)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-900 font-bold text-base">Ringkasan</h2>
              <BarChart3 className="w-5 h-5 text-[#0047cc]/80" />
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-slate-100/50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#edf4ff] text-[#0047cc] rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-slate-700 text-xs font-semibold">
                    Belum Dibaca
                  </span>
                </div>
                <span className="text-[#0047cc] font-extrabold text-base">
                  {unreadCount < 10 ? `0${unreadCount}` : unreadCount}
                </span>
              </div>

              {/* Item 2 */}
              <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-slate-100/50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-slate-700 text-xs font-semibold">
                    Kegiatan Mendatang
                  </span>
                </div>
                <span className="text-emerald-600 font-extrabold text-base">
                  {upcomingEventsCount < 10
                    ? `0${upcomingEventsCount}`
                    : upcomingEventsCount}
                </span>
              </div>
            </div>
          </div>

          {/* Lapor Card */}
          <div className="bg-[#edf4ff]/40 border border-[#0047cc]/5 rounded-3xl p-6 text-center shadow-[0_4px_20px_rgba(0,71,204,0.02)] flex flex-col items-center">
            <div className="w-12 h-12 bg-white text-[#0047cc] rounded-2xl flex items-center justify-center shadow-sm">
              <MessageSquarePlus className="w-6 h-6" />
            </div>
            <h3 className="text-slate-900 font-bold text-sm mt-4">
              Punya Masalah Lingkungan?
            </h3>
            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed max-w-[200px] mx-auto">
              Gunakan fitur Lapor untuk bantuan cepat.
            </p>
            <Link
              to="/complaints"
              className="w-full bg-[#0047cc] hover:bg-[#003bb3] active:bg-[#003399] text-white font-semibold rounded-xl py-3 mt-5 transition-all shadow-md shadow-[#0047cc]/15 flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              Laporkan Sekarang
            </Link>
          </div>
        </div>
      </div>

      {/* Immersive Slide-over Modal for Details */}
      <Modal
        isOpen={selectedAnnouncement !== null}
        onClose={() => setSelectedAnnouncement(null)}
        title={
          selectedAnnouncement ? (
            <span
              className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md tracking-wider inline-block ${getCategoryStyles(selectedAnnouncement.category).bg}`}
            >
              {selectedAnnouncement.category.toUpperCase()}
            </span>
          ) : (
            ''
          )
        }
        maxWidthClass="max-w-lg"
      >
        {selectedAnnouncement && (
          <>
            <div className="mt-2 space-y-3">
              <div className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {selectedAnnouncement.date} • {selectedAnnouncement.time}
                </span>
              </div>
              <h2 className="text-slate-950 font-extrabold text-lg leading-snug">
                {selectedAnnouncement.title}
              </h2>
              <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line pt-2">
                {selectedAnnouncement.body}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl px-5 py-2.5 text-xs transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
