import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  CheckCircle2,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export const Route = createFileRoute('/_dashboard/contributions/pengeluaran')({
  component: PengeluaranPage,
})

interface Expense {
  id: string
  name: string
  date: string
  amount: string
  remainingBalance: string
}

const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'e1',
    name: 'Perayaan HUT RI',
    date: 'Senin, 10 Agustus 2026',
    amount: 'Rp 2.000.000',
    remainingBalance: 'Rp 7.400.000',
  },
  {
    id: 'e2',
    name: 'Petugas Kebersihan',
    date: 'Senin, 1 Juli 2026',
    amount: 'Rp 100.000',
    remainingBalance: 'Rp 9.400.000',
  },
]

function PengeluaranPage() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('board_expenses')
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES
  })

  // Start remaining balance tracking (initialized to Rp 7.400.000 if no extra items exist)
  const [balance, setBalance] = useState(() => {
    if (expenses.length > 0) {
      const lastRemaining = expenses[0].remainingBalance.replace(/[^0-9]/g, '')
      return parseInt(lastRemaining, 10) || 7400000
    }
    return 7400000
  })

  // Form states
  const [name, setName] = useState('')
  const [tenggat, setTenggat] = useState('')
  const [nominal, setNominal] = useState('')

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('board_expenses', JSON.stringify(expenses))
    if (expenses.length > 0) {
      const lastRemaining = expenses[0].remainingBalance.replace(/[^0-9]/g, '')
      setBalance(parseInt(lastRemaining, 10) || 7400000)
    }
  }, [expenses])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Silakan isi nama pengeluaran.')
      return
    }
    if (!tenggat) {
      alert('Silakan isi tanggal tenggat pengeluaran.')
      return
    }
    if (!nominal.trim()) {
      alert('Silakan isi nominal pengeluaran.')
      return
    }

    // Parse nominal
    const cleanNominalStr = nominal.replace(/[^0-9]/g, '')
    const amountVal = parseInt(cleanNominalStr, 10)
    if (isNaN(amountVal) || amountVal <= 0) {
      alert('Nominal pengeluaran harus berupa angka positif.')
      return
    }

    // Format date in Indonesian: e.g. "Senin, 10 Agustus 2026"
    const parsedDate = new Date(tenggat)
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
    const formattedDate = parsedDate.toLocaleDateString('id-ID', options)

    // Calculate new remaining cash balance
    const newBalance = balance - amountVal
    const formattedBalance = `Rp ${newBalance.toLocaleString('id-ID')}`
    const formattedAmount = `Rp ${amountVal.toLocaleString('id-ID')}`

    const newExpense: Expense = {
      id: Date.now().toString(),
      name: name.trim(),
      date: formattedDate,
      amount: formattedAmount,
      remainingBalance: formattedBalance,
    }

    setExpenses([newExpense, ...expenses])

    // Reset Form
    setName('')
    setTenggat('')
    setNominal('')

    setToastMessage(`Pengeluaran "${newExpense.name}" berhasil dicatat!`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  return (
    <div className="max-w-6xl mx-auto p-1 animate-[fadeIn_0.3s_ease-out] relative">
      {/* Toast Alert */}
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
          Pengeluaran
        </h1>
      </div>

      {/* Main Layout stack */}
      <div className="space-y-6">
        {/* Card 1: Form Tambah Pengeluaran */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-100 select-none">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#0047cc]" />
              Tambah Pengeluaran
            </h2>
            <div className="flex gap-2.5">
              <button
                type="button"
                className="bg-white border border-slate-200 hover:border-slate-300 text-slate-650 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer"
              >
                Edit iuran
              </button>
              <button
                type="button"
                className="bg-[#0047cc] hover:bg-[#003bb3] text-white rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer shadow-sm shadow-[#0047cc]/10"
              >
                Tambah iuran
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                Nama Pengeluaran
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh : Iuran HUT RI Ke-81"
                className="w-full bg-slate-50 hover:bg-slate-100/30 border border-slate-200/80 text-slate-700 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                Tenggat
              </label>
              <input
                type="date"
                value={tenggat}
                onChange={(e) => setTenggat(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/30 border border-slate-200/80 text-slate-700 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                Nominal
              </label>
              <input
                type="text"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                placeholder="Contoh : 100.000"
                className="w-full bg-slate-50 hover:bg-slate-100/30 border border-slate-200/80 text-slate-700 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0047cc] hover:bg-[#003bb3] text-white font-bold rounded-xl py-3 mt-4 text-xs transition-all shadow-md shadow-[#0047cc]/15 cursor-pointer text-center"
            >
              Tambah Pengeluaran
            </button>
          </form>
        </div>

        {/* Card 2: Table List of Expenses */}
        <div className="bg-white rounded-3xl border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/20 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="text-left px-6 py-4 border-b border-slate-100">
                    Nama Pengeluaran
                  </th>
                  <th className="text-left px-6 py-4 border-b border-slate-100">
                    Tanggal
                  </th>
                  <th className="text-right px-6 py-4 border-b border-slate-100">
                    Nominal
                  </th>
                  <th className="text-right px-6 py-4 border-b border-slate-100">
                    Status Iuran
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100/60 hover:bg-slate-50/10 transition-colors"
                  >
                    <td className="px-6 py-5 text-xs font-bold text-slate-800">
                      {item.name}
                    </td>
                    <td className="px-6 py-5 text-xs font-semibold text-slate-500">
                      {item.date}
                    </td>
                    <td className="px-6 py-5 text-xs text-right font-bold text-slate-800">
                      {item.amount}
                    </td>
                    <td className="px-6 py-5 text-xs text-right font-bold text-slate-850">
                      {item.remainingBalance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Mockup */}
          <div className="px-6 py-4 flex justify-between items-center border-t border-slate-100 bg-slate-50/10 text-xs">
            <span className="text-slate-400 font-semibold select-none">
              Menampilkan 1 - {expenses.length} dari {expenses.length} transaksi
            </span>
            <div className="flex items-center gap-1.5 select-none">
              <button
                disabled
                className="p-1.5 border border-slate-100 text-slate-300 rounded-lg bg-slate-50/10 cursor-not-allowed"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
              <button className="w-7 h-7 flex items-center justify-center bg-[#0047cc] text-white rounded-lg font-bold text-xs">
                1
              </button>
              <button className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-lg font-bold text-xs transition-colors cursor-pointer">
                2
              </button>
              <button className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-lg font-bold text-xs transition-colors cursor-pointer">
                3
              </button>
              <span className="text-slate-400 font-bold px-1.5">...</span>
              <button className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-lg font-bold text-xs transition-colors cursor-pointer">
                12
              </button>
              <button className="p-1.5 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
