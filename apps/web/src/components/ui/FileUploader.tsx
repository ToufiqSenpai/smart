import { useRef, useState, DragEvent, ChangeEvent } from 'react'
import { UploadCloud, X } from 'lucide-react'

export interface FileUploaderProps {
  previewUrl: string | null
  fileName: string | null
  onFileSelected: (file: File) => void
  onClear: () => void
  maxSizeMB?: number
}

export function FileUploader({ previewUrl, fileName, onFileSelected, onClear, maxSizeMB = 5 }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    processFile(file)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    processFile(file)
  }

  const processFile = (file?: File) => {
    if (file) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`Ukuran file maksimal adalah ${maxSizeMB}MB.`)
        return
      }
      onFileSelected(file)
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group ${
        isDragging
          ? 'border-[#0047cc] bg-blue-50/20'
          : 'border-slate-200/80 hover:border-[#0047cc]/40 bg-slate-50/40 hover:bg-slate-50/70'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {previewUrl ? (
        <div className="relative w-full flex flex-col items-center gap-2 animate-[fadeIn_0.2s_ease-out]">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-24 rounded-lg object-cover border border-slate-100"
          />
          {fileName && (
            <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[200px]">
              {fileName}
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-sm transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <>
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-[#edf4ff] group-hover:text-[#0047cc] transition-colors shrink-0">
            <UploadCloud className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-600">
            Tarik file ke sini atau klik untuk memilih file
          </span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            MAKSIMAL {maxSizeMB}MB (JPG, PNG)
          </span>
        </>
      )}
    </div>
  )
}
