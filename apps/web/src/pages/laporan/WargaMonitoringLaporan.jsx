import DashboardLayout from "../../components/layout/DashboardLayout"

export default function WargaMonitoringLaporan() {
  return (
    <DashboardLayout>
      <style>{`
        .hero-row { margin-bottom: var(--sp-32); }
        .page-eyebrow { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: var(--gold-seal); margin-bottom: var(--sp-8); }
        .page-title { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 700; color: var(--ink-black); letter-spacing: -0.6px; line-height: 1.2; margin-bottom: var(--sp-8); }
        .page-sub { font-size: 14.5px; color: var(--ink-subtle); }

        .toolbar { background: var(--white); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: var(--sp-16) var(--sp-24); display: flex; align-items: center; justify-content: space-between; gap: var(--sp-16); flex-wrap: wrap; margin-bottom: var(--sp-32); box-shadow: var(--shadow-lux); }
        .toolbar-left { display: flex; align-items: center; gap: var(--sp-16); flex-wrap: wrap; flex: 1; }
        .search-wrapper { flex: 1; min-width: 200px; position: relative; }
        .search-wrapper .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--ink-subtle); pointer-events: none; }
        .search-wrapper input { width: 100%; padding: 8px 12px 8px 38px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13.5px; color: var(--ink-black); background: var(--bg-neutral); border: 1px solid var(--border-subtle); border-radius: var(--radius-pill); outline: none; height: 38px; transition: all 0.2s ease; }
        .search-wrapper input:focus { border-color: var(--navy-brand); box-shadow: 0 0 0 3px var(--navy-brand-light); }
        .filter-group { display: flex; align-items: center; gap: var(--sp-8); }
        .filter-group label { font-size: 12px; font-weight: 600; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .filter-group select { padding: 6px 32px 6px 14px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; color: var(--ink-black); background: var(--bg-neutral); border: 1px solid var(--border-subtle); border-radius: var(--radius-pill); outline: none; height: 38px; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717A' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; cursor: pointer; transition: all 0.2s ease; }
        .filter-group select:focus { border-color: var(--navy-brand); box-shadow: 0 0 0 3px var(--navy-brand-light); }
        .badge-count { font-size: 12px; font-weight: 600; color: var(--ink-muted); background: var(--bg-neutral); padding: 4px 14px; border-radius: var(--radius-pill); border: 1px solid var(--border-subtle); white-space: nowrap; }

        .btn-primary-sm { display: inline-flex; align-items: center; gap: var(--sp-8); padding: 8px 20px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; background: var(--navy-brand); color: var(--white); border: none; border-radius: var(--radius-pill); cursor: pointer; min-height: 38px; transition: all 0.2s ease; white-space: nowrap; text-decoration: none; }
        .btn-primary-sm:hover { background: #163b6a; box-shadow: 0 4px 12px rgba(30, 75, 133, 0.25); transform: translateY(-1px); }
        .btn-primary-sm .icon { width: 16px; height: 16px; }

        .table-container { background: var(--white); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-lux); overflow: hidden; }
        .table-header { padding: var(--sp-20) var(--sp-24); border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--sp-12); }
        .table-header h3 { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; color: var(--ink-black); }
        .table-wrapper { overflow-x: auto; padding: 0 var(--sp-24) var(--sp-24) var(--sp-24); }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        table thead th { text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-subtle); background: var(--bg-neutral); border-bottom: 1px solid var(--border-subtle); white-space: nowrap; }
        table tbody td { padding: 12px 16px; border-bottom: 1px solid var(--border-subtle); color: var(--ink-muted); vertical-align: middle; }
        table tbody tr:last-child td { border-bottom: none; }
        table tbody tr:hover { background: var(--bg-neutral); }
        table tbody td .name-cell { font-weight: 600; color: var(--ink-black); }
        table tbody td .mono { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--ink-black); }

        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 14px; border-radius: var(--radius-pill); font-size: 11px; font-weight: 700; border: 1px solid transparent; }
        .status-badge .icon { width: 14px; height: 14px; }
        .status-badge.menunggu { background: var(--status-amber-bg); color: var(--status-amber); border-color: rgba(180, 83, 9, 0.1); }
        .status-badge.diverifikasi { background: var(--status-teal-bg); color: var(--status-teal); border-color: rgba(15, 118, 110, 0.1); }
        .status-badge.proses { background: var(--status-teal-bg); color: var(--status-teal); border-color: rgba(15, 118, 110, 0.1); }
        .status-badge.selesai { background: var(--status-green-bg); color: var(--status-green); border-color: rgba(21, 128, 61, 0.1); }
        .status-badge.ditolak { background: var(--status-red-bg); color: var(--status-red); border-color: rgba(185, 28, 28, 0.1); }

        .btn-sm { display: inline-flex; align-items: center; gap: 4px; padding: 4px 14px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 600; border: none; border-radius: var(--radius-pill); cursor: pointer; transition: all 0.2s ease; min-height: 32px; }
        .btn-sm .icon { width: 14px; height: 14px; }
        .btn-sm-outline { background: transparent; color: var(--navy-brand); border: 1px solid var(--border-subtle); }
        .btn-sm-outline:hover { background: var(--navy-brand-light); border-color: var(--navy-brand); }

        .empty-state { text-align: center; padding: var(--sp-64) var(--sp-24); color: var(--ink-muted); }
        .empty-state .empty-icon { width: 56px; height: 56px; color: var(--border-subtle); margin-bottom: var(--sp-16); }
        .empty-state h3 { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; color: var(--ink-black); margin-bottom: var(--sp-8); }
        .empty-state p { font-size: 14px; margin-bottom: var(--sp-16); }
        .empty-state .btn-primary-sm { display: inline-flex; }

        @media (max-width: 768px) {
          .page-title { font-size: 26px; }
          .toolbar { flex-direction: column; align-items: stretch; padding: var(--sp-16); }
          .toolbar-left { flex-direction: column; align-items: stretch; }
          .search-wrapper { min-width: unset; }
          .btn-primary-sm { width: 100%; justify-content: center; }
          .table-wrapper { padding: 0 var(--sp-16) var(--sp-16) var(--sp-16); }
          table thead th, table tbody td { padding: 8px 10px; font-size: 12px; }
        }
      `}</style>

      <div className="hero-row">
        <p className="page-eyebrow">Laporan Kendala</p>
        <h1 className="page-title">Monitoring Laporan</h1>
        <p className="page-sub">Pantau status laporan kendala yang sudah Anda ajukan.</p>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-wrapper">
            <svg className="icon search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            <input type="text" id="searchInput" placeholder="Cari laporan..." />
          </div>
          <div className="filter-group">
            <label htmlFor="statusFilter">Status</label>
            <select id="statusFilter">
              <option value="all">Semua</option>
              <option value="menunggu">Menunggu</option>
              <option value="diverifikasi">Diverifikasi</option>
              <option value="proses">Dalam Proses</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
          <span className="badge-count" id="rowCount">3 laporan</span>
        </div>
        <a href="/warga/buat-laporan" className="btn-primary-sm">
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Buat Laporan
        </a>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Daftar Laporan Saya</h3>
          <span style={{ fontSize: "12px", color: "var(--ink-subtle)" }}>Total: 3 laporan</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Kategori</th>
                <th>Deskripsi</th>
                <th>Tanggal Lapor</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody id="tableBody" />
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
