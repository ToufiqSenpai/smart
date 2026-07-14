import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { Toast } from '@/components/ui/Toast'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import {
  User,
  MapPin,
  Phone,
  Mail,
  Map,
  Calendar,
  Pencil,
  Loader2,
} from 'lucide-react'

export const Route = createFileRoute('/_dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  // Read initial values from localStorage to support cross-component updates
  const [profileName, setProfileName] = useState(
    () => localStorage.getItem('profile_name') || 'Budi Santoso',
  )
  const [profileAddress, setProfileAddress] = useState(
    () =>
      localStorage.getItem('profile_address') ||
      'Jl. Melati No. 42, RT 005 / RW 012, Kel. Sukamaju, Jakarta Selatan, 12345',
  )
  const [profilePhone, setProfilePhone] = useState(
    () => localStorage.getItem('profile_phone') || '086767676769',
  )
  const [profileEmail, setProfileEmail] = useState(
    () => localStorage.getItem('profile_email') || 'CrazyXKiller67@gmail.com',
  )

  // Form input states
  const [inputName, setInputName] = useState(profileName)
  const [inputAddress, setInputAddress] = useState(profileAddress)
  const [inputPhone, setInputPhone] = useState(profilePhone)
  const [inputEmail, setInputEmail] = useState(profileEmail)

  const [avatarUrl, setAvatarUrl] = useState(
    () =>
      localStorage.getItem('profile_avatar') ||
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60',
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const resultUrl = reader.result as string
        setAvatarUrl(resultUrl)
        localStorage.setItem('profile_avatar', resultUrl)
        window.dispatchEvent(new Event('profile_updated'))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputName.trim()) {
      alert('Nama wajib diisi.')
      return
    }
    if (!inputAddress.trim()) {
      alert('Alamat wajib diisi.')
      return
    }
    if (!inputPhone.trim()) {
      alert('Nomor telepon wajib diisi.')
      return
    }
    if (!inputEmail.trim()) {
      alert('Email wajib diisi.')
      return
    }

    setIsSubmitting(true)

    // Simulate saving profile details
    setTimeout(() => {
      // Save updated data
      setProfileName(inputName.trim())
      setProfileAddress(inputAddress.trim())
      setProfilePhone(inputPhone.trim())
      setProfileEmail(inputEmail.trim())

      localStorage.setItem('profile_name', inputName.trim())
      localStorage.setItem('profile_address', inputAddress.trim())
      localStorage.setItem('profile_phone', inputPhone.trim())
      localStorage.setItem('profile_email', inputEmail.trim())

      // Dispatch custom window event to trigger sidebar update
      window.dispatchEvent(new Event('profile_updated'))

      setIsSubmitting(false)
      setToastMessage('Profil Anda berhasil diperbarui!')
      setTimeout(() => setToastMessage(null), 4000)
    }, 1200)
  }

  // Sync state if localStorage changes in other components
  useEffect(() => {
    const handleProfileUpdate = () => {
      setProfileName(localStorage.getItem('profile_name') || 'Budi Santoso')
      setProfileAddress(
        localStorage.getItem('profile_address') ||
          'Jl. Melati No. 42, RT 005 / RW 012, Kel. Sukamaju, Jakarta Selatan, 12345',
      )
      setProfilePhone(localStorage.getItem('profile_phone') || '086767676769')
      setProfileEmail(
        localStorage.getItem('profile_email') || 'CrazyXKiller67@gmail.com',
      )
      setAvatarUrl(
        localStorage.getItem('profile_avatar') ||
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60',
      )
    }
    window.addEventListener('profile_updated', handleProfileUpdate)
    return () =>
      window.removeEventListener('profile_updated', handleProfileUpdate)
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-1 animate-[fadeIn_0.3s_ease-out] relative">
      {/* Toast Alert */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Hidden file input for avatar upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="hidden"
      />

      {/* Page Header (Avatar & Profile details) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
        {/* Profile Avatar Frame */}
        <div className="relative group shrink-0 select-none">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-slate-50 shadow-md bg-slate-50 flex items-center justify-center">
            <img
              src={avatarUrl}
              alt="Budi Santoso"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60'
              }}
            />
          </div>
          {/* Edit icon overlay */}
          <button
            onClick={handleAvatarClick}
            className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2.5 shadow-md border-2 border-white transition-all cursor-pointer flex items-center justify-center shrink-0"
            title="Ubah foto profil"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        {/* User Info details */}
        <div className="flex-1 text-center md:text-left space-y-4 pt-2">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              {profileName}
            </h1>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Profil Pengguna SMART
            </p>
          </div>

          {/* Badges and Joined info */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="bg-[#0047cc] text-white font-bold px-3.5 py-1 rounded-lg text-[10px] tracking-wide uppercase shadow-sm select-none">
              Warga RT 05
            </span>
            <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-3.5 py-1 rounded-lg text-[10px] tracking-wide uppercase select-none">
              Terverifikasi
            </span>
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-xs ml-1 select-none">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Bergabung sejak Jan 2023</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Anda Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
            <h2 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">
              Profile Anda
            </h2>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <Input
                label="Nama"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
              />

              <Textarea
                label="Alamat"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                className="h-24"
              />

              <Input
                label="Nomor Telepon"
                value={inputPhone}
                onChange={(e) => setInputPhone(e.target.value)}
              />

              <Input
                label="Email"
                type="email"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full border border-slate-200 hover:border-blue-200 hover:bg-[#edf4ff]/30 text-slate-600 hover:text-[#0047cc] font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan Perubahan...</span>
                  </>
                ) : (
                  <span>Edit Profile</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Kontak & Alamat Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex flex-col h-full justify-between">
            <div className="space-y-6">
              {/* Card Header */}
              <div className="flex justify-between items-center pb-2 select-none">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Kontak &amp; Alamat
                </h2>
                <Map className="w-4.5 h-4.5 text-[#0047cc]" />
              </div>

              {/* Items details */}
              <div className="space-y-5">
                {/* Address */}
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0047cc] flex items-center justify-center shrink-0 border border-slate-50 select-none shadow-sm">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Alamat Domisili
                    </span>
                    <p className="text-slate-700 font-semibold text-xs leading-normal mt-1">
                      {profileAddress}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0047cc] flex items-center justify-center shrink-0 border border-slate-50 select-none shadow-sm">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Nomor Telepon
                    </span>
                    <div className="flex items-center flex-wrap gap-2 mt-1">
                      <span className="text-slate-700 font-bold text-xs">
                        {profilePhone.startsWith('0')
                          ? `+62 ${profilePhone.slice(1, 4)}-${profilePhone.slice(4, 8)}-${profilePhone.slice(8)}`
                          : profilePhone}
                      </span>
                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold px-2 py-0.5 rounded text-[8px] tracking-wide uppercase select-none shrink-0">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0047cc] flex items-center justify-center shrink-0 border border-slate-50 select-none shadow-sm">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Email
                    </span>
                    <p className="text-slate-700 font-semibold text-xs mt-1 truncate">
                      {profileEmail}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stylized vector map card preview */}
            <div className="mt-8 border border-slate-100 rounded-2xl overflow-hidden relative shadow-inner h-36 bg-slate-50 flex items-center justify-center select-none">
              {/* Map grid lines overlay */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0047cc_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Vector blocks representing structures */}
              <div className="absolute top-4 left-6 w-12 h-8 bg-slate-200/50 rounded-lg border border-slate-300/30" />
              <div className="absolute top-16 left-12 w-16 h-10 bg-slate-200/50 rounded-lg border border-slate-300/30" />
              <div className="absolute top-6 right-8 w-14 h-12 bg-slate-200/50 rounded-lg border border-slate-300/30" />
              <div className="absolute bottom-4 right-16 w-10 h-8 bg-slate-200/50 rounded-lg border border-slate-300/30" />

              {/* Vector roads */}
              <div className="absolute top-0 bottom-0 left-28 w-4 bg-slate-100/80 border-l border-r border-slate-200/40" />
              <div className="absolute left-0 right-0 top-14 h-4 bg-slate-100/80 border-t border-b border-slate-200/40" />

              {/* Map Pin bouncy overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
                <div className="w-8 h-8 rounded-full bg-[#0047cc] border-2 border-white text-white flex items-center justify-center shadow-lg">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div className="w-2 h-2 rounded-full bg-[#0047cc]/40 -mt-1 blur-[1px]" />
              </div>

              <div className="absolute bottom-2 left-2 bg-white/95 border border-slate-200/60 rounded px-1.5 py-0.5 text-[8px] text-slate-500 font-bold uppercase shadow-sm">
                RT 05 Smart Residence
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
