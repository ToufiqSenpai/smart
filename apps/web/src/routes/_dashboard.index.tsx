import { createFileRoute } from '@tanstack/react-router'
import {
  CreditCard,
  Heart,
  AlertTriangle,
  Store,
  Calendar,
  Clock,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'

export const Route = createFileRoute('/_dashboard/')({
  component: DashboardIndex,
})

function DashboardIndex() {
  const topCards = [
    {
      label: 'STATUS IURAN',
      value: 'Bulan Juni',
      badge: 'Lunas',
      badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-200/50',
      icon: CreditCard,
    },
    {
      label: 'TOTAL DONASI ANDA',
      value: 'Rp 500.000',
      icon: Heart,
    },
    {
      label: 'KELUHAN AKTIF',
      value: '2 Laporan',
      badge: 'Proses',
      badgeColor: 'bg-red-50 text-red-600 border border-red-200/50',
      icon: AlertTriangle,
    },
    {
      label: 'PRODUK JUALAN',
      value: '5 Iklan',
      icon: Store,
    },
  ]

  const announcements = [
    {
      id: 1,
      title: 'Kerja Bakti Massal & Fogging Lingkungan',
      description:
        'Diharapkan seluruh warga dapat berpartisipasi dalam agenda kebersihan bulanan untuk mencegah DBD...',
      date: '12 Juni 2024',
      time: '07:00 WIB',
      imageUrl: '/kerja_bakti.png',
    },
    {
      id: 2,
      title: 'Pertemuan Rutin & Arisan RT',
      description:
        'Agenda bulanan untuk membahas pengelolaan sampah mandiri dan keamanan lingkungan...',
      date: '15 Juni 2024',
      time: '19:30 WIB',
      imageUrl: '/arisan_rt.png',
    },
  ]

  const payments = [
    {
      date: '05 Jun 2024',
      type: 'Iuran Bulanan (Juni)',
      status: 'Lunas',
      amount: 'Rp 150.000',
    },
    {
      date: '28 Mei 2024',
      type: 'Donasi Pembangunan Gapura',
      status: 'Lunas',
      amount: 'Rp 100.000',
    },
  ]

  const issues = [
    {
      id: 1,
      title: 'Lampu Jalan Mati - Jl. Kenanga',
      description: 'Laporan sedang ditindaklanjuti oleh petugas keamanan.',
      time: 'Update: 2 jam yang lalu',
      status: 'Proses',
    },
    {
      id: 2,
      title: 'Sampah Menumpuk - Blok C2',
      description: 'Selesai: Sampah telah diangkut oleh dinas terkait.',
      time: 'Update: 2 hari yang lalu',
      status: 'Selesai',
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      day: '12',
      month: 'JUN',
      title: 'Kerja Bakti Lingkungan',
      time: '07:00 WIB',
      location: 'Lapangan Utama',
    },
    {
      id: 2,
      day: '15',
      month: 'JUN',
      title: 'Arisan & Rapat RT',
      time: '19:30 WIB',
      location: 'Rumah Ketua RT',
    },
  ]

  const products = [
    {
      id: 1,
      title: 'Risol Mayo Bu Sri',
      price: 'Rp 5.000',
      imageUrl: '/risol_mayo.png',
    },
    {
      id: 2,
      title: 'Roti Artisan C2',
      price: 'Rp 25.000',
      imageUrl: '/roti_artisan.png',
    },
  ]

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Page Title */}
      <h1 className="text-xl font-bold text-[#0047cc] tracking-tight">
        Dashboard
      </h1>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {topCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-blue-50/70 rounded-xl flex items-center justify-center text-blue-600">
                <card.icon className="w-5 h-5" />
              </div>
              {card.badge && (
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              )}
            </div>
            <div className="mt-4">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
                {card.label}
              </span>
              <h3 className="text-slate-800 text-lg font-bold mt-1 tracking-tight">
                {card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Layout Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Wider Panels) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pengumuman Penting */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-slate-800 font-bold text-base">
                Pengumuman Penting
              </h2>
              <a
                href="#all"
                className="text-[#0047cc] hover:underline text-xs font-semibold"
              >
                Lihat Semua
              </a>
            </div>

            <div className="space-y-6">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="flex flex-col sm:flex-row gap-4 border-b border-slate-50 last:border-0 pb-6 last:pb-0"
                >
                  <img
                    src={ann.imageUrl}
                    alt={ann.title}
                    className="w-full sm:w-32 h-20 rounded-xl object-cover shrink-0 border border-slate-100"
                  />
                  <div className="space-y-1.5 min-w-0">
                    <h3 className="text-slate-800 font-bold text-sm leading-snug hover:text-[#0047cc] transition-colors cursor-pointer">
                      {ann.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                      {ann.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-medium pt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {ann.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {ann.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Riwayat Pembayaran Terbaru */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <h2 className="text-slate-800 font-bold text-base mb-4">
              Riwayat Pembayaran Terbaru
            </h2>
            <div className="overflow-x-auto -mx-6 px-6">
              <div className="min-w-[500px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 text-left text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 pb-3 mb-2">
                  <div className="col-span-3">TANGGAL</div>
                  <div className="col-span-4">JENIS</div>
                  <div className="col-span-2">STATUS</div>
                  <div className="col-span-3 text-right">JUMLAH</div>
                </div>
                {/* Table Rows */}
                {payments.map((p, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 py-3 border-b border-slate-50 last:border-0 items-center"
                  >
                    <div className="col-span-3 text-slate-500 text-xs font-medium">
                      {p.date}
                    </div>
                    <div className="col-span-4 text-slate-800 font-semibold text-xs truncate pr-2">
                      {p.type}
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                        {p.status}
                      </span>
                    </div>
                    <div className="col-span-3 text-[#0047cc] font-extrabold text-sm text-right">
                      {p.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status Keluhan Terbaru */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <h2 className="text-slate-800 font-bold text-base mb-6">
              Status Keluhan Terbaru
            </h2>
            <div className="relative pl-6 border-l border-slate-100 space-y-6">
              {issues.map((issue) => (
                <div key={issue.id} className="relative space-y-1">
                  {/* Timeline bullet */}
                  <span
                    className={`absolute -left-[30px] top-1.5 w-3 h-3 rounded-full ring-4 ${
                      issue.status === 'Selesai'
                        ? 'bg-emerald-500 ring-emerald-50'
                        : 'bg-blue-600 ring-blue-50'
                    }`}
                  />
                  <h3 className="text-slate-800 font-bold text-xs">
                    {issue.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {issue.description}
                  </p>
                  <span className="text-slate-400 text-[10px] font-medium block pt-0.5">
                    {issue.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Narrower Panels) */}
        <div className="space-y-6">
          {/* Kas RT */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span>KAS RT JUNI 2024</span>
            </div>
            <div className="flex items-baseline gap-2.5 mb-4">
              <span className="text-xl font-extrabold text-slate-800">
                Rp 12.450.000
              </span>
              <span className="text-emerald-500 text-xs font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +12%
              </span>
            </div>
            {/* Double Segment Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-[#0047cc]" style={{ width: '70%' }} />
              <div className="h-full bg-emerald-500" style={{ width: '20%' }} />
            </div>
            {/* Legends */}
            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-4 font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0047cc]" />{' '}
                Iuran: 70%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />{' '}
                Sisa: 20%
              </span>
            </div>
          </div>

          {/* Donasi Sosial */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3 block">
              DONASI SOSIAL: IDUL ADHA
            </span>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-slate-500 text-xs font-semibold">
                Target: Rp 20jt
              </span>
              <span className="text-[#0047cc] font-extrabold text-sm">75%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0047cc] rounded-full"
                style={{ width: '75%' }}
              />
            </div>
            {/* Button */}
            <button className="w-full bg-[#0047cc] hover:bg-[#003bb3] active:bg-[#003399] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-[0_4px_12px_rgba(0,71,204,0.15)] flex items-center justify-center cursor-pointer mt-5">
              Ikut Donasi
            </button>
          </div>

          {/* Agenda Mendatang */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <h2 className="text-slate-800 font-bold text-sm mb-5">
              Agenda Mendatang
            </h2>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex gap-3.5 items-center">
                  {/* Date Badge */}
                  <div className="w-12 h-12 bg-blue-50/70 text-blue-600 rounded-xl flex flex-col items-center justify-center shrink-0">
                    <span className="text-[8px] font-extrabold tracking-wider leading-none mb-0.5">
                      {event.month}
                    </span>
                    <span className="text-base font-extrabold leading-none">
                      {event.day}
                    </span>
                  </div>
                  {/* Details */}
                  <div className="min-w-0">
                    <h3 className="text-slate-800 font-bold text-xs truncate">
                      {event.title}
                    </h3>
                    <p className="text-slate-400 text-[10px] font-semibold mt-0.5 truncate">
                      {event.time} • {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pasar Lokal */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-slate-800 font-bold text-sm">Pasar Lokal</h2>
              <ArrowRight className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {products.map((prod) => (
                <div key={prod.id} className="group cursor-pointer">
                  <div className="overflow-hidden rounded-xl border border-slate-100 mb-2">
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-slate-700 font-semibold text-xs group-hover:text-[#0047cc] transition-colors truncate">
                    {prod.title}
                  </h3>
                  <p className="text-[#0047cc] font-extrabold text-xs mt-0.5">
                    {prod.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
