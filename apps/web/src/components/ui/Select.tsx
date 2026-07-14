import { SelectHTMLAttributes, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, children, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200/80 text-slate-700 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all appearance-none cursor-pointer pr-9 font-medium ${className}`}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    )
  }
)

Select.displayName = 'Select'
