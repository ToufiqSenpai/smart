import { useState } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"

export default function KetuaDetailVerifikasi() {
  const [paymentData, setPaymentData] = useState({
    id: 2,
    warga: 'Ani Wijaya',
    iuran: 'Iuran Keamanan',
    periode: 'Juli 2026',
    nominal: 30000,
    metode: 'Tunai',
    tanggal: '2026-07-13',
    status: 'menunggu',
    bukti: null,
    noTransaksi: 'TRX/RT08/VII/2026/002'
  })

  function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(angka)
  }

  function formatDate(dateStr) {
    var parts = dateStr.split('-')
    var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    return parseInt(parts[2]) + ' ' + months[parseInt(parts[1]) - 1] + ' ' + parts[0]
  }

  var statusInfo = {
    menunggu: { badgeClass: 'menunggu', label: 'Menunggu', info: 'Menunggu verifikasi' },
    terverifikasi: { badgeClass: 'terverifikasi', label: 'Terverifikasi', info: 'Pembayaran terverifikasi' },
    ditolak: { badgeClass: 'ditolak', label: 'Ditolak', info: 'Pembayaran ditolak' }
  }

  var currentStatus = statusInfo[paymentData.status] || statusInfo.menunggu

  function getStatusClass(s) {
    var base = "inline-flex items-center gap-1.5 px-[14px] py-1 rounded-full text-[11px] font-bold border"
    var map = { menunggu: "bg-warning-bg text-warning border-warning/10", terverifikasi: "bg-success-bg text-success border-success/10", ditolak: "bg-error-bg text-error border-error/10" }
    return base + " " + (map[s] || map.menunggu)
  }

  function handleVerifikasi() {
    setPaymentData(prev => ({ ...prev, status: 'terverifikasi' }))
  }

  function handleTolak() {
    setPaymentData(prev => ({ ...prev, status: 'ditolak' }))
  }

  return (
    <DashboardLayout>
      <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" onClick={() => window.history.back()}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali ke verifikasi pembayaran
      </button>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="p-8 border-b border-border-subtle flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className={getStatusClass(currentStatus.badgeClass)}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 14" /></svg>
              {currentStatus.label}
            </span>
            <h2 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight">Pembayaran {paymentData.iuran}</h2>
            <div className="flex flex-wrap gap-2 gap-x-6 mt-2 text-[13px] text-text-secondary">
              <span>No. Transaksi: <span className="font-mono text-xs">{paymentData.noTransaksi}</span></span>
              <span>•</span>
              <span>Dibayar: <span className="font-mono text-xs">{formatDate(paymentData.tanggal)}</span></span>
              <span>•</span>
              <span>Oleh: <span>{paymentData.warga}</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{fontSize: "12px", color: "var(--ink-subtle)"}}>{currentStatus.info}</span>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-border-subtle">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Nama Warga</div>
              <div className="text-[15px] font-semibold text-text-primary">{paymentData.warga}</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Iuran</div>
              <div className="text-[15px] font-semibold text-text-primary">{paymentData.iuran}</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Periode</div>
              <div className="text-[15px] font-semibold text-text-primary font-mono text-sm">{paymentData.periode}</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Nominal</div>
              <div className="text-[15px] font-semibold text-text-primary font-mono text-sm">{formatRupiah(paymentData.nominal)}</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Metode Bayar</div>
              <div className="text-[15px] font-semibold text-text-primary">{paymentData.metode}</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">Tanggal Bayar</div>
              <div className="text-[15px] font-semibold text-text-primary font-mono text-sm">{formatDate(paymentData.tanggal)}</div>
            </div>
          </div>

          <div className="mb-8">
            <span className="text-[13px] font-semibold text-text-primary mb-3 block">📎 Bukti Pembayaran</span>
            <div className="rounded-[14px] overflow-hidden border border-border-subtle bg-bg w-full max-h-[500px] flex items-center justify-center">
              <div className="py-12 px-6 text-center text-text-muted text-sm flex flex-col items-center gap-3">
                <svg className="w-12 h-12 text-border-subtle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                <span>Tidak ada bukti pembayaran</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border-subtle flex gap-3 flex-wrap">
            <button className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-bg-hover text-text-secondary border border-border-subtle" onClick={() => window.history.back()}>Kembali</button>
            {paymentData.status === 'menunggu' && (
              <>
                <button className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-error text-white" onClick={handleTolak}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
                  Tolak Pembayaran
                </button>
                <button className="inline-flex items-center justify-center gap-2 px-7 py-[10px] font-sans text-sm font-semibold border-none rounded-full cursor-pointer min-h-[44px] transition-all bg-success text-white" onClick={handleVerifikasi}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /></svg>
                  Verifikasi Pembayaran
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
