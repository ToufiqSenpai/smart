import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Toast } from '@/components/ui/Toast'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { FileUploader } from '@/components/ui/FileUploader'
import {
  Wallet,
  ChevronLeft,
  ChevronRight,
  Info,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Eye,
  ListFilter,
  Copy,
  Check,
  Loader2,
  Coins,
} from 'lucide-react'

export const Route = createFileRoute('/_dashboard/contributions/')({
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
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('mock_transactions')
    if (saved) {
      const parsed = JSON.parse(saved)
      const combined = [...parsed]
      INITIAL_TRANSACTIONS.forEach((def) => {
        if (!combined.some((c) => c.id === def.id)) {
          combined.push(def)
        }
      })
      return combined
    }
    return INITIAL_TRANSACTIONS
  })

  const [billingPeriod] = useState('Juli 2024')

  // Calculate status from localStorage to sync with validation
  const [billingStatus, setBillingStatus] = useState<
    'BELUM_BAYAR' | 'PENDING' | 'LUNAS'
  >(() => {
    // If any transaction for "Juli 2024" is in "PROSES VERIFIKASI", status is PENDING.
    // If any transaction for "Juli 2024" is in "LUNAS", status is LUNAS.
    const juliTx = transactions.find((t) => t.month === 'Juli 2024')
    if (juliTx) {
      return juliTx.status === 'LUNAS' ? 'LUNAS' : 'PENDING'
    }
    return 'BELUM_BAYAR'
  })

  const [totalPaid, setTotalPaid] = useState(() => {
    // Calculate total verified paid
    const verifiedTxs = transactions.filter((t) => t.status === 'LUNAS')
    return verifiedTxs.length * 150000
  })

  const [annualProgress, setAnnualProgress] = useState(() => {
    const verifiedTxs = transactions.filter((t) => t.status === 'LUNAS')
    const target = 1800000 // Annual target: 12 months * 150000
    const progress = Math.min(
      Math.round((verifiedTxs.length * 150000 * 100) / target),
      100,
    )
    return progress
  })

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
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4
  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = transactions.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  useEffect(() => {
    // Recalculate status and stats when transactions list updates
    const juliTx = transactions.find((t) => t.month === 'Juli 2024')
    if (juliTx) {
      setBillingStatus(juliTx.status === 'LUNAS' ? 'LUNAS' : 'PENDING')
    } else {
      setBillingStatus('BELUM_BAYAR')
    }

    const verifiedTxs = transactions.filter((t) => t.status === 'LUNAS')
    setTotalPaid(verifiedTxs.length * 150000)

    const target = 1800000
    setAnnualProgress(
      Math.min(Math.round((verifiedTxs.length * 150000 * 100) / target), 100),
    )
  }, [transactions])

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(null), 2000)
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
        id: Date.now().toString(),
        month: 'Juli 2024',
        payDate: formattedDate,
        amount: 'Rp 150.000',
        status: 'PROSES VERIFIKASI',
        notes: notes.trim() || 'Pembayaran iuran Juli via Transfer',
        photoUrl: photoPreview,
        photoName: photoFile.name,
      }

      const updated = [newTx, ...transactions]
      setTransactions(updated)
      localStorage.setItem('mock_transactions', JSON.stringify(updated))

      // Also append to the board's pending verification list for integration
      const boardPendingSaved = localStorage.getItem('board_iuran_pending')
      const boardPending = boardPendingSaved
        ? JSON.parse(boardPendingSaved)
        : []
      const newBoardPending = {
        id: newTx.id,
        citizenName: 'Budi Santoso',
        blok: 'Blok C-12',
        iuranName: 'Keamanan & Kebersihan',
        amount: 'Rp 150.000',
        imageUrl: photoPreview,
        date: formattedDate,
      }
      localStorage.setItem(
        'board_iuran_pending',
        JSON.stringify([newBoardPending, ...boardPending]),
      )

      // Reset form
      setPhotoFile(null)
      setPhotoPreview(null)
      setNotes('')
      setIsPaymentModalOpen(false)
      setIsSubmitting(false)
      setCurrentPage(1)

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
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Page Title */}
      <PageHeader title="Iuran Bulanan" />

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
          className="bg-[#0047cc] hover:bg-[#003bb3] active:bg-[#003399] disabled:bg-slate-105 disabled:text-slate-400 disabled:shadow-none text-white font-bold rounded-xl px-5 py-3.5 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#0047cc]/15 transition-all self-start sm:self-center"
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
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/20">
          <h3 className="text-sm font-bold text-slate-800">
            Riwayat Pembayaran
          </h3>
          <button className="p-2 text-slate-400 hover:text-slate-650 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100/60 bg-white shadow-sm cursor-pointer">
            <ListFilter className="w-4 h-4" />
          </button>
        </div>

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
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title={
          <span className="flex items-center gap-2">
            <Wallet className="w-4.5 h-4.5 text-[#0047cc]" />
            Konfirmasi Pembayaran
          </span>
        }
        maxWidthClass="max-w-md"
      >
        <div className="space-y-5">
          <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 space-y-3">
            <span className="text-[10px] font-bold text-blue-900 block uppercase tracking-wider">
              Instruksi Pembayaran
            </span>
            <p className="text-[11px] text-slate-500 leading-normal">
              Silakan lakukan transfer iuran sebesar{' '}
              <strong className="text-blue-700">Rp 150.000</strong> ke salah
              satu rekening pengurus RT berikut:
            </p>

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

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <Input
              type="date"
              label="Tanggal Bayar"
              value={payDate}
              onChange={(e) => setPayDate(e.target.value)}
            />

            <FileUploader
              label="Bukti Transfer (Image/PDF)"
              file={photoFile}
              preview={photoPreview}
              onFileChange={(f, p) => {
                setPhotoFile(f)
                setPhotoPreview(p)
              }}
              accept="image/*,application/pdf"
            />

            <Textarea
              label="Catatan (Opsional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Pembayaran iuran via m-BCA Sudirman"
              rows={3}
            />

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
      </Modal>

      {/* MODAL 2: Lihat Rincian Tagihan */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Rincian Tagihan Iuran"
        maxWidthClass="max-w-sm"
      >
        <div className="space-y-3.5">
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>Periode Tagihan</span>
            <span className="text-slate-800 font-bold">{billingPeriod}</span>
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
              <span className="font-semibold text-slate-800">Rp 100.000</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Kas Lingkungan (RT 05)</span>
              <span className="font-semibold text-slate-800">Rp 50.000</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3.5 flex justify-between text-sm font-bold text-slate-800">
            <span>Total Biaya</span>
            <span className="text-[#0047cc] font-extrabold text-base">
              Rp 150.000
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsDetailsModalOpen(false)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl py-3 text-xs transition-all cursor-pointer text-center"
          >
            Tutup
          </button>
        </div>
      </Modal>

      {/* MODAL 3: Lihat Bukti Transfer Receipt */}
      <Modal
        isOpen={isReceiptModalOpen && selectedTransaction !== null}
        onClose={() => {
          setIsReceiptModalOpen(false)
          setSelectedTransaction(null)
        }}
        title="Bukti Pembayaran"
        maxWidthClass="max-w-sm"
      >
        {selectedTransaction && (
          <>
            <div className="space-y-4">
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
                    <FileText className="w-8 h-8 text-slate-350" />
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

            <div className="mt-6 flex justify-end">
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
          </>
        )}
      </Modal>
    </div>
  )
}
