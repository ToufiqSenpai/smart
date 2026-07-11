import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import {
  Wallet,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Info,
  FileText,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  X,
  Eye,
  ListFilter,
  ChevronDown,
  Copy,
  Check,
  Loader2,
  Coins,
} from 'lucide-react'

export const Route = createFileRoute('/_dashboard/contributions')({
  component: ContributionsPage,
})

interface Transaction {
  id: string
  month: string
  payDate: string
  amount: string
  status: 'LUNAS' | 'PROSES VERIFIKASI'
  notes?: string
  photoUrl?: string | null
  photoName?: string | null
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    month: 'Juni 2024',
    payDate: '05 Jun 2024',
    amount: 'Rp 150.000',
    status: 'LUNAS',
    notes: 'Pembayaran iuran Juni via BCA',
  },
  {
    id: '2',
    month: 'Mei 2024',
    payDate: '02 Mei 2024',
    amount: 'Rp 150.000',
    status: 'LUNAS',
    notes: 'Pembayaran iuran Mei via BCA',
  },
  {
    id: '3',
    month: 'April 2024',
    payDate: '12 Apr 2024',
    amount: 'Rp 150.000',
    status: 'LUNAS',
    notes: 'Pembayaran iuran April via Mandiri',
  },
  {
    id: '4',
    month: 'Maret 2024',
    payDate: '28 Mar 2024',
    amount: 'Rp 150.000',
    status: 'LUNAS',
    notes: 'Pembayaran iuran Maret via Mandiri',
  },
  {
    id: '5',
    month: 'Februari 2024',
    payDate: '04 Feb 2024',
    amount: 'Rp 150.000',
    status: 'LUNAS',
    notes: 'Pembayaran iuran Februari via BCA',
  },
  {
    id: '6',
    month: 'Januari 2024',
    payDate: '02 Jan 2024',
    amount: 'Rp 150.000',
    status: 'LUNAS',
    notes: 'Pembayaran iuran Januari via Mandiri',
  },
  {
    id: '7',
    month: 'Desember 2023',
    payDate: '27 Des 2023',
    amount: 'Rp 150.000',
    status: 'LUNAS',
    notes: 'Pembayaran iuran akhir tahun via BCA',
  },
]

function ContributionsPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(INITIAL_TRANSACTIONS)
  const [billingPeriod, setBillingPeriod] = useState('Juli 2024')
  const [billingStatus, setBillingStatus] = useState<
    'BELUM_BAYAR' | 'PENDING' | 'LUNAS'
  >('BELUM_BAYAR')
  const [totalPaid, setTotalPaid] = useState(1050000)
  const [annualProgress, setAnnualProgress] = useState(58)

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null)

  // Payment Form state
  const [payDate, setPayDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [notes, setNotes] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4
  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = transactions.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    processFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    processFile(file)
  }

  const processFile = (file?: File) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal adalah 5MB.')
        return
      }
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!payDate) {
      alert('Silakan pilih tanggal pembayaran.')
      return
    }
    if (!photoFile) {
      alert('Silakan unggah bukti transfer pembayaran terlebih dahulu.')
      return
    }

    setIsSubmitting(true)

    // Simulate transfer verifications
    setTimeout(() => {
      const formattedDate = new Date(payDate).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })

      const newTx: Transaction = {
        id: (transactions.length + 1).toString(),
        month: 'Juli 2024',
        payDate: formattedDate,
        amount: 'Rp 150.000',
        status: 'PROSES VERIFIKASI',
        notes: notes.trim() || 'Pembayaran iuran Juli via Transfer',
        photoUrl: photoPreview,
        photoName: photoFile.name,
      }

      setTransactions([newTx, ...transactions])
      setBillingStatus('PENDING')
      setTotalPaid((prev) => prev + 150000)
      setAnnualProgress(66) // Increase annual progress (1200000 / 1800000 approx)

      // Reset form
      setPhotoFile(null)
      setPhotoPreview(null)
      setNotes('')
      setIsPaymentModalOpen(false)
      setIsSubmitting(false)
      setCurrentPage(1) // Move back to page 1 to see the new entry

      // Toast Success
      setToastMessage(
        'Bukti pembayaran berhasil diunggah! Mohon tunggu verifikasi admin.',
      )
      setTimeout(() => setToastMessage(null), 4000)
    }, 1500)
  }

  const handleViewReceipt = (tx: Transaction) => {
    setSelectedTransaction(tx)
    setIsReceiptModalOpen(true)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  // Format currency
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    })
      .format(num)
      .replace('IDR', 'Rp')
  }

  return (
    <div className="max-w-6xl mx-auto p-1 animate-[fadeIn_0.3s_ease-out] relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0047cc] text-white font-semibold text-xs px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 animate-[slideIn_0.2s_ease-out]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-[#003bb3] rounded-lg transition-colors ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#0047cc] tracking-tight">
          Iuran Bulanan
        </h1>
      </div>

      {/* Action Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Kelola Iuran Bulanan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pantau status pembayaran iuran lingkungan Anda secara transparan.
          </p>
        </div>
        <button
          onClick={() => setIsPaymentModalOpen(true)}
          disabled={billingStatus !== 'BELUM_BAYAR'}
          className="bg-[#0047cc] hover:bg-[#003bb3] active:bg-[#003399] disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none text-white font-bold rounded-xl px-5 py-3.5 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#0047cc]/15 transition-all self-start sm:self-center"
        >
          <Wallet className="w-4 h-4" />
          <span>
            {billingStatus === 'BELUM_BAYAR'
              ? 'Bayar Sekarang'
              : billingStatus === 'PENDING'
                ? 'Sedang Diverifikasi'
                : 'Sudah Lunas'}
          </span>
        </button>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card 1: Bill details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex flex-col justify-between min-h-[190px]">
          <div className="flex justify-between items-start">
            {/* Status Badge */}
            {billingStatus === 'BELUM_BAYAR' ? (
              <span className="bg-rose-50 border border-rose-100 text-rose-600 font-bold px-2.5 py-1 rounded-lg text-[9px] tracking-wide uppercase inline-flex items-center gap-1.5 select-none">
                <AlertTriangle className="w-3 h-3" />
                Belum Bayar
              </span>
            ) : billingStatus === 'PENDING' ? (
              <span className="bg-amber-50 border border-amber-100 text-amber-600 font-bold px-2.5 py-1 rounded-lg text-[9px] tracking-wide uppercase inline-flex items-center gap-1.5 select-none">
                <Loader2 className="w-3 h-3 animate-spin" />
                Proses Verifikasi
              </span>
            ) : (
              <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold px-2.5 py-1 rounded-lg text-[9px] tracking-wide uppercase inline-flex items-center gap-1.5 select-none">
                <CheckCircle2 className="w-3 h-3" />
                Lunas
              </span>
            )}

            {/* Total Billing */}
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider block uppercase">
                Total Tagihan
              </span>
              <span className="text-[#0047cc] font-extrabold text-xl mt-1 block">
                Rp 150.000
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-bold text-slate-800">
              Periode: {billingPeriod}
            </h3>
          </div>

          {/* Info Notice Banner */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3 mt-4 text-xs text-slate-600 items-start">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <span>
              {billingStatus === 'BELUM_BAYAR'
                ? 'Batas waktu pembayaran untuk bulan ini adalah tanggal 10 Juli 2024.'
                : billingStatus === 'PENDING'
                  ? 'Laporan bukti transfer Anda sedang diperiksa oleh admin. Harap menunggu update.'
                  : 'Seluruh tagihan iuran wajib bulanan Anda untuk periode ini telah diselesaikan.'}
            </span>
          </div>

          <button
            onClick={() => setIsDetailsModalOpen(true)}
            className="mt-5 border border-slate-200 hover:border-blue-200 hover:bg-[#edf4ff]/30 text-slate-600 hover:text-[#0047cc] font-bold rounded-xl py-3 px-5 text-xs transition-all w-full text-center cursor-pointer"
          >
            Lihat Rincian Tagihan
          </button>
        </div>

        {/* Card 2: Yearly stats */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex flex-col justify-between min-h-[190px]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#edf4ff] text-[#0047cc] flex items-center justify-center shrink-0 border border-slate-50 shadow-sm">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider block uppercase">
                Total Terbayar 2024
              </span>
              <span className="text-slate-800 font-extrabold text-2xl mt-1 block">
                {formatIDR(totalPaid)}
              </span>
              <span className="text-xs text-slate-400 font-semibold mt-2.5 block">
                Meningkat 15% dari tahun lalu.
              </span>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-slate-500">Target Tahunan</span>
              <span className="text-blue-600">{annualProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${annualProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Section */}
      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/20">
          <h3 className="text-sm font-bold text-slate-800">
            Riwayat Pembayaran
          </h3>
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100/60 bg-white shadow-sm cursor-pointer">
            <ListFilter className="w-4 h-4" />
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-6 py-4 bg-slate-50/30 border-b border-slate-100">
                  Bulan
                </th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-6 py-4 bg-slate-50/30 border-b border-slate-100">
                  Tanggal Bayar
                </th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-6 py-4 bg-slate-50/30 border-b border-slate-100">
                  Jumlah
                </th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-6 py-4 bg-slate-50/30 border-b border-slate-100">
                  Status
                </th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-6 py-4 bg-slate-50/30 border-b border-slate-100">
                  Bukti
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100/60 hover:bg-slate-50/10 transition-colors"
                >
                  <td className="px-6 py-4.5 text-xs text-slate-800 font-bold">
                    {item.month}
                  </td>
                  <td className="px-6 py-4.5 text-xs text-slate-500 font-semibold">
                    {item.payDate}
                  </td>
                  <td className="px-6 py-4.5 text-xs text-emerald-600 font-bold">
                    {item.amount}
                  </td>
                  <td className="px-6 py-4.5 text-xs">
                    {item.status === 'LUNAS' ? (
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[9px] tracking-wide uppercase inline-block">
                        Lunas
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[9px] tracking-wide uppercase inline-block">
                        Verifikasi
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4.5 text-xs">
                    <button
                      onClick={() => handleViewReceipt(item)}
                      className="text-[#0047cc] hover:text-[#003bb3] flex items-center gap-1 font-bold text-xs cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-slate-100 bg-slate-50/10 text-xs">
          <span className="text-slate-400 font-semibold">
            Menampilkan {startIndex + 1} -{' '}
            {Math.min(startIndex + itemsPerPage, transactions.length)} dari{' '}
            {transactions.length} transaksi
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 text-slate-500 hover:text-slate-800 disabled:text-slate-300 disabled:border-slate-100 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-slate-200 text-slate-500 hover:text-slate-800 disabled:text-slate-300 disabled:border-slate-100 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: Bayar Sekarang (Upload Proof + Bank Details) */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full p-6 relative animate-[scaleIn_0.2s_ease-out] overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Wallet className="w-4.5 h-4.5 text-[#0047cc]" />
                Konfirmasi Pembayaran
              </h2>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1 -mr-1">
              {/* Payment Instructions panel */}
              <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 space-y-3">
                <span className="text-[10px] font-bold text-blue-900 block uppercase tracking-wider">
                  Instruksi Pembayaran
                </span>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Silakan lakukan transfer iuran sebesar{' '}
                  <strong className="text-blue-700">Rp 150.000</strong> ke salah
                  satu rekening pengurus RT berikut:
                </p>

                {/* Account Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-slate-100/80 shadow-sm text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px] uppercase tracking-wide">
                        Bank Mandiri
                      </span>
                      <span className="text-slate-700 font-bold">
                        123-000-456-7890
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('123-000-456-7890', 'mandiri')}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#0047cc] transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      {copiedText === 'mandiri' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-slate-100/80 shadow-sm text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px] uppercase tracking-wide">
                        Bank BCA
                      </span>
                      <span className="text-slate-700 font-bold">
                        778-990-1234
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('778-990-1234', 'bca')}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#0047cc] transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      {copiedText === 'bca' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-bold text-center italic pt-1">
                  A.n. Pengurus Lingkungan Smart Residence
                </div>
              </div>

              {/* Upload Form */}
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Tanggal Bayar
                  </label>
                  <input
                    type="date"
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100/30 border border-slate-200/80 text-slate-700 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Bukti Transfer (Image/PDF)
                  </label>
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
                      accept="image/*,application/pdf"
                      className="hidden"
                    />
                    {photoPreview ? (
                      <div className="relative w-full flex flex-col items-center gap-2 animate-[fadeIn_0.2s_ease-out]">
                        <img
                          src={photoPreview}
                          alt="Preview Bukti"
                          className="max-h-24 rounded-lg object-cover border border-slate-100"
                        />
                        <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[200px]">
                          {photoFile?.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setPhotoFile(null)
                            setPhotoPreview(null)
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
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100/30 border border-slate-200/80 text-slate-700 placeholder-slate-400 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all resize-none h-20 leading-relaxed"
                    placeholder="Contoh: Pembayaran iuran via m-BCA Sudirman"
                  />
                </div>

                <div className="pt-2 flex gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl py-3 text-xs transition-all cursor-pointer text-center"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#0047cc] hover:bg-[#003bb3] active:bg-[#003399] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl py-3 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#0047cc]/10 transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      <span>Kirim Konfirmasi</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Lihat Rincian Tagihan */}
      {isDetailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-sm w-full p-6 relative animate-[scaleIn_0.2s_ease-out]">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">
                Rincian Tagihan Iuran
              </h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Body */}
            <div className="py-4 space-y-3.5">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Periode Tagihan</span>
                <span className="text-slate-800 font-bold">
                  {billingPeriod}
                </span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Status Tagihan</span>
                {billingStatus === 'BELUM_BAYAR' ? (
                  <span className="text-rose-600 font-bold">Belum Bayar</span>
                ) : billingStatus === 'PENDING' ? (
                  <span className="text-amber-600 font-bold">
                    Proses Verifikasi
                  </span>
                ) : (
                  <span className="text-emerald-600 font-bold">Lunas</span>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3.5 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Iuran Kebersihan &amp; Keamanan</span>
                  <span className="font-semibold text-slate-800">
                    Rp 100.000
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Kas Lingkungan (RT 05)</span>
                  <span className="font-semibold text-slate-800">
                    Rp 50.000
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3.5 flex justify-between text-sm font-bold text-slate-800">
                <span>Total Biaya</span>
                <span className="text-[#0047cc] font-extrabold text-base">
                  Rp 150.000
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl py-3 text-xs transition-all cursor-pointer text-center"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Lihat Bukti Transfer Receipt */}
      {isReceiptModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-sm w-full p-6 relative animate-[scaleIn_0.2s_ease-out]">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">
                Bukti Pembayaran
              </h2>
              <button
                onClick={() => {
                  setIsReceiptModalOpen(false)
                  setSelectedTransaction(null)
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Details */}
            <div className="py-4 space-y-4">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2.5">
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>Nama Transaksi</span>
                  <span className="text-slate-800 font-bold">
                    Iuran Warga RT 05
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>Periode Bulan</span>
                  <span className="text-slate-800 font-bold">
                    {selectedTransaction.month}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>Tanggal Bayar</span>
                  <span className="text-slate-800 font-bold">
                    {selectedTransaction.payDate}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>Jumlah Transfer</span>
                  <span className="text-emerald-600 font-extrabold">
                    {selectedTransaction.amount}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>Status Transaksi</span>
                  {selectedTransaction.status === 'LUNAS' ? (
                    <span className="text-emerald-600 font-extrabold">
                      VERIFIED / LUNAS
                    </span>
                  ) : (
                    <span className="text-amber-600 font-extrabold">
                      DALAM VERIFIKASI
                    </span>
                  )}
                </div>
                {selectedTransaction.notes && (
                  <div className="border-t border-slate-200/60 pt-2 text-[11px] text-slate-400 italic">
                    Catatan: "{selectedTransaction.notes}"
                  </div>
                )}
              </div>

              {/* Receipt File Preview */}
              <div>
                <span className="text-xs font-semibold text-slate-500 mb-2 block">
                  Lampiran File Bukti
                </span>
                {selectedTransaction.photoUrl ? (
                  <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-inner max-h-56">
                    <img
                      src={selectedTransaction.photoUrl}
                      alt="Receipt Attachment"
                      className="w-full object-cover max-h-56"
                    />
                  </div>
                ) : (
                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 text-center text-slate-400 flex flex-col items-center gap-2">
                    <FileText className="w-8 h-8 text-slate-300" />
                    <span className="text-xs font-semibold">
                      Resi Transfer Digital
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Verified by RT Bank Statement
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setIsReceiptModalOpen(false)
                  setSelectedTransaction(null)
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl py-3 text-xs transition-all cursor-pointer text-center"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
