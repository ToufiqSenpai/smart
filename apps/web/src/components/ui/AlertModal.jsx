import Modal from "./Modal"
import Button from "./Button"

const ICONS = {
  success: (
    <svg className="w-10 h-10 text-[#15803D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
  ),
  error: (
    <svg className="w-10 h-10 text-[#B91C1C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
  ),
  info: (
    <svg className="w-10 h-10 text-[#1E4B85]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
  ),
}

export default function AlertModal({ open, onClose, type = "info", title, message }) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="text-center py-4">
        <div className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: type === 'success' ? '#F0FDF4' : type === 'error' ? '#FEF2F2' : 'rgba(30,75,133,0.08)'
          }}
        >
          {ICONS[type] || ICONS.info}
        </div>
        <h3 className="font-grotesk text-lg font-bold text-[#09090B] mb-2">{title}</h3>
        {message && <p className="text-sm text-[#71717A] leading-relaxed">{message}</p>}
      </div>
      <div className="flex justify-center mt-2">
        <Button onClick={onClose}>Tutup</Button>
      </div>
    </Modal>
  )
}
