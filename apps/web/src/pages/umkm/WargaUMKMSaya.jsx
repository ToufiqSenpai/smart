import { useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"

var myUmkmData = [
  { id: 1, namaUsaha: "Warung Makan Sari", jenis: "Kuliner", deskripsi: "Warung makan dengan menu nasi dan lauk pauk khas Indonesia.", alamat: "Jl. Mawar No. 12", kontak: "081234567890", status: "verified" },
  { id: 2, namaUsaha: "Laundry Bersih", jenis: "Jasa", deskripsi: "Menerima cuci kiloan dan setrika.", alamat: "Jl. Melati No. 5", kontak: "081234567891", status: "pending" },
]

var statusClass = {
  verified: "bg-success-bg text-success border border-success/10",
  pending: "bg-warning-bg text-warning border border-warning/10",
  rejected: "bg-error-bg text-error border border-error/10",
}
var statusLabel = { verified: "Terverifikasi", pending: "Menunggu", rejected: "Ditolak" }

export default function WargaUMKMSaya() {
  var navigate = useNavigate()
  var [search, setSearch] = useState("")
  var [filter, setFilter] = useState("all")

  var filtered = myUmkmData.filter(function(u) {
    var matchSearch = u.namaUsaha.toLowerCase().includes(search.toLowerCase())
    var matchFilter = filter === "all" || u.status === filter
    return matchSearch && matchFilter
  })

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Manajemen UMKM</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">UMKM Saya</h1>
        <p className="text-[14.5px] text-text-muted">Kelola data usaha Anda. Setelah diunggah, UMKM akan diverifikasi oleh Pengurus RT.</p>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-[20px] p-4 px-6 flex items-center justify-between gap-4 flex-wrap mb-8 shadow-lux">
        <div className="flex items-center gap-4 flex-wrap flex-1">
          <div className="flex-1 min-w-[200px] relative">
            <svg className="icon absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            <input type="text" placeholder="Cari nama usaha..." className="w-full py-2 pl-[38px] pr-3 font-sans text-[13.5px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] transition-all focus:border-primary focus:ring-3 focus:ring-primary-light" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="statusFilter" className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.05em]">Status</label>
            <select id="statusFilter" className="py-1.5 pl-[14px] pr-8 font-sans text-[13px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] appearance-none cursor-pointer transition-all focus:border-primary focus:ring-3 focus:ring-primary-light" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717A' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
              <option value="all">Semua</option>
              <option value="verified">Terverifikasi</option>
              <option value="pending">Menunggu</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
          <span className="text-[12px] font-semibold text-text-muted bg-bg px-[14px] py-1 rounded-full border border-border-subtle whitespace-nowrap">{filtered.length} UMKM</span>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2 font-sans text-[13px] font-semibold bg-primary text-white border-none rounded-full cursor-pointer min-h-[38px] whitespace-nowrap transition-all hover:bg-[#163b6a] hover:shadow-[0_4px_12px_rgba(30,75,133,0.25)] hover:-translate-y-px" onClick={() => navigate("/tambah-umkm")}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Tambah UMKM
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
        {filtered.map(function(u) {
          return (
            <div key={u.id} className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden hover:shadow-lg transition-all">
              <div className="h-36 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                <svg className="w-12 h-12 text-primary/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21h16" /><path d="M6 21V8.5a3.5 3.5 0 0 1 7 0V21" /><path d="M18 21v-6a4 4 0 0 0-4-4h-2" /><path d="M10 11h2" /></svg>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-grotesk text-[17px] font-bold text-text-primary leading-tight">{u.namaUsaha}</h3>
                  <span className={"inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 " + statusClass[u.status]}>{statusLabel[u.status]}</span>
                </div>
                <p className="text-[13px] text-text-muted mb-1">{u.jenis}</p>
                <p className="text-[13px] text-text-secondary line-clamp-2 leading-relaxed mb-3">{u.deskripsi}</p>
                <div className="flex items-center gap-2 text-[12px] text-text-muted">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  <span className="truncate">{u.alamat}</span>
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 px-6 text-text-muted bg-bg-card rounded-[20px] border border-border-subtle">
            <svg className="w-14 h-14 text-border-subtle mb-4 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21h16" /><path d="M6 21V8.5a3.5 3.5 0 0 1 7 0V21" /><path d="M18 21v-6a4 4 0 0 0-4-4h-2" /><path d="M10 11h2" /></svg>
            <h3 className="font-grotesk text-[20px] font-bold text-text-primary mb-2">Tidak ada UMKM</h3>
            <p className="text-[14px] text-text-muted">Belum ada UMKM yang sesuai dengan pencarian Anda.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}