import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import {
  Mail,
  Lock,
  User,
  Phone,
  Home,
  CreditCard,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import http from '../utils/http'
import smartLogo from '../assets/smart-logo.svg'

interface RegisterResponse {
  message: string
}

export const Route = createFileRoute('/register')({
  component: Register,
})

function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Register mutation using TanStack Query
  const registerMutation = useMutation({
    retry: false,
    mutationFn: async (payload: any) => {
      try {
        const response = await http.post<RegisterResponse>(
          '/residents/register',
          payload,
        )
        return response.data
      } catch (error: any) {
        const errMsg =
          error.response?.data?.message ||
          'Registrasi gagal. Silakan coba kembali beberapa saat lagi.'
        throw new Error(errMsg)
      }
    },
    onSuccess: (data) => {
      setIsSuccess(true)
      setSuccessMessage(
        data.message || 'Registrasi berhasil. Menunggu verifikasi Ketua RT.',
      )
    },
  })

  // TanStack Form configuration
  const form = useForm({
    defaultValues: {
      nik: '',
      nama: '',
      email: '',
      no_hp: '',
      alamat: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      // Exclude confirmPassword when submitting to backend
      const { confirmPassword, ...payload } = value
      registerMutation.mutate(payload)
    },
  })

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
        <div className="w-full max-w-[500px] bg-white rounded-2xl border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-50 border border-green-100 rounded-full flex items-center justify-center text-green-500 shadow-sm animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-slate-900 font-bold text-xl mb-3">
            Registrasi Berhasil!
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed mb-8 px-4">
            {successMessage}
          </p>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-left text-xs text-slate-500 leading-relaxed mb-8">
            <p className="font-semibold text-slate-700 mb-1">
              Catatan untuk Warga Baru:
            </p>
            Akun Anda saat ini berstatus <span className="font-semibold text-[#0047cc]">PENDING</span>. 
            Silakan hubungi Ketua RT setempat untuk mempercepat proses verifikasi data Anda agar dapat menggunakan seluruh fitur SMART.
          </div>
          <Link
            to="/login"
            className="w-full bg-[#0047cc] hover:bg-[#003bb3] active:bg-[#003399] text-white font-semibold rounded-xl py-3 px-6 transition-all shadow-[0_4px_12px_rgba(0,71,204,0.15)] flex items-center justify-center gap-2 cursor-pointer text-sm font-sans"
          >
            Kembali ke Halaman Masuk
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
      <div className="w-full max-w-[620px] bg-white rounded-2xl border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] my-8">
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={smartLogo}
            alt="SMART Logo"
            className="w-14 h-14 mb-4 drop-shadow-[0_8px_20px_rgba(0,71,204,0.2)]"
          />
          <span className="text-[#0047cc] font-extrabold text-sm tracking-wider uppercase mb-1">
            SMART
          </span>
          <h1 className="text-slate-900 font-bold text-xl text-center">
            Pendaftaran Warga Baru
          </h1>
          <p className="text-slate-500 text-xs text-center mt-1.5 max-w-[340px] leading-relaxed">
            Daftarkan diri Anda untuk mengakses layanan administrasi dan informasi di lingkungan RT.
          </p>
        </div>

        {/* Global Error Alert */}
        {registerMutation.isError && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex flex-col gap-0.5 leading-relaxed">
            <span className="font-semibold">Registrasi Gagal</span>
            <span>{registerMutation.error.message}</span>
          </div>
        )}

        {/* Form Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* NIK field */}
            <form.Field
              name="nik"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return 'NIK wajib diisi'
                  if (!/^\d+$/.test(value)) return 'NIK harus berupa angka'
                  if (value.length !== 16) return 'NIK harus tepat 16 digit'
                  return undefined
                },
              }}
              children={(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-slate-700 font-semibold text-xs mb-1.5"
                  >
                    NIK (Nomor Induk Kependudukan)
                  </label>
                  <div className="relative flex items-center">
                    <CreditCard className="absolute left-4 w-4 h-4 text-slate-400" />
                    <input
                      id={field.name}
                      name={field.name}
                      type="text"
                      maxLength={16}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="317101XXXXXXXXXX"
                      className={`w-full bg-[#f4f7fc] border ${
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                          : 'border-slate-200/80 focus:border-[#0047cc] focus:ring-[#0047cc]/10'
                      } rounded-xl py-2.5 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 text-sm transition-all`}
                    />
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-red-500 text-[10px] font-medium leading-none">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                </div>
              )}
            />

            {/* Nama Lengkap field */}
            <form.Field
              name="nama"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return 'Nama lengkap wajib diisi'
                  if (value.length < 3) return 'Nama minimal 3 karakter'
                  return undefined
                },
              }}
              children={(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-slate-700 font-semibold text-xs mb-1.5"
                  >
                    Nama Lengkap
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-4 w-4 h-4 text-slate-400" />
                    <input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Nama Lengkap sesuai KTP"
                      className={`w-full bg-[#f4f7fc] border ${
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                          : 'border-slate-200/80 focus:border-[#0047cc] focus:ring-[#0047cc]/10'
                      } rounded-xl py-2.5 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 text-sm transition-all`}
                    />
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-red-500 text-[10px] font-medium leading-none">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email field */}
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return 'Email wajib diisi'
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                  if (!emailRegex.test(value)) return 'Format email tidak valid'
                  return undefined
                },
              }}
              children={(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-slate-700 font-semibold text-xs mb-1.5"
                  >
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-4 h-4 text-slate-400" />
                    <input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="nama@email.com"
                      className={`w-full bg-[#f4f7fc] border ${
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                          : 'border-slate-200/80 focus:border-[#0047cc] focus:ring-[#0047cc]/10'
                      } rounded-xl py-2.5 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 text-sm transition-all`}
                    />
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-red-500 text-[10px] font-medium leading-none">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                </div>
              )}
            />

            {/* No HP field */}
            <form.Field
              name="no_hp"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return 'Nomor HP wajib diisi'
                  if (!/^\+?[0-9]{10,14}$/.test(value)) return 'Nomor HP tidak valid (10-14 digit)'
                  return undefined
                },
              }}
              children={(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-slate-700 font-semibold text-xs mb-1.5"
                  >
                    Nomor HP / WhatsApp
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-4 w-4 h-4 text-slate-400" />
                    <input
                      id={field.name}
                      name={field.name}
                      type="tel"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="0812XXXXXXXX"
                      className={`w-full bg-[#f4f7fc] border ${
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                          : 'border-slate-200/80 focus:border-[#0047cc] focus:ring-[#0047cc]/10'
                      } rounded-xl py-2.5 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 text-sm transition-all`}
                    />
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-red-500 text-[10px] font-medium leading-none">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                </div>
              )}
            />
          </div>

          {/* Alamat field */}
          <form.Field
            name="alamat"
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'Alamat lengkap wajib diisi'
                return undefined
              },
            }}
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-slate-700 font-semibold text-xs mb-1.5"
                >
                  Alamat Lengkap (Rumah/No. Rumah)
                </label>
                <div className="relative flex items-start">
                  <Home className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Jl. Merdeka No. 12, RT 01/RW 02"
                    rows={2}
                    className={`w-full bg-[#f4f7fc] border ${
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                        : 'border-slate-200/80 focus:border-[#0047cc] focus:ring-[#0047cc]/10'
                    } rounded-xl py-2.5 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 text-sm transition-all resize-none`}
                  />
                </div>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-red-500 text-[10px] font-medium leading-none">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
              </div>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Username field */}
            <form.Field
              name="username"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return 'Username wajib diisi'
                  if (value.length < 4) return 'Username minimal 4 karakter'
                  if (!/^[a-zA-Z0-9_]+$/.test(value))
                    return 'Username hanya boleh huruf, angka, dan underscore'
                  return undefined
                },
              }}
              children={(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-slate-700 font-semibold text-xs mb-1.5"
                  >
                    Username
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-4 w-4 h-4 text-slate-400" />
                    <input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Username untuk masuk"
                      className={`w-full bg-[#f4f7fc] border ${
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                          : 'border-slate-200/80 focus:border-[#0047cc] focus:ring-[#0047cc]/10'
                      } rounded-xl py-2.5 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 text-sm transition-all`}
                    />
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-red-500 text-[10px] font-medium leading-none">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                </div>
              )}
            />

            {/* Password field */}
            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return 'Kata sandi wajib diisi'
                  if (value.length < 6) return 'Kata sandi minimal 6 karakter'
                  return undefined
                },
              }}
              children={(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-slate-700 font-semibold text-xs mb-1.5"
                  >
                    Kata Sandi
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-4 h-4 text-slate-400" />
                    <input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? 'text' : 'password'}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full bg-[#f4f7fc] border ${
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                          : 'border-slate-200/80 focus:border-[#0047cc] focus:ring-[#0047cc]/10'
                      } rounded-xl py-2.5 pl-11 pr-11 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 text-sm transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 p-1 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-red-500 text-[10px] font-medium leading-none">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                </div>
              )}
            />
          </div>

          {/* Confirm Password field */}
          <form.Field
            name="confirmPassword"
            validators={{
              onChange: ({ value, fieldApi }) => {
                if (!value) return 'Konfirmasi kata sandi wajib diisi'
                if (value !== fieldApi.form.getFieldValue('password')) {
                  return 'Konfirmasi kata sandi tidak cocok'
                }
                return undefined
              },
            }}
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-slate-700 font-semibold text-xs mb-1.5"
                >
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 w-4 h-4 text-slate-400" />
                  <input
                    id={field.name}
                    name={field.name}
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-[#f4f7fc] border ${
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                        : 'border-slate-200/80 focus:border-[#0047cc] focus:ring-[#0047cc]/10'
                    } rounded-xl py-2.5 pl-11 pr-11 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 text-sm transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 p-1 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-red-500 text-[10px] font-medium leading-none">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
              </div>
            )}
          />

          {/* Submit Button */}
          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
            children={({ canSubmit }) => (
              <button
                type="submit"
                disabled={!canSubmit || registerMutation.isPending}
                className="w-full bg-[#0047cc] hover:bg-[#003bb3] active:bg-[#003399] text-white font-semibold rounded-xl py-3 mt-6 transition-all shadow-[0_4px_12px_rgba(0,71,204,0.15)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm font-sans"
              >
                {registerMutation.isPending ? 'Mendaftarkan...' : 'Daftar Sekarang'}
              </button>
            )}
          />
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          Sudah memiliki akun?{' '}
          <Link
            to="/login"
            className="text-[#0047cc] font-semibold hover:underline cursor-pointer"
          >
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  )
}
