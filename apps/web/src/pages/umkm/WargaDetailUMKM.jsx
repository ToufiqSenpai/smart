import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { getBusinessById } from "../../api/businesses.api"

const statusMap = {
  VERIFIED: { cls: "bg-success-bg text-success border-success/10", label: "Terverifikasi", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /></svg> },
  PENDING: { cls: "bg-warning-bg text-warning border-warning/10", label: "Menunggu", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 14" /></svg> },
  REJECTED: { cls: "bg-error-bg text-error border-error/10", label: "Ditolak", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg> },
}

export default function WargaDetailUMKM() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBusinessById(id)
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <DashboardLayout><div className="text-center py-16 text-text-muted">Memuat data...</div></DashboardLayout>
  }

  if (!data) {
    return <DashboardLayout><div className="text-center py-16 text-text-muted">UMKM tidak ditemukan.</div></DashboardLayout>
  }

  const s = statusMap[data.status_verifikasi] || statusMap.PENDING

  return (
    <DashboardLayout>
      <div className="max-w-[1100px]">
        <button className="inline-flex items-center gap-2 text-text-secondary text-[13px] font-medium mb-6 hover:text-primary transition-colors cursor-pointer border-none bg-transparent font-sans" onClick={() => navigate("/lihat-umkm")}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Kembali ke daftar UMKM
        </button>

        <div className="grid grid-cols-2 gap-8 mb-10 max-lg:grid-cols-1">
          <div className="bg-bg-card rounded-[20px] border border-border-subtle overflow-hidden flex items-center justify-center min-h-[320px] relative shadow-lux">
            {data.foto_usaha ? (
              <img src={data.foto_usaha} alt={data.nama_usaha} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-text-muted">
                <svg className="w-14 h-14 text-border-subtle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21h16" /><path d="M6 21V8.5a3.5 3.5 0 0 1 7 0V21" /><path d="M18 21v-6a4 4 0 0 0-4-4h-2" /><path d="M10 11h2" /></svg>
                <span>Tidak ada foto</span>
              </div>
            )}
            <div className={`absolute top-4 right-4 inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full border ${s.cls}`}>
              {s.icon}
              {s.label}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Detail UMKM</p>
            <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">{data.nama_usaha}</h1>
            <p className="text-base text-text-secondary mb-4">{data.jenis_usaha}</p>

            <div className="flex flex-wrap gap-3 gap-x-6 mb-6">
              <span className="flex items-center gap-2 text-[13px] text-text-secondary">
                <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>{data.alamat_usaha}</span>
              </span>
              <span className="flex items-center gap-2 text-[13px] text-text-secondary">
                <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                <span className="font-mono text-[13px]">{data.kontak_usaha}</span>
              </span>
              <span className="flex items-center gap-2 text-[13px] text-text-secondary">
                <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <span>Pemilik: {data.pemilik}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[2fr_1fr] gap-8 max-lg:grid-cols-1">
          <div className="bg-bg-card rounded-[20px] border border-border-subtle p-8 shadow-lux">
            <h3 className="font-grotesk text-base font-bold text-text-primary mb-4 tracking-tight">Deskripsi Usaha</h3>
            <p className="text-[14.5px] text-text-secondary leading-relaxed">{data.deskripsi_usaha}</p>
          </div>

          <div className="bg-bg-card rounded-[20px] border border-border-subtle p-8 shadow-lux flex flex-col gap-4">
            <h3 className="font-grotesk text-base font-bold text-text-primary tracking-tight" style={{ marginBottom: 0 }}>Informasi Lengkap</h3>
            <div className="flex justify-between items-center pb-3 border-b border-border-subtle text-[13.5px]">
              <span className="text-text-muted font-medium">Nama Usaha</span>
              <span className="text-text-primary font-semibold text-right">{data.nama_usaha}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border-subtle text-[13.5px]">
              <span className="text-text-muted font-medium">Jenis</span>
              <span className="text-text-primary font-semibold text-right">{data.jenis_usaha}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border-subtle text-[13.5px]">
              <span className="text-text-muted font-medium">Alamat</span>
              <span className="text-text-primary font-semibold text-right">{data.alamat_usaha}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border-subtle text-[13.5px]">
              <span className="text-text-muted font-medium">Kontak</span>
              <span className="text-text-primary font-semibold text-right font-mono text-[13px]">{data.kontak_usaha}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border-subtle text-[13.5px]">
              <span className="text-text-muted font-medium">Status</span>
              <span className="text-text-primary font-semibold text-right">
                <span className={`inline-flex items-center gap-1.5 px-[14px] py-1 rounded-full text-[11px] font-bold border ${s.cls}`}>
                  {s.icon}
                  {s.label}
                </span>
              </span>
            </div>
            <div className="flex justify-between items-center text-[13.5px]" style={{ borderBottom: "none", paddingBottom: 0 }}>
              <span className="text-text-muted font-medium">Pemilik</span>
              <span className="text-text-primary font-semibold text-right">{data.pemilik}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
