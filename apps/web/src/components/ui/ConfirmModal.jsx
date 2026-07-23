import Modal from "./Modal"
import Button from "./Button"

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah Anda yakin?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  variant = "primary",
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="text-center py-2">
        <div
          className={`mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center ${
            variant === "danger"
              ? "bg-[#FEF2F2] text-[#B91C1C]"
              : variant === "success"
                ? "bg-[#F0FDF4] text-[#15803D]"
                : "bg-[rgba(30,75,133,0.08)] text-[#1E4B85]"
          }`}
        >
          {variant === "danger" ? (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          ) : variant === "success" ? (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          )}
        </div>
        <h4 className="font-grotesk text-base font-bold text-[#09090B] mb-1">{title}</h4>
        <p className="text-sm text-[#71717A]">{message}</p>
      </div>
      <div className="flex gap-3 justify-center mt-6">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={variant === "danger" ? "danger" : "primary"}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Memproses..." : confirmText}
        </Button>
      </div>
    </Modal>
  )
}
