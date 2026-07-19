import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"

const umkmData = [
  { id: 1, namaUsaha: 'Warung Makan "Sari"', pemilik: "Budi Santoso", jenis: "Kuliner", tanggal: "10 Jul 2026", status: "verified" },
  { id: 2, namaUsaha: 'Laundry "Bersih"', pemilik: "Budi Santoso", jenis: "Jasa", tanggal: "14 Jul 2026", status: "pending" },
  { id: 3, namaUsaha: 'Toko Sembako "Makmur"', pemilik: "Siti Rahayu", jenis: "Perdagangan", tanggal: "13 Jul 2026", status: "pending" },
  { id: 4, namaUsaha: 'Salon "Cantik"', pemilik: "Maya Sari", jenis: "Jasa", tanggal: "8 Jul 2026", status: "rejected" },
  { id: 5, namaUsaha: 'Bengkel "Maju"', pemilik: "Agus Saputra", jenis: "Jasa", tanggal: "5 Jul 2026", status: "verified" },
]

const statusClass = {
  verified: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-success-bg text-success border-success/10",
  pending: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-warning-bg text-warning border-warning/10",
  rejected: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-error-bg text-error border-error/10",
}
const statusLabel = { verified: "Terverifikasi", pending: "Menunggu", rejected: "Ditolak" }

export default function KetuaValidasiUMKM() {
  var navigate = useNavigate()
  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Manajemen UMKM</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Validasi UMKM</h1>
        <p className="text-[14.5px] text-text-muted">Verifikasi data UMKM yang diajukan oleh warga. Hanya Pengurus RT yang memiliki akses.</p>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap mb-6 bg-bg-card border border-border-subtle rounded-[20px] p-4 px-6 shadow-lux">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-bg border border-border-subtle rounded-[14px] px-3 focus-within:border-primary transition-[border-color] duration-200">
            <svg className="icon text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            <input type="text" id="searchInput" placeholder="Cari nama usaha atau pemilik..." className="border-none bg-transparent py-[10px] text-[13px] text-text-primary font-sans w-[200px] outline-none placeholder:text-text-muted" />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="statusFilter" className="text-xs font-semibold text-text-muted whitespace-nowrap">Status</label>
            <select id="statusFilter" className="p-2 px-3 border border-border-subtle rounded-[14px] text-[13px] font-sans text-text-primary bg-bg-card cursor-pointer outline-none focus:border-primary transition-[border-color] duration-200">
              <option value="all">Semua</option>
              <option value="pending">Menunggu</option>
              <option value="verified">Terverifikasi</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
          <span className="text-xs font-semibold text-text-muted px-3.5 py-1.5 bg-bg rounded-full border border-border-subtle whitespace-nowrap" id="rowCount">2 menunggu</span>
        </div>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h3 className="font-grotesk text-base font-bold text-text-primary">Daftar UMKM</h3>
          <span style={{ fontSize: "12px", color: "var(--ink-subtle)" }}>Total: 5 UMKM</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead className="bg-bg">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-[11.5px] uppercase tracking-[0.05em] text-text-muted border-b border-border-subtle whitespace-nowrap">No</th>
                <th className="px-4 py-3 text-left font-semibold text-[11.5px] uppercase tracking-[0.05em] text-text-muted border-b border-border-subtle whitespace-nowrap">Nama Usaha</th>
                <th className="px-4 py-3 text-left font-semibold text-[11.5px] uppercase tracking-[0.05em] text-text-muted border-b border-border-subtle whitespace-nowrap">Pemilik</th>
                <th className="px-4 py-3 text-left font-semibold text-[11.5px] uppercase tracking-[0.05em] text-text-muted border-b border-border-subtle whitespace-nowrap">Jenis</th>
                <th className="px-4 py-3 text-left font-semibold text-[11.5px] uppercase tracking-[0.05em] text-text-muted border-b border-border-subtle whitespace-nowrap">Tanggal Daftar</th>
                <th className="px-4 py-3 text-left font-semibold text-[11.5px] uppercase tracking-[0.05em] text-text-muted border-b border-border-subtle whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-[11.5px] uppercase tracking-[0.05em] text-text-muted border-b border-border-subtle whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody id="tableBody">
              {umkmData.map((u, i) => (
                <tr key={u.id} className="hover:bg-primary-light">
                  <td className="px-4 py-3 text-text-muted border-b border-border-subtle last:border-b-0">{i + 1}</td>
                  <td className="px-4 py-3 text-text-muted border-b border-border-subtle last:border-b-0"><span className="font-semibold text-text-primary">{u.namaUsaha}</span></td>
                  <td className="px-4 py-3 text-text-muted border-b border-border-subtle last:border-b-0">{u.pemilik}</td>
                  <td className="px-4 py-3 text-text-muted border-b border-border-subtle last:border-b-0">{u.jenis}</td>
                  <td className="px-4 py-3 text-text-muted border-b border-border-subtle last:border-b-0"><span className="font-mono text-[13px]">{u.tanggal}</span></td>
                  <td className="px-4 py-3 text-text-muted border-b border-border-subtle last:border-b-0"><span className={statusClass[u.status]}>{statusLabel[u.status]}</span></td>
                  <td className="px-4 py-3 text-text-muted border-b border-border-subtle last:border-b-0 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {u.status === "pending" ? (
                        <>
                          <button className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all font-sans whitespace-nowrap hover:brightness-90 border-none cursor-pointer bg-primary text-white" style={{ background: "var(--status-green)", padding: "6px 14px", fontSize: "12px" }}>Verifikasi</button>
                          <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all font-sans whitespace-nowrap bg-transparent border cursor-pointer" style={{ borderColor: "var(--status-red)", color: "var(--status-red)", padding: "6px 14px", fontSize: "12px" }}>Tolak</button>
                        </>
                      ) : (
                        <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all font-sans whitespace-nowrap bg-transparent text-primary border border-border-subtle hover:bg-primary-light hover:border-primary cursor-pointer" style={{ padding: "6px 14px", fontSize: "12px" }} onClick={() => navigate('/detail-validasi-umkm/' + u.id)}>Detail</button>
                      )}
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
