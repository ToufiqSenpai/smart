import { useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"

var umkmData = [
  { id: 1, namaUsaha: "Warung Makan Sari", jenis: "Kuliner", pemilik: "Budi Santoso", alamat: "Jl. Mawar No. 12", kontak: "081234567890" },
  { id: 2, namaUsaha: "Laundry Bersih", jenis: "Jasa", pemilik: "Ani Wijaya", alamat: "Jl. Melati No. 5", kontak: "081234567891" },
  { id: 3, namaUsaha: "Toko Sembako Makmur", jenis: "Perdagangan", pemilik: "Siti Rahayu", alamat: "Jl. Kenanga No. 3", kontak: "081234567892" },
  { id: 4, namaUsaha: "Bengkel Jaya", jenis: "Otomotif", pemilik: "Agus Saputra", alamat: "Jl. Anggrek No. 7", kontak: "081234567893" },
  { id: 5, namaUsaha: "Katering Nikmat", jenis: "Kuliner", pemilik: "Fitriana", alamat: "Jl. Flamboyan No. 2", kontak: "081234567894" },
]

export default function WargaLihatUMKM() {
  var navigate = useNavigate()
  var [search, setSearch] = useState("")
  var [jenisFilter, setJenisFilter] = useState("all")

  var filtered = umkmData.filter(function(u) {
    var matchSearch = u.namaUsaha.toLowerCase().includes(search.toLowerCase()) || u.jenis.toLowerCase().includes(search.toLowerCase())
    var matchJenis = jenisFilter === "all" || u.jenis === jenisFilter
    return matchSearch && matchJenis
  })

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Layanan UMKM</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Daftar UMKM RT 08</h1>
        <p className="text-[14.5px] text-text-muted">Temukan dan jelajahi usaha warga sekitar yang telah terverifikasi.</p>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-[20px] p-4 px-6 flex items-center gap-4 flex-wrap mb-8 shadow-lux">
        <div className="flex-1 min-w-[200px] relative" style={{ flex: 1 }}>
          <svg className="icon absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
          <input type="text" placeholder="Cari nama usaha atau jenis..." className="w-full py-2 pl-[38px] pr-3 font-sans text-[13.5px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] transition-all focus:border-primary focus:ring-3 focus:ring-primary-light" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="jenisFilter" className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.05em]">Jenis</label>
          <select id="jenisFilter" className="py-1.5 pl-[14px] pr-8 font-sans text-[13px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] appearance-none cursor-pointer transition-all focus:border-primary focus:ring-3 focus:ring-primary-light" value={jenisFilter} onChange={(e) => setJenisFilter(e.target.value)} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717A' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
            <option value="all">Semua</option>
            <option value="Kuliner">Kuliner</option>
            <option value="Fashion">Fashion</option>
            <option value="Kerajinan">Kerajinan</option>
            <option value="Jasa">Jasa</option>
            <option value="Perdagangan">Perdagangan</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
        <span className="text-[12px] font-semibold text-text-muted bg-bg px-[14px] py-1 rounded-full border border-border-subtle whitespace-nowrap">{filtered.length} UMKM</span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
        {filtered.map(function(u) {
          return (
            <div
              key={u.id}
              className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
              onClick={() => navigate("/detail-umkm/" + u.id)}
            >
              <div className="h-32 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                <svg className="w-12 h-12 text-primary/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21h16" /><path d="M6 21V8.5a3.5 3.5 0 0 1 7 0V21" /><path d="M18 21v-6a4 4 0 0 0-4-4h-2" /><path d="M10 11h2" /></svg>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-grotesk text-[17px] font-bold text-text-primary leading-tight">{u.namaUsaha}</h3>
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 bg-success-bg text-success border border-success/10">Terverifikasi</span>
                </div>
                <p className="text-[13px] text-text-muted mb-2">{u.jenis}</p>
                <div className="flex items-center gap-2 text-[12px] text-text-muted">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  <span>{u.pemilik}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-text-muted mt-1">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  <span className="truncate">{u.alamat}</span>
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 px-6 text-text-muted bg-bg-card rounded-[20px] border border-border-subtle">
            <svg className="w-14 h-14 text-border-subtle mb-4 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21h16" /><path d="M6 21V8.5a3.5 3.5 0 0 1 7 0V21" /><path d="M18 21v-6a4 4 0 0 0-4-4h-2" /><path d="M10 11h2" /></svg>
            <h3 className="font-grotesk text-[20px] font-bold text-text-primary mb-2">Hasil tidak ditemukan</h3>
            <p className="text-[14px] text-text-muted">Tidak ada UMKM yang sesuai dengan pencarian Anda.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}