import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ChevronDown, CheckCircle2, X, Loader2, Megaphone } from 'lucide-react'

export const Route = createFileRoute('/_dashboard/announcements/tambah')({
  component: TambahPengumumanPage,
})

function TambahPengumumanPage() {
  const navigate = useNavigate()

  // Form states
  const [judul, setJudul] = useState('')
  const [kategori, setKategori] = useState('Keamanan')
  const [deskripsi, setDeskripsi] = useState(
    'Lorem ipsum dolor sit amet consectetur. Leo ac massa molestie nec neque etiam. Consectetur adipiscing etiam diam tortor ipsum eu arcu amet. Posuere tortor volutpat vestibulum libero.',
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!judul.trim()) {
      alert('Judul pengumuman wajib diisi.')
      return
    }
    if (!deskripsi.trim()) {
      alert('Deskripsi pengumuman wajib diisi.')
      return
    }

    setIsSubmitting(true)

    // Simulate publishing
    setTimeout(() => {
      // Retrieve existing mock items from localStorage if any, or seed default ones
      const existing = localStorage.getItem('mock_announcements')
      const list = existing ? JSON.parse(existing) : []

      const newAnn = {
        id: Date.now().toString(),
        category: kategori,
        title: judul.trim(),
        date: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        time: new Date()
          .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          .replace('.', ':'),
        body: deskripsi.trim(),
        read: false,
      }

      localStorage.setItem(
        'mock_announcements',
        JSON.stringify([newAnn, ...list]),
      )

      setIsSubmitting(false)
      setToastMessage('Pengumuman baru berhasil dipublikasikan!')

      // Navigate back to listing page after success
      setTimeout(() => {
        setToastMessage(null)
        navigate({ to: '/announcements' })
      }, 1500)
    }, 1200)
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

      {/* Main Layout Card Container */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-6">
        {/* Header with Title and Toggle Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#edf4ff] text-[#0047cc] flex items-center justify-center shrink-0 border border-slate-50 shadow-sm">
              <Megaphone className="w-4.5 h-4.5" />
            </div>
            <h1 className="text-base font-bold text-slate-800 tracking-tight">
              Tambah Pengumuman
            </h1>
          </div>

          {/* Top-Right Toggle Mode Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/announcements"
              className="border border-blue-500 hover:bg-[#edf4ff]/30 text-blue-600 font-bold rounded-xl px-4 py-2.5 text-xs transition-all cursor-pointer text-center select-none"
            >
              Edit Pengumuman
            </Link>
            <button
              className="bg-[#0047cc] text-white font-bold rounded-xl px-4 py-2.5 text-xs select-none shadow-sm shadow-[#0047cc]/15 border border-transparent"
              disabled
            >
              Tambah Pengumuman
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Judul Pengumuman */}
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
              Judul Pengumuman
            </label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh : Perlombaan menyambut 17 Agustus"
              className="w-full bg-slate-50 hover:bg-slate-100/30 border border-slate-200/80 text-slate-700 placeholder-slate-400 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all font-semibold"
            />
          </div>

          {/* Kategori Dropdown */}
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
              Kategori
            </label>
            <div className="relative max-w-xs">
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/30 border border-slate-200/80 text-slate-700 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all appearance-none cursor-pointer pr-10 font-semibold"
              >
                <option value="Keamanan">Keamanan</option>
                <option value="Kegiatan">Kegiatan</option>
                <option value="Iuran">Iuran</option>
                <option value="Pembangunan">Pembangunan</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Deskripsi Textarea */}
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
              Deskripsi
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/30 border border-slate-200/80 text-slate-700 placeholder-slate-400 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all resize-none h-44 leading-relaxed font-semibold"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0047cc] hover:bg-[#003bb3] active:bg-[#003399] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl py-3.5 transition-all shadow-md shadow-[#0047cc]/15 text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mempublikasikan...</span>
              </>
            ) : (
              <span>Tambah Pengumuman</span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
