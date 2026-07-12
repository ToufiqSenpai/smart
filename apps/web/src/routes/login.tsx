import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useLocalStorage } from 'usehooks-ts'
import http from '../utils/http'
import smartLogo from '../assets/smart-logo.svg'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [, setAccessToken] = useLocalStorage<string | null>('accessToken', null)

  // login mutation using TanStack Query
  const loginMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      try {
        const response = await http.post('/auth/login', payload)
        return response.data
      } catch (error: any) {
        const errMsg =
          error.response?.data?.message ||
          'Gagal masuk. Silakan periksa kembali email dan kata sandi Anda.'
        throw new Error(errMsg)
      }
    },
    onSuccess: (data) => {
      // Save details to localStorage via useLocalStorage hooks
      if (data?.data?.accessToken) {
        setAccessToken(data.data.accessToken)
      }

      // Redirect to homepage
      navigate({ to: '/' })
    },
  })

  // TanStack Form configuration
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      loginMutation.mutate({
        email: value.email,
        password: value.password,
      })
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
      <div className="w-full max-w-[460px] bg-white rounded-2xl border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
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
            Selamat Datang di SMART
          </h1>
          <p className="text-slate-500 text-xs text-center mt-1.5 max-w-[280px] leading-relaxed">
            Masuk untuk mengelola administrasi lingkungan Anda dengan mudah.
          </p>
        </div>

        {/* Global Error Alert */}
        {loginMutation.isError && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex flex-col gap-0.5 leading-relaxed">
            <span className="font-semibold">Masuk Gagal</span>
            <span>{loginMutation.error.message}</span>
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
          {/* Email / Username field */}
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'Email wajib diisi'
                // Simple email pattern check
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
                    type="text"
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

          {/* Submit Button */}
          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
            children={({ canSubmit }) => (
              <button
                type="submit"
                disabled={!canSubmit || loginMutation.isPending}
                className="w-full bg-[#0047cc] hover:bg-[#003bb3] active:bg-[#003399] text-white font-semibold rounded-xl py-3 mt-6 transition-all shadow-[0_4px_12px_rgba(0,71,204,0.15)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {loginMutation.isPending ? 'Memproses...' : 'Masuk'}
              </button>
            )}
          />
        </form>

        {/* Register prompt */}
        <p className="text-center mt-6 text-xs text-slate-500">
          Belum punya akun?{' '}
          <a
            href="#register"
            className="text-[#0047cc] hover:underline font-semibold ml-0.5"
          >
            Daftar Sekarang
          </a>
        </p>
      </div>
    </div>
  )
}
