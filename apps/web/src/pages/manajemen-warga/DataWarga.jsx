import { useState } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"

var wargaData = [
  { id: 1, nik: '3275010101010001', nama: 'Budi Santoso', alamat: 'Jl. Mawar No. 1', noHp: '081234567890', tglDaftar: '2026-01-15', status: 'aktif' },
  { id: 2, nik: '3275010101010002', nama: 'Ani Wijaya', alamat: 'Jl. Mawar No. 2', noHp: '081234567891', tglDaftar: '2026-01-16', status: 'aktif' },
  { id: 3, nik: '3275010101010003', nama: 'Siti Rahayu', alamat: 'Jl. Mawar No. 3', noHp: '081234567892', tglDaftar: '2026-01-17', status: 'aktif' },
  { id: 4, nik: '3275010101010004', nama: 'Joko Prasetyo', alamat: 'Jl. Melati No. 1', noHp: '081234567893', tglDaftar: '2026-02-01', status: 'aktif' },
  { id: 5, nik: '3275010101010005', nama: 'Eko Prabowo', alamat: 'Jl. Melati No. 2', noHp: '081234567894', tglDaftar: '2026-02-05', status: 'nonaktif' },
  { id: 6, nik: '3275010101010006', nama: 'Dewi Lestari', alamat: 'Jl. Melati No. 3', noHp: '081234567895', tglDaftar: '2026-02-10', status: 'aktif' },
  { id: 7, nik: '3275010101010007', nama: 'Agus Saputra', alamat: 'Jl. Kenanga No. 1', noHp: '081234567896', tglDaftar: '2026-02-15', status: 'aktif' },
  { id: 8, nik: '3275010101010008', nama: 'Rina Marlina', alamat: 'Jl. Kenanga No. 2', noHp: '081234567897', tglDaftar: '2026-03-01', status: 'nonaktif' },
  { id: 9, nik: '3275010101010009', nama: 'Hendra Gunawan', alamat: 'Jl. Anggrek No. 1', noHp: '081234567898', tglDaftar: '2026-03-10', status: 'aktif' },
  { id: 10, nik: '3275010101010010', nama: 'Fitri Handayani', alamat: 'Jl. Anggrek No. 2', noHp: '081234567899', tglDaftar: '2026-03-15', status: 'aktif' },
  { id: 11, nik: '3275010101010011', nama: 'Dodi Firmansyah', alamat: 'Jl. Anggrek No. 3', noHp: '081234567800', tglDaftar: '2026-04-01', status: 'aktif' },
  { id: 12, nik: '3275010101010012', nama: 'Sari Indah', alamat: 'Jl. Anggrek No. 4', noHp: '081234567801', tglDaftar: '2026-04-10', status: 'nonaktif' },
]

function formatDate(dateStr) {
  var parts = dateStr.split('-')
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
  return parseInt(parts[2]) + ' ' + months[parseInt(parts[1]) - 1] + ' ' + parts[0]
}

export default function DataWarga() {
  var [search, setSearch] = useState('')
  var [statusFilter, setStatusFilter] = useState('all')

  var filteredData = wargaData.filter(function(w) {
    var matchSearch = w.nama.toLowerCase().includes(search.toLowerCase()) || w.nik.includes(search)
    var matchStatus = statusFilter === 'all' || w.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Manajemen Warga</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Data Warga</h1>
        <p className="text-[14.5px] text-text-muted">Lihat seluruh data warga RT 08.</p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex items-center">
            <svg className="icon absolute left-3.5 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            <input type="text" placeholder="Cari NIK atau Nama warga..." className="w-[260px] py-2.5 pl-[42px] pr-3.5 rounded-[10px] border border-border-subtle bg-bg-card text-[13.5px] text-text-primary font-sans transition-all shadow-lux focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(30,75,133,0.08)] placeholder:text-text-muted" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="statusFilter" className="text-[12.5px] font-semibold text-text-muted whitespace-nowrap">Status</label>
            <select id="statusFilter" className="p-2 px-3 rounded-[10px] border border-border-subtle bg-bg-card text-[13px] text-text-primary font-sans shadow-lux cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Semua</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
          <span className="text-xs font-semibold text-text-muted px-3.5 py-1.5 bg-bg-card rounded-full border border-border-subtle shadow-lux">{filteredData.length} warga</span>
        </div>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between">
          <h3 className="font-grotesk text-base font-bold text-text-primary">Daftar Warga</h3>
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
              </tr>
            </thead>
            <tbody>
              {filteredData.map(function(w, index) {
                return (
                  <tr key={w.id} className="hover:bg-primary-lighter">
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6">{index + 1}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6 font-mono text-[13px]">{w.nik}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6" style={{ fontWeight: 600, color: "var(--ink-black)" }}>{w.nama}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6">{w.alamat}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6 font-mono text-[13px]">{w.noHp}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6">{formatDate(w.tglDaftar)}</td>
                    <td className="text-[13.5px] text-text-muted px-5 py-3.5 border-t border-border-subtle pl-6">
                      <span className={"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap " + (w.status === 'aktif' ? 'bg-success-bg text-success border border-success/10' : 'bg-error-bg text-error border border-error/10')}>{w.status === 'aktif' ? 'Aktif' : 'Nonaktif'}</span>
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
