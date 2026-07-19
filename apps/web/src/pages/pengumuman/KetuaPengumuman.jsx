import { Link, useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"

const pengumumanData = [
  { id: 1, judul: "Kerja Bakti RT 08", tanggal: "14 Jul 2026", status: "publik" },
  { id: 2, judul: "Perubahan Jadwal Ronda Malam", tanggal: "12 Jul 2026", status: "publik" },
  { id: 3, judul: "Pendaftaran UMKM Binaan", tanggal: "10 Jul 2026", status: "draft" },
  { id: 4, judul: "Laporan Keuangan Semester I 2026", tanggal: "8 Jul 2026", status: "publik" },
]

const statusClass = {
  publik: "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold border bg-success-bg text-success border-success/10",
  draft: "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold border bg-warning-bg text-warning border-warning/10",
}

export default function KetuaPengumuman() {
  const navigate = useNavigate()
  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Manajemen Informasi</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Kelola Pengumuman</h1>
        <p className="text-[14.5px] text-text-muted">Buat dan kelola pengumuman untuk warga RT 08.</p>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-[20px] p-4 px-6 flex items-center justify-between gap-4 flex-wrap mb-8 shadow-lux">
        <div className="flex items-center gap-4 flex-wrap flex-1">
          <div className="flex-1 min-w-[200px] relative">
            <svg className="icon absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            <input type="text" id="searchInput" placeholder="Cari judul pengumuman..." className="w-full py-2 pl-[38px] pr-3 font-sans text-[13.5px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(30,75,133,0.06)]" />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="statusFilter" className="text-xs font-semibold text-text-muted uppercase tracking-[0.05em]">Status</label>
            <select id="statusFilter" className="px-3.5 py-1.5 pl-[14px] pr-[32px] font-sans text-[13px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] appearance-none cursor-pointer transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(30,75,133,0.06)]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717A' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
              <option value="all">Semua</option>
              <option value="publik">Publik</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <span className="text-xs font-semibold text-text-muted bg-bg px-3.5 py-1 rounded-full border border-border-subtle whitespace-nowrap" id="rowCount">4 pengumuman</span>
        </div>
        <Link to="/tambah-pengumuman" className="inline-flex items-center gap-2 px-5 py-2 font-sans text-[13px] font-semibold bg-primary text-white border-none rounded-full cursor-pointer min-h-[38px] transition-all whitespace-nowrap hover:bg-[#163b6a] hover:shadow-[0_4px_12px_rgba(30,75,133,0.25)] hover:-translate-y-px">
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Tambah Pengumuman
        </Link>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-grotesk text-base font-bold text-text-primary">Daftar Pengumuman</h3>
          <span style={{ fontSize: "12px", color: "var(--ink-subtle)" }}>Total: 4 pengumuman</span>
        </div>
        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">No</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Judul</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Tanggal</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Status</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody id="tableBody">
              {pengumumanData.map((p, i) => (
                <tr key={p.id} className="hover:bg-bg">
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0">{i + 1}</td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0"><span className="font-semibold text-text-primary">{p.judul}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0"><span className="font-mono text-[12px] text-text-primary">{p.tanggal}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0"><span className={statusClass[p.status]}>{p.status === "publik" ? "Publik" : "Draft"}</span></td>
                  <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0 text-right">
                    <div className="flex items-center gap-2 justify-end flex-wrap">
                      <button className="inline-flex items-center gap-1 px-3.5 py-1 font-sans text-xs font-semibold rounded-full cursor-pointer transition-all min-h-[32px] bg-transparent text-primary border border-border-subtle hover:bg-primary-light hover:border-primary" onClick={() => navigate('/edit-pengumuman/' + p.id)}>Edit</button>
                      <button className="inline-flex items-center gap-1 px-3.5 py-1 font-sans text-xs font-semibold rounded-full cursor-pointer transition-all min-h-[32px] bg-error/10 text-error border border-error/10 hover:bg-error hover:text-white">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
