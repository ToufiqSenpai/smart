import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { getCurrentBills, submitPayment } from "../../api/dues.api"

export default function WargaPembayaranIuran() {
  const navigate = useNavigate()
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [metodeBayar, setMetodeBayar] = useState('')
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getCurrentBills()
      .then(res => setBills(res.data.filter(b => b.status !== 'VERIFIED')))
      .catch(err => console.error('Gagal memuat tagihan:', err))
      .finally(() => setLoading(false))
  }, [])

  var handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedId || !metodeBayar) return
    setSubmitting(true)
    try {
      await submitPayment({
        id_iuran: selectedId,
        periode: new Date().toISOString().slice(0, 7),
        metode_bayar: metodeBayar,
        jumlah_bayar: bills.find(b => b.id_iuran === selectedId)?.nominal || 0,
        bukti_pembayaran: file ? file.name : '',
      })
      alert('Pembayaran berhasil dikirim!')
      navigate('/dashboard')
    } catch (err) {
      alert('Gagal: ' + (err?.message || 'Terjadi kesalahan'))
    } finally {
      setSubmitting(false)
    }
  }

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
  }

  if (loading) {
    return <DashboardLayout><div className="text-center py-16 text-text-muted">Memuat tagihan...</div></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="max-w-[820px]">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Pembayaran Iuran</p>
          <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Kirim Pembayaran</h1>
          <p className="text-[14.5px] text-text-muted">Pilih iuran yang ingin dibayar dan upload bukti transfer.</p>
        </div>

        <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-10 px-12">
          <div className="mb-8 pb-6 border-b border-border-subtle">
            <h2 className="font-grotesk text-[22px] font-bold text-text-primary tracking-tight">Pilih Tagihan</h2>
            <p className="text-[14px] text-text-muted mt-1">Pilih salah satu iuran yang belum dibayar di bawah ini.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-8">
              {bills.length === 0 ? (
                <p className="text-center py-8 text-text-muted">Tidak ada tagihan yang belum dibayar.</p>
              ) : bills.map(b => (
                <div
                  key={b.id_iuran}
                  className={`flex items-center justify-between p-4 px-5 border rounded-[12px] mb-3 cursor-pointer transition-all ${selectedId === b.id_iuran ? 'border-primary bg-primary-light' : 'border-border-subtle bg-bg-card hover:border-border-hover'}`}
                  onClick={() => setSelectedId(b.id_iuran)}
                >
                  <div className="flex flex-col gap-1">
                    <div className="font-semibold text-text-primary text-[14px]">{b.nama_iuran}</div>
                    <div className="text-[12.5px] text-text-secondary flex items-center gap-3">
                      <span>{b.jenis_iuran}</span>
                      <span>•</span>
                      <span className="font-mono">{b.periode}</span>
                      <span>•</span>
                      <span className="font-mono">Jatuh tempo: {b.tanggal_jatuh_tempo}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-12)" }}>
                    <span className="font-mono text-[16px] font-semibold text-text-primary">{formatRupiah(b.nominal)}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedId === b.id_iuran ? 'border-primary bg-primary' : 'border-border-subtle'}`}>
                      {selectedId === b.id_iuran && <span className="w-2 h-2 rounded-full bg-white block" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <label htmlFor="metodeBayar" className="block text-[13px] font-semibold text-text-primary mb-1">Metode Pembayaran</label>
              <select className="w-full px-[14px] py-[10px] font-sans text-[14px] text-text-primary bg-bg-card border border-border-subtle rounded-[12px] outline-none h-11 transition-all focus:border-primary" id="metodeBayar" value={metodeBayar} onChange={(e) => setMetodeBayar(e.target.value)} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717A' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}>
                <option value="">-- Pilih Metode --</option>
                <option value="Transfer Bank">Transfer Bank</option>
                <option value="Tunai">Tunai</option>
                <option value="QRIS">QRIS</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-[13px] font-semibold text-text-primary mb-1">Upload Bukti Pembayaran</label>
              <div className="border-[1.5px] border-dashed border-border-subtle rounded-[12px] p-8 text-center cursor-pointer transition-all hover:border-primary hover:bg-primary-light relative">
                <svg className="w-10 h-10 text-text-muted mb-3 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                <p className="text-[14px] text-text-muted">{file ? file.name : 'Klik untuk upload bukti pembayaran'}</p>
                <span className="text-[12px] text-text-secondary">Format JPG/PNG/PDF, max 2MB</span>
                <input type="file" accept="image/*,application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-border-subtle">
              <button type="submit" className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-[14px] font-semibold border-none rounded-full cursor-pointer min-h-11 transition-all bg-primary text-white" disabled={submitting || !selectedId || !metodeBayar}>
                {submitting ? 'Mengirim...' : 'Kirim Pembayaran'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
