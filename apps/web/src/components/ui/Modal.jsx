import { useEffect, useCallback } from "react"

const sizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  size = "md",
  children,
  footer,
  closeOnOverlay = true,
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose?.()
    },
    [onClose],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => {
        if (closeOnOverlay && e.target === e.currentTarget) onClose?.()
      }}
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className={`relative w-full ${sizes[size]} bg-white rounded-[20px] shadow-[0_40px_80px_rgba(0,0,0,0.12)] max-h-[90vh] flex flex-col`}
      >
        <div className="flex items-start justify-between gap-4 px-7 py-5 border-b border-[#E4E4E7]">
          <div className="min-w-0">
            {title && (
              <h3 className="font-grotesk text-lg font-bold text-[#09090B] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[13px] text-[#71717A] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border-none bg-transparent text-[#A1A1AA] cursor-pointer hover:bg-[#F4F4F5] hover:text-[#09090B] transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-7 py-6 flex-1">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 px-7 py-4 border-t border-[#E4E4E7]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
