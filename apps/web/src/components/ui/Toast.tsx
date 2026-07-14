import { CheckCircle2, X } from 'lucide-react'

export interface ToastProps {
  message: string | null
  onClose: () => void
}

export function Toast({ message, onClose }: ToastProps) {
  if (!message) return null

  return (
    <div className="fixed top-6 right-6 z-50 bg-[#0047cc] text-white font-semibold text-xs px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 animate-[slideIn_0.2s_ease-out]">
      <CheckCircle2 className="w-4 h-4 shrink-0" />
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="p-1 hover:bg-[#003bb3] rounded-lg transition-colors ml-2 cursor-pointer"
        aria-label="Tutup notifikasi"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
