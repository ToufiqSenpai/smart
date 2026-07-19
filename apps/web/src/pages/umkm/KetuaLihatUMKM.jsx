import DashboardLayout from "../../components/layout/DashboardLayout"

export default function KetuaLihatUMKM() {
  return (
    <DashboardLayout>
      <style>{`
        .hero-row { margin-bottom: var(--sp-32); }
        .page-eyebrow { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: var(--gold-seal); margin-bottom: var(--sp-8); }
        .page-title { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 700; color: var(--ink-black); letter-spacing: -0.6px; line-height: 1.2; margin-bottom: var(--sp-8); }
        .page-sub { font-size: 14.5px; color: var(--ink-subtle); }
        .toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--sp-16); flex-wrap: wrap; margin-bottom: var(--sp-24); }
        .toolbar-left { display: flex; align-items: center; gap: var(--sp-12); flex-wrap: wrap; }
        .search-wrapper { position: relative; display: flex; align-items: center; }
        .search-wrapper .search-icon { position: absolute; left: 14px; color: var(--ink-subtle); pointer-events: none; }
        .search-wrapper input { width: 260px; padding: 10px 14px 10px 42px; border-radius: 10px; border: 1px solid var(--border-subtle); background: var(--white); font-size: 13.5px; color: var(--ink-black); font-family: inherit; transition: all 0.2s ease; box-shadow: var(--shadow-lux); }
        .search-wrapper input:focus { outline: none; border-color: var(--navy-brand); box-shadow: 0 0 0 3px rgba(30,75,133,0.08); }
        .search-wrapper input::placeholder { color: var(--ink-subtle); }
        .badge-count { font-size: 12px; font-weight: 600; color: var(--ink-subtle); padding: 6px 14px; background: var(--white); border-radius: var(--radius-pill); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-lux); }
        .filter-group { display: flex; align-items: center; gap: var(--sp-8); }
        .filter-group label { font-size: 12.5px; font-weight: 600; color: var(--ink-muted); white-space: nowrap; }
        .filter-group select { padding: 8px 12px; border-radius: 10px; border: 1px solid var(--border-subtle); background: var(--white); font-size: 13px; color: var(--ink-black); font-family: inherit; box-shadow: var(--shadow-lux); cursor: pointer; }
        .table-container { background: var(--white); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-lux); overflow: hidden; }
        .table-header { padding: var(--sp-20) var(--sp-24); border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; }
        .table-header h3 { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; color: var(--ink-black); }
        .table-wrapper { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead { background: var(--bg-neutral); }
        th { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink-subtle); padding: 14px 20px; text-align: left; white-space: nowrap; }
        td { font-size: 13.5px; color: var(--ink-muted); padding: 14px 20px; border-top: 1px solid var(--border-subtle); }
        td:first-child, th:first-child { padding-left: var(--sp-24); }
        td:last-child, th:last-child { padding-right: var(--sp-24); }
        tbody tr:hover { background: var(--navy-brand-subtle); }
        .status-badge-td { display: inline-flex; align-items: center; gap: var(--sp-6); font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: var(--radius-pill); white-space: nowrap; }
        .status-badge-td.success { background: var(--status-green-bg); color: var(--status-green); border: 1px solid rgba(21,128,61,0.08); }
        .status-badge-td.warning { background: var(--status-amber-bg); color: var(--status-amber); border: 1px solid rgba(180,83,9,0.08); }
        .status-badge-td.danger { background: var(--status-red-bg); color: var(--status-red); border: 1px solid rgba(185,28,28,0.08); }
        .action-link { font-size: 12.5px; color: var(--navy-brand); font-weight: 600; text-decoration: none; }
        .action-link:hover { text-decoration: underline; }
        .action-link + .action-link { margin-left: var(--sp-12); }
        @media (max-width: 768px) { .page-title { font-size: 26px; } .search-wrapper input { width: 180px; } }
      `}</style>

      <div className="hero-row">
        <p className="page-eyebrow">Manajemen UMKM</p>
        <h1 className="page-title">Data UMKM</h1>
        <p className="page-sub">Lihat seluruh data UMKM yang terdaftar di RT 08.</p>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-wrapper">
            <svg className="icon search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            <input type="text" placeholder="Cari nama usaha atau pemilik..." />
          </div>
          <div className="filter-group">
            <label htmlFor="statusFilter">Status</label>
            <select id="statusFilter">
              <option value="all">Semua</option>
              <option value="verified">Terverifikasi</option>
              <option value="pending">Menunggu</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
          <span className="badge-count">5 UMKM</span>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Daftar UMKM</h3>
          <span style={{ fontSize: "12px", color: "var(--ink-subtle)" }}>Total: 5 UMKM</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Usaha</th>
                <th>Pemilik</th>
                <th>Jenis</th>
                <th>Tanggal Daftar</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td style={{ fontWeight: 600, color: "var(--ink-black)" }}>Warung Makan "Budi"</td>
                <td>Budi Santoso</td>
                <td>Kuliner</td>
                <td>10/07/2026</td>
                <td><span className="status-badge-td success">Terverifikasi</span></td>
                <td style={{ textAlign: "right" }}><a href="/ketua/lihat-umkm" className="action-link">Detail</a></td>
              </tr>
              <tr>
                <td>2</td>
                <td style={{ fontWeight: 600, color: "var(--ink-black)" }}>Laundry "Bersih"</td>
                <td>Ani Wijaya</td>
                <td>Jasa</td>
                <td>12/07/2026</td>
                <td><span className="status-badge-td warning">Menunggu</span></td>
                <td style={{ textAlign: "right" }}><a href="/ketua/lihat-umkm" className="action-link">Detail</a></td>
              </tr>
              <tr>
                <td>3</td>
                <td style={{ fontWeight: 600, color: "var(--ink-black)" }}>Toko Kelontong "Murah"</td>
                <td>Siti Rahayu</td>
                <td>Perdagangan</td>
                <td>08/07/2026</td>
                <td><span className="status-badge-td success">Terverifikasi</span></td>
                <td style={{ textAlign: "right" }}><a href="/ketua/lihat-umkm" className="action-link">Detail</a></td>
              </tr>
              <tr>
                <td>4</td>
                <td style={{ fontWeight: 600, color: "var(--ink-black)" }}>Bengkel "Jaya"</td>
                <td>Agus Saputra</td>
                <td>Otomotif</td>
                <td>05/07/2026</td>
                <td><span className="status-badge-td success">Terverifikasi</span></td>
                <td style={{ textAlign: "right" }}><a href="/ketua/lihat-umkm" className="action-link">Detail</a></td>
              </tr>
              <tr>
                <td>5</td>
                <td style={{ fontWeight: 600, color: "var(--ink-black)" }}>Katering "Nikmat"</td>
                <td>Fitriana</td>
                <td>Kuliner</td>
                <td>15/07/2026</td>
                <td><span className="status-badge-td danger">Ditolak</span></td>
                <td style={{ textAlign: "right" }}><a href="/ketua/lihat-umkm" className="action-link">Detail</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
