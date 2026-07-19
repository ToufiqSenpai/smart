import DashboardLayout from "../../components/layout/DashboardLayout"

const laporanData = [
  { id: 1, kategori: 'Lampu Jalan Mati', pelapor: 'Budi Santoso', deskripsi: 'Lampu jalan di depan rumah nomor 12 mati sejak 3 hari lalu. Sangat gelap dan berbahaya.', tanggal: '2026-07-14', status: 'menunggu', foto: null, tanggapan: null },
  { id: 2, kategori: 'Saluran Air Tersumbat', pelapor: 'Ani Wijaya', deskripsi: 'Saluran air di Jl. Mawar tersumbat sampah. Air meluap ke jalan saat hujan.', tanggal: '2026-07-12', status: 'diverifikasi', foto: null, tanggapan: null },
  { id: 3, kategori: 'Sampah Menumpuk', pelapor: 'Siti Rahayu', deskripsi: 'Sampah di TPS RT 08 sudah menumpuk dan belum diangkut selama 2 hari.', tanggal: '2026-07-10', status: 'proses', foto: null, tanggapan: 'Sedang dalam penanganan petugas kebersihan.' },
  { id: 4, kategori: 'Keamanan', pelapor: 'Joko Prasetyo', deskripsi: 'Terlihat orang mencurigakan di sekitar kompleks malam hari.', tanggal: '2026-07-08', status: 'ditolak', foto: null, tanggapan: 'Laporan tidak terbukti setelah pengecekan.' },
  { id: 5, kategori: 'Jalan Rusak', pelapor: 'Eko Prabowo', deskripsi: 'Jalan di depan masjid berlubang dan membahayakan pengendara.', tanggal: '2026-07-05', status: 'selesai', foto: null, tanggapan: 'Jalan sudah diperbaiki oleh petugas.' }
]

function formatDate(dateStr) {
  const parts = dateStr.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
  return parseInt(parts[2]) + ' ' + months[parseInt(parts[1]) - 1] + ' ' + parts[0]
}

function getStatusInfo(status) {
  const map = {
    'menunggu': { class: 'bg-warning-bg text-warning border-warning/10', label: 'Menunggu', icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>' },
    'diverifikasi': { class: 'bg-teal-bg text-teal border-teal/10', label: 'Diverifikasi', icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"/></svg>' },
    'proses': { class: 'bg-teal-bg text-teal border-teal/10', label: 'Dalam Proses', icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l3 2"/></svg>' },
    'selesai': { class: 'bg-success-bg text-success border-success/10', label: 'Selesai', icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"/></svg>' },
    'ditolak': { class: 'bg-error-bg text-error border-error/10', label: 'Ditolak', icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>' }
  }
  return map[status] || map['menunggu']
}

export default function KetuaMonitoringLaporan() {
  const total = laporanData.length
  const menunggu = laporanData.filter(i => i.status === 'menunggu').length
  const diverifikasi = laporanData.filter(i => i.status === 'diverifikasi').length
  const proses = laporanData.filter(i => i.status === 'proses').length
  const selesai = laporanData.filter(i => i.status === 'selesai').length
  const ditolak = laporanData.filter(i => i.status === 'ditolak').length

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Manajemen Laporan</p>
        <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Monitoring Laporan</h1>
        <p className="text-[14.5px] text-text-muted">Pantau seluruh laporan kendala warga RT 08.</p>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-[20px] p-4 px-6 flex items-center justify-between gap-4 flex-wrap mb-8 shadow-lux">
        <div className="flex items-center gap-4 flex-wrap flex-1">
          <div className="flex-1 min-w-[200px] relative">
            <svg className="icon absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            <input type="text" id="searchInput" placeholder="Cari kategori atau pelapor..." className="w-full py-2 pl-[38px] pr-3 font-sans text-[13.5px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(30,75,133,0.06)]" />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="statusFilter" className="text-xs font-semibold text-text-muted uppercase tracking-[0.05em]">Status</label>
            <select id="statusFilter" className="px-3.5 py-1.5 pl-[14px] pr-[32px] font-sans text-[13px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] appearance-none cursor-pointer transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(30,75,133,0.06)]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717A' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
              <option value="all">Semua</option>
              <option value="menunggu">Menunggu</option>
              <option value="diverifikasi">Diverifikasi</option>
              <option value="proses">Dalam Proses</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
          <span className="text-xs font-semibold text-text-muted bg-bg px-3.5 py-1 rounded-full border border-border-subtle whitespace-nowrap" id="rowCount">{total} laporan ({menunggu} menunggu, {diverifikasi} diverifikasi, {proses} proses, {selesai} selesai, {ditolak} ditolak)</span>
        </div>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux overflow-hidden">
        <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-grotesk text-base font-bold text-text-primary">Daftar Laporan Kendala</h3>
          <span style={{ fontSize: "12px", color: "var(--ink-subtle)" }}>Total: {total} laporan</span>
        </div>
        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">No</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Kategori</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Pelapor</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Tanggal Lapor</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap">Status</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted bg-bg border-b border-border-subtle whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody id="tableBody">
              {laporanData.map((item, index) => {
                const status = getStatusInfo(item.status)
                return (
                  <tr key={item.id} className="hover:bg-bg">
                    <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0">{index + 1}</td>
                    <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0"><span className="font-semibold text-text-primary">{item.kategori}</span></td>
                    <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0">{item.pelapor}</td>
                    <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0"><span className="font-mono text-[12px] text-text-primary">{formatDate(item.tanggal)}</span></td>
                    <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0"><span className={"inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold border " + status.class} dangerouslySetInnerHTML={{ __html: status.icon + ' ' + status.label }} /></td>
                    <td className="px-4 py-3 border-b border-border-subtle text-text-muted align-middle last:border-b-0 text-right">
                      <div className="flex items-center gap-2 justify-end flex-wrap">
                        <button className="inline-flex items-center gap-1 px-3.5 py-1 font-sans text-xs font-semibold rounded-full cursor-pointer transition-all min-h-[32px] bg-transparent text-primary border border-border-subtle hover:bg-primary-light hover:border-primary" onClick={() => alert('Detail laporan ' + item.kategori)}>
                          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
                          Detail
                        </button>
                      </div>
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
