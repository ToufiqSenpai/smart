import { useState, useEffect } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import Modal from "../../components/ui/Modal"
import Button from "../../components/ui/Button"
import AlertModal from "../../components/ui/AlertModal"
import { getCurrentBills, submitPayment } from "../../api/dues.api"

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
}

export default function WargaPembayaranIuran() {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalPay, setModalPay] = useState(null)
  const [metodeBayar, setMetodeBayar] = useState('')
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    getCurrentBills()
      .then(res => setBills(res.data.filter(b => b.status !== 'VERIFIED')))
      .catch(err => console.error('Gagal memuat tagihan:', err))
      .finally(() => setLoading(false))
  }, [])

  function openPayModal(bill) {
    setModalPay(bill)
    setMetodeBayar('')
    setFile(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!metodeBayar) return
    setSubmitting(true)
    try {
      await submitPayment({
        id_iuran: modalPay.id_iuran,
        periode: new Date().toISOString().slice(0, 7),
        metode_bayar: metodeBayar,
        jumlah_bayar: modalPay.nominal,
        bukti_pembayaran: file ? file.name : '',
      })
      setBills(prev => prev.filter(b => b.id_iuran !== modalPay.id_iuran))
      setAlert({ type: 'success', title: 'Berhasil', message: 'Pembayaran berhasil dikirim', onClose: () => { setModalPay(null) } })
    } catch (err) {
      setAlert({ type: 'error', title: 'Gagal', message: err?.response?.data?.message || err?.message || 'Terjadi kesalahan' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-[820px]">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Pembayaran Iuran</p>
          <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Tagihan Saya</h1>
          <p className="text-[14.5px] text-text-muted">Pilih iuran yang ingin dibayar.</p>
        </div>

        <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
          <div className="px-6 py-5 border-b border-border-subtle">
            <h3 className="font-grotesk text-base font-bold text-text-primary">Daftar Tagihan</h3>
          </div>
          <div className="px-6 pb-6">
            {loading ? (
              <div className="text-center py-12 text-text-muted text-[13.5px]">Memuat tagihan...</div>
            ) : bills.length === 0 ? (
              <div className="text-center py-12 text-text-muted text-[13.5px]">Tidak ada tagihan yang belum dibayar.</div>
            ) : (
              <div className="divide-y divide-border-subtle">
                {bills.map(b => (
                  <div key={b.id_iuran} className="flex items-center justify-between py-4 gap-4">
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="font-semibold text-text-primary text-[14px]">{b.nama_iuran}</div>
                      <div className="text-[12.5px] text-text-secondary flex items-center gap-3 flex-wrap">
                        <span>{b.jenis_iuran}</span>
                        <span>•</span>
                        <span className="font-mono">{b.periode}</span>
                        <span>•</span>
                        <span className="font-mono">Jatuh tempo: {b.tanggal_jatuh_tempo}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-mono text-[15px] font-semibold text-text-primary">{formatRupiah(b.nominal)}</span>
                      <Button size="sm" onClick={() => openPayModal(b)}>Bayar</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={!!modalPay}
        onClose={() => setModalPay(null)}
        title="Kirim Pembayaran"
        subtitle={modalPay ? `${modalPay.nama_iuran} - ${formatRupiah(modalPay.nominal)}` : ''}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalPay(null)}>Batal</Button>
            <Button onClick={handleSubmit} disabled={submitting || !metodeBayar}>{submitting ? 'Mengirim...' : 'Kirim Pembayaran'}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-[13px] font-semibold text-text-primary mb-1">Metode Pembayaran</label>
            <select className="w-full px-[14px] py-[10px] font-sans text-[14px] text-text-primary bg-white border border-border-subtle rounded-[12px] outline-none h-11 transition-all focus:border-primary" value={metodeBayar} onChange={(e) => setMetodeBayar(e.target.value)}>
              <option value="">-- Pilih Metode --</option>
              <option value="Transfer Bank">Transfer Bank</option>
              <option value="Tunai">Tunai</option>
              <option value="QRIS">QRIS</option>
            </select>
          </div>
          <div className="mb-5">
            <label className="block text-[13px] font-semibold text-text-primary mb-1">Upload Bukti Pembayaran</label>
            <div className="border-[1.5px] border-dashed border-border-subtle rounded-[12px] p-6 text-center cursor-pointer transition-all hover:border-primary hover:bg-primary-light relative">
              <svg className="w-8 h-8 text-text-muted mb-2 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
              <p className="text-[13px] text-text-muted">{file ? file.name : 'Klik untuk upload bukti pembayaran'}</p>
              <span className="text-[11px] text-text-secondary">Format JPG/PNG/PDF, max 2MB</span>
              <input type="file" accept="image/*,application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
            </div>
          </div>
        </form>
      </Modal>

      <AlertModal open={!!alert} onClose={() => { const cb = alert?.onClose; setAlert(null); cb?.() }} type={alert?.type} title={alert?.title} message={alert?.message} />
    </DashboardLayout>
  )
}
