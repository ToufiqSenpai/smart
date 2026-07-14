import { ReactNode } from 'react'

export interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
      <div className="flex justify-center mb-3 text-slate-300">
        {icon}
      </div>
      <h3 className="text-slate-700 font-bold text-sm">{title}</h3>
      {description && (
        <p className="text-slate-400 text-xs mt-1">{description}</p>
      )}
    </div>
  )
}
