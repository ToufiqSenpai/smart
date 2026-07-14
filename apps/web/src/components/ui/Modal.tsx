import { ReactNode } from 'react'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  maxWidthClass?: string // e.g., 'max-w-md', 'max-w-sm', 'max-w-xs'
}

export function Modal({ isOpen, onClose, title, children, maxWidthClass = 'max-w-md' }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className={`bg-white rounded-3xl border border-slate-100 shadow-2xl ${maxWidthClass} w-full p-6 relative animate-[scaleIn_0.2s_ease-out] overflow-hidden max-h-[90vh] flex flex-col`}>
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 -mr-1">
          {children}
        </div>
      </div>
    </div>
  )
}
