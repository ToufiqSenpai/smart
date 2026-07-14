import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Loader2, Megaphone } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'

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
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

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
          <Input
            label="Judul Pengumuman"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Contoh : Perlombaan menyambut 17 Agustus"
          />

          {/* Kategori Dropdown */}
          <div className="max-w-xs">
            <Select
              label="Kategori"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              options={[
                { value: 'Keamanan', label: 'Keamanan' },
                { value: 'Kegiatan', label: 'Kegiatan' },
                { value: 'Iuran', label: 'Iuran' },
                { value: 'Pembangunan', label: 'Pembangunan' },
              ]}
            />
          </div>

          {/* Deskripsi Textarea */}
          <Textarea
            label="Deskripsi"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={6}
          />

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
