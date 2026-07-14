import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Toast } from '@/components/ui/Toast'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import {
  Coins,
  CheckCircle2,
  Plus,
  AlertTriangle,
  Clock,
  Info,
  Calendar,
  FileText,
  Shield,
} from 'lucide-react'

export const Route = createFileRoute('/_dashboard/contributions/kelola')({
  component: KelolaIuranPage,
})

interface IuranStructure {
  id: string
  title: string
  amount: string
  type: string
  lastUpdate: string
  status: 'AKTIF' | 'NON-AKTIF'
}

interface PendingVerification {
  id: string
  citizenName: string
  blok: string
  iuranName: string
  amount: string
  imageUrl?: string | null
  date: string
}

interface GeneralTransaction {
  id: string
  citizenName: string
  blok: string
  iuranName: string
  amount: string
  date: string
  status: 'BERHASIL' | 'DIPROSES' | 'DITOLAK'
  method?: string
}

const INITIAL_IURAN_LIST: IuranStructure[] = [
  {
    id: 'i1',
    title: 'Iuran Keamanan & Kebersihan',
    amount: 'Rp 150.000',
    type: 'Wajib bulanan',
    lastUpdate: '01 Okt 2023',
    status: 'AKTIF',
  },
  {
    id: 'i2',
    title: 'Iuran Perayaan HUT RI',
    amount: 'Rp 200.000',
    type: 'Insidental',
    lastUpdate: '15 Jul 2023',
    status: 'NON-AKTIF',
  },
  {
    id: 'i3',
    title: 'Iuran Perbaikan Fasum',
    amount: 'Rp 500.000',
    type: 'Wajib Khusus',
    lastUpdate: '12 Sep 2023',
    status: 'AKTIF',
  },
]

const INITIAL_PENDING_VERIFICATIONS: PendingVerification[] = [
  {
    id: 'pv1',
    citizenName: 'Deni Kurniawan',
    blok: 'Blok A-20',
    iuranName: 'Keamanan',
    amount: 'Rp 150.000',
    imageUrl:
      'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=300&auto=format&fit=crop&q=40', // stylized bill/paper look alike
    date: '05 Okt 2023',
  },
  {
    id: 'pv2',
    citizenName: 'Linda Sari',
    blok: 'Blok B-05',
    iuranName: 'Fasum',
    amount: 'Rp 500.000',
    imageUrl: null,
    date: '05 Okt 2023',
  },
]

const INITIAL_TRANSACTIONS: GeneralTransaction[] = [
  {
    id: 't1',
    citizenName: 'Andi Saputra',
    blok: 'Blok A-12',
    iuranName: 'Iuran Keamanan',
    amount: 'Rp 150.000',
    date: '05 Okt, 14:20',
    status: 'BERHASIL',
    method: 'Transfer Bank',
  },
  {
    id: 't2',
    citizenName: 'Siti Maryam',
    blok: 'Blok B-03',
    iuranName: 'Iuran Perbaikan',
    amount: 'Rp 500.000',
    date: '05 Okt, 11:45',
    status: 'DIPROSES',
    method: 'Transfer Bank',
  },
  {
    id: 't3',
    citizenName: 'Rudi Perkasa',
    blok: 'Blok C-01',
    iuranName: 'Iuran Keamanan',
    amount: 'Rp 150.000',
    date: '04 Okt, 18:10',
    status: 'BERHASIL',
    method: 'E-Wallet',
  },
]

function KelolaIuranPage() {
  const [iuranList, setIuranList] = useState<IuranStructure[]>(() => {
    const saved = localStorage.getItem('board_iuran_structures')
    return saved ? JSON.parse(saved) : INITIAL_IURAN_LIST
  })

  const [pendingVerifications, setPendingVerifications] = useState<
    PendingVerification[]
  >(() => {
    const saved = localStorage.getItem('board_iuran_pending')
    return saved ? JSON.parse(saved) : INITIAL_PENDING_VERIFICATIONS
  })

  const [transactions, setTransactions] = useState<GeneralTransaction[]>(() => {
    const saved = localStorage.getItem('board_iuran_transactions')
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS
  })

  // Global board statistics state
  const [totalTagihan, setTotalTagihan] = useState(45250000)
  const [pembayaranTerverifikasi, setPembayaranTerverifikasi] =
    useState(32800000)
  const [iuranBelumBayar, setIuranBelumBayar] = useState(12450000)

  // Form states
  const [judulIuran, setJudulIuran] = useState('')
  const [kategori, setKategori] = useState('Perayaan')
  const [tagihanPerKK, setTagihanPerKK] = useState('')
  const [tenggat, setTenggat] = useState('')
  const [kategoriIuran, setKategoriIuran] = useState('Wajib')

  // Status deactivator selection
  const [deactivateId, setDeactivateId] = useState('')

  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string | null>(
    null,
  )

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('board_iuran_structures', JSON.stringify(iuranList))
  }, [iuranList])

  useEffect(() => {
    localStorage.setItem(
      'board_iuran_pending',
      JSON.stringify(pendingVerifications),
    )
  }, [pendingVerifications])

  useEffect(() => {
    localStorage.setItem(
      'board_iuran_transactions',
      JSON.stringify(transactions),
    )
  }, [transactions])

  const handleAddIuran = (e: React.FormEvent) => {
    e.preventDefault()
    if (!judulIuran.trim()) {
      alert('Silakan isi judul iuran.')
      return
    }
    if (!tagihanPerKK.trim()) {
      alert('Silakan isi nominal tagihan.')
      return
    }

    // Format clean money entry
    const numericStr = tagihanPerKK.replace(/[^0-9]/g, '')
    const nominal = parseInt(numericStr, 10)
    if (isNaN(nominal)) {
      alert('Nominal tagihan harus berupa angka.')
      return
    }

    const formattedAmount = `Rp ${nominal.toLocaleString('id-ID')}`

    const newItem: IuranStructure = {
      id: Date.now().toString(),
      title: judulIuran.trim(),
      amount: formattedAmount,
      type: kategoriIuran === 'Wajib' ? 'Wajib bulanan' : 'Insidental',
      lastUpdate: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'AKTIF',
    }

    setIuranList([newItem, ...iuranList])

    // Reset Form
    setJudulIuran('')
    setTagihanPerKK('')
    setTenggat('')
    setToastMessage(
      `Iuran "${newItem.title}" berhasil ditambahkan dan diaktifkan!`,
    )
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleVerify = (item: PendingVerification) => {
    // 1. Resolve numeric amount
    const numericStr = item.amount.replace(/[^0-9]/g, '')
    const amountVal = parseInt(numericStr, 10) || 0

    // 2. Add to transaction log list
    const newTx: GeneralTransaction = {
      id: Date.now().toString(),
      citizenName: item.citizenName,
      blok: item.blok,
      iuranName: `Iuran ${item.iuranName}`,
      amount: item.amount,
      date:
        new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
        }) +
        `, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
      status: 'BERHASIL',
      method: 'Transfer Bank',
    }

    // Append to transactions
    setTransactions([newTx, ...transactions])

    // Remove from pending validation
    setPendingVerifications((prev) => prev.filter((p) => p.id !== item.id))

    // Update totals
    setPembayaranTerverifikasi((prev) => prev + amountVal)
    setIuranBelumBayar((prev) => Math.max(prev - amountVal, 0))

    // Sync to citizen client if it matches Budi
    if (item.citizenName === 'Budi Santoso') {
      const citizenSaved = localStorage.getItem('mock_transactions')
      const currentCitTxs = citizenSaved ? JSON.parse(citizenSaved) : []
      const newCitTx = {
        id: item.id,
        month: 'Juli 2024',
        payDate: new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        amount: item.amount,
        status: 'LUNAS' as const,
        notes: 'Diverifikasi oleh RT',
      }
      localStorage.setItem(
        'mock_transactions',
        JSON.stringify([newCitTx, ...currentCitTxs]),
      )
    }

    setToastMessage(
      `Pembayaran dari ${item.citizenName} berhasil diverifikasi!`,
    )
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleDecline = (item: PendingVerification) => {
    // Remove from pending
    setPendingVerifications((prev) => prev.filter((p) => p.id !== item.id))

    // Sync status back to citizen client if it matches Budi
    if (item.citizenName === 'Budi Santoso') {
      const citizenSaved = localStorage.getItem('mock_transactions')
      const currentCitTxs = citizenSaved ? JSON.parse(citizenSaved) : []
      const updatedCit = currentCitTxs.filter((t: any) => t.id !== item.id)
      localStorage.setItem('mock_transactions', JSON.stringify(updatedCit))
    }

    setToastMessage(`Pembayaran dari ${item.citizenName} ditolak.`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleDeactivate = () => {
    if (!deactivateId) {
      alert('Pilih iuran untuk dinonaktifkan.')
      return
    }

    setIuranList((prev) =>
      prev.map((item) =>
        item.id === deactivateId
          ? { ...item, status: 'NON-AKTIF' as const }
          : item,
      ),
    )

    const targetItem = iuranList.find((i) => i.id === deactivateId)
    setDeactivateId('')

    setToastMessage(`Iuran "${targetItem?.title}" berhasil dinonaktifkan!`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  return (
    <div className="max-w-6xl mx-auto p-1 animate-[fadeIn_0.3s_ease-out] relative">
      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Page Title */}
      <PageHeader title="Iuran Bulanan" />

      {/* Top statistics panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 select-none">
        {/* Total Tagihan */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Tagihan (Bulan Ini)
            </span>
            <span className="text-slate-800 font-extrabold text-xl block">
              Rp {totalTagihan.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block">
              ↗ +12% dari bulan lalu
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047cc] flex items-center justify-center border border-blue-100/30">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        {/* Pembayaran Terverifikasi */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Pembayaran Terverifikasi
            </span>
            <span className="text-slate-800 font-extrabold text-xl block">
              Rp {pembayaranTerverifikasi.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block">
              {Math.min(
                Math.round((pembayaranTerverifikasi * 100) / totalTagihan),
                100,
              )}
              % dari total tagihan
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Iuran Belum Bayar */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Iuran Belum Bayar
            </span>
            <span className="text-rose-600 font-extrabold text-xl block">
              Rp {iuranBelumBayar.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-rose-500 font-semibold block">
              48 KK menunggak
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100/30">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Forms, Lists, Tables */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card: Tambah Iuran */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-100 select-none">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#0047cc]" />
                Tambah Iuran
              </h2>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  className="bg-white border border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer select-none"
                >
                  Edit iuran
                </button>
                <button
                  type="button"
                  className="bg-[#0047cc] hover:bg-[#003bb3] text-white rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer select-none shadow-sm shadow-[#0047cc]/10"
                >
                  Tambah iuran
                </button>
              </div>
            </div>

            <form onSubmit={handleAddIuran} className="space-y-4">
              <Input
                label="Judul Iuran"
                value={judulIuran}
                onChange={(e) => setJudulIuran(e.target.value)}
                placeholder="Contoh: Iuran HUT RI Ke-81"
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Kategori"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  options={[
                    { value: 'Perayaan', label: 'Perayaan' },
                    { value: 'Keamanan', label: 'Keamanan' },
                    { value: 'Kebersihan', label: 'Kebersihan' },
                    { value: 'Pembangunan', label: 'Pembangunan' },
                  ]}
                />

                <Input
                  label="Tagihan/KK"
                  value={tagihanPerKK}
                  onChange={(e) => setTagihanPerKK(e.target.value)}
                  placeholder="Contoh: Rp 100.000"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Tenggat"
                  value={tenggat}
                  onChange={(e) => setTenggat(e.target.value)}
                />

                <Select
                  label="Kategori Iuran"
                  value={kategoriIuran}
                  onChange={(e) => setKategoriIuran(e.target.value)}
                  options={[
                    { value: 'Wajib', label: 'Wajib' },
                    { value: 'Insidental', label: 'Insidental' },
                  ]}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0047cc] hover:bg-[#003bb3] text-white font-bold rounded-xl py-3 mt-4 text-xs transition-all shadow-md shadow-[#0047cc]/15 cursor-pointer text-center"
              >
                Tambah Iuran
              </button>
            </form>
          </div>

          {/* Card: Daftar Iuran */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
            <h2 className="text-base font-bold text-slate-800 mb-4 select-none">
              Daftar Iuran
            </h2>

            <div className="space-y-3">
              {iuranList.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-100 hover:border-slate-200 rounded-2xl p-4 flex justify-between items-center transition-all bg-slate-50/20"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${
                        item.status === 'AKTIF'
                          ? 'bg-blue-50 border-blue-100 text-[#0047cc]'
                          : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}
                    >
                      <Shield className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-450 font-semibold mt-0.5">
                        {item.type} • Update: {item.lastUpdate}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 select-none flex items-center gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">
                        {item.amount} / KK
                      </span>
                      <span
                        className={`inline-block text-[9px] font-bold tracking-wider px-2 py-0.5 mt-1 rounded uppercase ${
                          item.status === 'AKTIF'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => alert('Menampilkan rincian iuran.')}
              className="w-full mt-4 border border-slate-200 hover:border-[#0047cc]/20 text-slate-500 hover:text-[#0047cc] hover:bg-[#edf4ff]/30 text-xs font-bold rounded-xl py-3 text-center transition-all cursor-pointer"
            >
              Lihat Semua Jenis Iuran
            </button>
          </div>

          {/* Card: Transaksi Terakhir */}
          <div className="bg-white rounded-3xl border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/20">
              <h3 className="text-sm font-bold text-slate-800">
                Transaksi Terakhir
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/30">
                    <th className="text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3 border-b border-slate-100">
                      Nama Warga
                    </th>
                    <th className="text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3 border-b border-slate-100">
                      Jenis Iuran
                    </th>
                    <th className="text-right text-[9px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3 border-b border-slate-100">
                      Nominal
                    </th>
                    <th className="text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3 border-b border-slate-100">
                      Tanggal
                    </th>
                    <th className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3 border-b border-slate-100">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-slate-100/60 hover:bg-slate-50/10 transition-colors"
                    >
                      <td className="px-6 py-4 text-xs font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#edf4ff] text-[#0047cc] text-[9px] font-bold flex items-center justify-center shrink-0">
                            {tx.citizenName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <span className="block">{tx.citizenName}</span>
                            <span className="text-[9px] text-slate-400 font-semibold block">
                              {tx.blok}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                        {tx.iuranName}
                      </td>
                      <td className="px-6 py-4 text-xs text-right font-bold text-slate-800">
                        {tx.amount}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-450 font-semibold">
                        {tx.date}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            tx.status === 'BERHASIL'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tx.status === 'DIPROSES'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card: Daftar Pembayar */}
          <div className="bg-white rounded-3xl border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/20">
              <h3 className="text-sm font-bold text-slate-800">
                Daftar Pembayar
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/30">
                    <th className="text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3 border-b border-slate-100">
                      Nama Warga
                    </th>
                    <th className="text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3 border-b border-slate-100">
                      Tanggal
                    </th>
                    <th className="text-right text-[9px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3 border-b border-slate-100">
                      Nominal
                    </th>
                    <th className="text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3 border-b border-slate-100">
                      Metode
                    </th>
                    <th className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3 border-b border-slate-100">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions
                    .filter((t) => t.status === 'BERHASIL')
                    .map((tx) => (
                      <tr
                        key={`pay-${tx.id}`}
                        className="border-b border-slate-100/60 hover:bg-slate-50/10 transition-colors"
                      >
                        <td className="px-6 py-4 text-xs font-bold text-slate-800">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#edf4ff] text-[#0047cc] text-[9px] font-bold flex items-center justify-center shrink-0">
                              {tx.citizenName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </div>
                            <div>
                              <span className="block">{tx.citizenName}</span>
                              <span className="text-[9px] text-slate-400 font-semibold block">
                                {tx.blok}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                          {tx.date.split(',')[0]} 2023,{' '}
                          {tx.date.split(',')[1] || '12:00'}
                        </td>
                        <td className="px-6 py-4 text-xs text-right font-bold text-slate-800">
                          {tx.amount}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-650">
                          {tx.method || 'Transfer Bank'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-emerald-100 text-emerald-800 inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                            BERHASIL
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 text-center">
              <button
                onClick={() => alert('Menampilkan semua riwayat.')}
                className="text-[#0047cc] hover:text-[#003bb3] text-xs font-bold cursor-pointer"
              >
                Lihat Semua Riwayat
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Validation, Status Controller */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Verifikasi Menunggu */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
            <div className="flex justify-between items-center mb-4 select-none">
              <h2 className="text-sm font-bold text-slate-850">
                Verifikasi Menunggu ({pendingVerifications.length})
              </h2>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-4">
              {pendingVerifications.length > 0 ? (
                pendingVerifications.map((item) => (
                  <div
                    key={item.id}
                    className="border border-slate-100 rounded-2xl p-4 bg-slate-50/10 flex flex-col gap-3.5"
                  >
                    {/* Header Row */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">
                          {item.citizenName}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          {item.blok} • {item.iuranName}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#0047cc]">
                        {item.amount}
                      </span>
                    </div>

                    {/* Receipt Image Mock */}
                    {item.imageUrl ? (
                      <div
                        onClick={() =>
                          setReceiptPreviewUrl(item.imageUrl || null)
                        }
                        className="w-full h-28 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shadow-inner cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={item.imageUrl}
                          alt="Bukti Transfer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-100 rounded-xl py-4.5 px-3 flex flex-col items-center justify-center gap-1.5 text-slate-400 select-none">
                        <FileText className="w-6 h-6 text-slate-350" />
                        <span className="text-[10px] font-semibold">
                          Resi Digital
                        </span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 select-none">
                      {item.imageUrl ? (
                        <>
                          <button
                            onClick={() => handleDecline(item)}
                            className="flex-1 bg-rose-50 hover:bg-rose-100/80 text-rose-600 rounded-xl py-2 text-[10px] font-bold transition-all cursor-pointer text-center"
                          >
                            Tolak
                          </button>
                          <button
                            onClick={() => handleVerify(item)}
                            className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl py-2 text-[10px] font-bold transition-all cursor-pointer text-center"
                          >
                            Verifikasi
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setReceiptPreviewUrl('fallback')}
                            className="flex-1 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-650 font-bold rounded-xl py-2 text-[10px] cursor-pointer text-center"
                          >
                            Detail Bukti
                          </button>
                          <button
                            onClick={() => handleVerify(item)}
                            className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl py-2 text-[10px] font-bold transition-all cursor-pointer text-center"
                          >
                            Verifikasi
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-50/20 border border-slate-100/50 rounded-2xl p-6 text-center select-none">
                  <Info className="w-8 h-8 text-slate-350 mx-auto mb-2" />
                  <h4 className="text-xs font-bold text-slate-700">
                    Semua Berhasil Diverifikasi
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Tidak ada verifikasi tagihan baru.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card: Kelola Masa Aktif */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
            <div className="flex items-center gap-2 mb-4 select-none">
              <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100/40">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-800">
                Kelola Masa Aktif
              </h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Nonaktifkan tagihan lama atau yang sudah tidak berlaku lagi.
            </p>

            <div className="space-y-4">
              <Select
                label="Pilih Iuran"
                value={deactivateId}
                onChange={(e) => setDeactivateId(e.target.value)}
                options={[
                  { value: '', label: 'Pilih iuran untuk Dinonaktifkan' },
                  ...iuranList
                    .filter((i) => i.status === 'AKTIF')
                    .map((item) => ({
                      value: item.id,
                      label: `${item.title} (${item.amount})`,
                    })),
                ]}
              />

              <button
                onClick={handleDeactivate}
                className="w-full bg-red-650 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl py-3 text-xs transition-all shadow-sm cursor-pointer text-center"
              >
                Nonaktifkan Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: View Receipt Detail Mockup */}
      <Modal
        isOpen={receiptPreviewUrl !== null}
        onClose={() => setReceiptPreviewUrl(null)}
        title="Resi Bukti Transfer"
        maxWidthClass="max-w-sm"
      >
        {receiptPreviewUrl && (
          <>
            <div className="space-y-4">
              {receiptPreviewUrl === 'fallback' ? (
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 text-slate-500 text-center select-none shadow-inner">
                  <FileText className="w-10 h-10 text-slate-350" />
                  <span className="text-xs font-bold text-slate-800">
                    E-Receipt Digital Statement
                  </span>
                  <span className="text-[10px] text-slate-450 leading-relaxed font-semibold">
                    Pembayaran telah divalidasi via mutasi rekening RT
                    e-banking.
                    <br />
                    ID Rujukan: Bank-MUT-RT05-9082A
                  </span>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner max-h-[300px]">
                  <img
                    src={receiptPreviewUrl}
                    alt="Receipt Bukti"
                    className="w-full object-cover max-h-[300px]"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setReceiptPreviewUrl(null)}
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
