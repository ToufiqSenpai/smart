import { TextareaHTMLAttributes, forwardRef } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200/80 text-slate-700 placeholder-slate-400 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all resize-none leading-relaxed ${className}`}
          {...props}
        />
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
