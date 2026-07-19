import { useState } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"

var verifikasiData = [
  { id: 1, nik: '3275010101010013', nama: 'Rudi Hartono', alamat: 'Jl. Flamboyan No. 1', noHp: '081234567802', tglDaftar: '2026-07-01', status: 'menunggu' },
  { id: 2, nik: '3275010101010014', nama: 'Mega Sari', alamat: 'Jl. Flamboyan No. 2', noHp: '081234567803', tglDaftar: '2026-07-02', status: 'menunggu' },
  { id: 3, nik: '3275010101010015', nama: 'Adi Nugroho', alamat: 'Jl. Flamboyan No. 3', noHp: '081234567804', tglDaftar: '2026-07-03', status: 'menunggu' },
  { id: 4, nik: '3275010101010016', nama: 'Lia Amalia', alamat: 'Jl. Dahlia No. 1', noHp: '081234567805', tglDaftar: '2026-07-05', status: 'menunggu' },
  { id: 5, nik: '3275010101010017', nama: 'Bayu Aji', alamat: 'Jl. Dahlia No. 2', noHp: '081234567806', tglDaftar: '2026-07-06', status: 'menunggu' },
  { id: 6, nik: '3275010101010018', nama: 'Citra Dewi', alamat: 'Jl. Dahlia No. 3', noHp: '081234567807', tglDaftar: '2026-07-07', status: 'menunggu' },
  { id: 7, nik: '3275010101010019', nama: 'Deni Kurniawan', alamat: 'Jl. Teratai No. 1', noHp: '081234567808', tglDaftar: '2026-07-08', status: 'menunggu' },
  { id: 8, nik: '3275010101010020', nama: 'Eva Susanti', alamat: 'Jl. Teratai No. 2', noHp: '081234567809', tglDaftar: '2026-07-10', status: 'menunggu' },
  { id: 9, nik: '3275010101010021', nama: 'Fajar Saputra', alamat: 'Jl. Teratai No. 3', noHp: '081234567810', tglDaftar: '2026-07-11', status: 'menunggu' },
  { id: 10, nik: '3275010101010022', nama: 'Gita Purnama', alamat: 'Jl. Cempaka No. 1', noHp: '081234567811', tglDaftar: '2026-07-12', status: 'menunggu' },
  { id: 11, nik: '3275010101010023', nama: 'Hadi Prasetyo', alamat: 'Jl. Cempaka No. 2', noHp: '081234567812', tglDaftar: '2026-07-13', status: 'menunggu' },
  { id: 12, nik: '3275010101010024', nama: 'Indah Permata', alamat: 'Jl. Cempaka No. 3', noHp: '081234567813', tglDaftar: '2026-07-14', status: 'menunggu' },
]

function formatDate(dateStr) {
  var parts = dateStr.split('-')
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
  return parseInt(parts[2]) + ' ' + months[parseInt(parts[1]) - 1] + ' ' + parts[0]
}

export default function VerifikasiWarga() {
  var [search, setSearch] = useState('')
  var [data, setData] = useState(verifikasiData)

  var filteredData = data.filter(function(w) {
    return w.nama.toLowerCase().includes(search.toLowerCase()) || w.nik.includes(search)
  })

  function handleVerifikasi(id) {
    setData(data.map(function(w) {
      return w.id === id ? { ...w, status: 'terverifikasi' } : w
    }))
  }

  function handleTolak(id) {
    setData(data.map(function(w) {
      return w.id === id ? { ...w, status: 'ditolak' } : w
    }))
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Manajemen Warga</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Verifikasi Warga</h1>
        <p className="text-[14.5px] text-text-muted">Verifikasi pendaftaran warga baru RT 08.</p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex items-center">
            <svg className="icon absolute left-3.5 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            <input type="text" placeholder="Cari NIK atau Nama..." className="w-[260px] py-2.5 pl-[42px] pr-3.5 rounded-[10px] border border-border-subtle bg-bg-card text-[13.5px] text-text-primary font-sans transition-all shadow-lux focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(30,75,133,0.08)] placeholder:text-text-muted" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span className="text-xs font-semibold text-text-muted px-3.5 py-1.5 bg-bg-card rounded-full border border-border-subtle shadow-lux">{filteredData.filter(function(w) { return w.status === 'menunggu' }).length} menunggu</span>
        </div>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between">
          <h3 className="font-grotesk text-base font-bold text-text-primary">Daftar Verifikasi Warga</h3>
          <span style={{ fontSize: "12px", color: "var(--ink-subtle)" }}>Total: {filteredData.length} warga</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-bg">
              <tr>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">No</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">NIK</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">Nama</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">Alamat</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">No. HP</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">Tanggal Daftar</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap">Status</th>
                <th className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-muted px-5 py-3.5 text-left whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(function(w, index) {
                var statusLabel = w.status === 'menunggu' ? 'Menunggu' : w.status === 'terverifikasi' ? 'Terverifikasi' : 'Ditolak'
                var statusClass = w.status === 'menunggu' ? 'bg-warning-bg text-warning border border-warning/10' : w.status === 'terverifikasi' ? 'bg-success-bg text-success border border-success/10' : 'bg-error-bg text-error border border-error/10'

                return (
                  <tr key={w.id} className="hover:bg-primary-lighter">
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6">{index + 1}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6 font-mono text-[13px]">{w.nik}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6" style={{ fontWeight: 600, color: "var(--ink-black)" }}>{w.nama}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6">{w.alamat}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6 font-mono text-[13px]">{w.noHp}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6">{formatDate(w.tglDaftar)}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6">
                      <span className={"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap " + statusClass}>{statusLabel}</span>
                    </td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6 text-right pr-6">
                      {w.status === 'menunggu' ? (
                        <div className="flex items-center gap-2 justify-end flex-wrap">
                          <button className="inline-flex items-center gap-1 px-3.5 py-1 font-sans text-xs font-semibold rounded-full cursor-pointer transition-all min-h-[32px] bg-success-bg text-success border border-success/10 hover:bg-success hover:text-white" onClick={() => handleVerifikasi(w.id)}>
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /></svg>
                            Verifikasi
                          </button>
                          <button className="inline-flex items-center gap-1 px-3.5 py-1 font-sans text-xs font-semibold rounded-full cursor-pointer transition-all min-h-[32px] bg-error/10 text-error border border-error/10 hover:bg-error hover:text-white" onClick={() => handleTolak(w.id)}>
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted">-</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
