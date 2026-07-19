import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"

export default function KetuaVerifikasiPembayaran() {
  var navigate = useNavigate()
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
        .search-wrapper .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--ink-subtle); }
        .search-wrapper input { width: 100%; padding: 8px 12px 8px 38px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13.5px; color: var(--ink-black); background: var(--bg-neutral); border: 1px solid var(--border-subtle); border-radius: var(--radius-pill); outline: none; height: 38px; transition: all 0.2s ease; }
        .search-wrapper input:focus { border-color: var(--navy-brand); box-shadow: 0 0 0 3px var(--navy-brand-light); }
        .filter-group { display: flex; align-items: center; gap: var(--sp-8); }
        .filter-group label { font-size: 12px; font-weight: 600; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .filter-group select { padding: 6px 32px 6px 14px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; color: var(--ink-black); background: var(--bg-neutral); border: 1px solid var(--border-subtle); border-radius: var(--radius-pill); outline: none; height: 38px; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717A' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; cursor: pointer; transition: all 0.2s ease; }
        .filter-group select:focus { border-color: var(--navy-brand); box-shadow: 0 0 0 3px var(--navy-brand-light); }
        .badge-count { font-size: 12px; font-weight: 600; color: var(--ink-muted); background: var(--bg-neutral); padding: 4px 14px; border-radius: var(--radius-pill); border: 1px solid var(--border-subtle); white-space: nowrap; }
        .table-container { background: var(--white); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-lux); overflow: hidden; }
        .table-header { padding: var(--sp-20) var(--sp-24); border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--sp-12); }
        .table-header h3 { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; color: var(--ink-black); }
        .table-wrapper { overflow-x: auto; padding: 0 var(--sp-24) var(--sp-24) var(--sp-24); }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        table thead th { text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-subtle); background: var(--bg-neutral); border-bottom: 1px solid var(--border-subtle); white-space: nowrap; }
        table tbody td { padding: 12px 16px; border-bottom: 1px solid var(--border-subtle); color: var(--ink-muted); vertical-align: middle; }
        table tbody tr:last-child td { border-bottom: none; }
        table tbody tr:hover { background: var(--bg-neutral); }
        table tbody td .mono { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--ink-black); }
        table tbody td .name-cell { font-weight: 600; color: var(--ink-black); }
        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 14px; border-radius: var(--radius-pill); font-size: 11px; font-weight: 700; border: 1px solid transparent; }
        .status-badge .icon { width: 14px; height: 14px; }
        .status-badge.menunggu { background: var(--status-amber-bg); color: var(--status-amber); border-color: rgba(180,83,9,0.1); }
        .status-badge.terverifikasi { background: var(--status-green-bg); color: var(--status-green); border-color: rgba(21,128,61,0.1); }
        .status-badge.ditolak { background: var(--status-red-bg); color: var(--status-red); border-color: rgba(185,28,28,0.1); }
        .action-group { display: flex; align-items: center; gap: var(--sp-8); justify-content: flex-end; flex-wrap: wrap; }
        .btn-sm { display: inline-flex; align-items: center; gap: 4px; padding: 4px 14px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 600; border: none; border-radius: var(--radius-pill); cursor: pointer; transition: all 0.2s ease; min-height: 32px; }
        .btn-sm .icon { width: 14px; height: 14px; }
        .btn-sm-outline { background: transparent; color: var(--navy-brand); border: 1px solid var(--border-subtle); }
        .btn-sm-outline:hover { background: var(--navy-brand-light); border-color: var(--navy-brand); }
        .empty-state { text-align: center; padding: var(--sp-64) var(--sp-24); color: var(--ink-muted); }
        .empty-state .empty-icon { width: 56px; height: 56px; color: var(--border-subtle); margin-bottom: var(--sp-16); }
        .empty-state h3 { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; color: var(--ink-black); margin-bottom: var(--sp-8); }
        .empty-state p { font-size: 14px; }
        .icon { width: 18px; height: 18px; flex-shrink: 0; stroke-width: 2px; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 2000; display: none; align-items: center; justify-content: center; padding: var(--sp-24); }
        .modal-overlay.active { display: flex; }
        .modal { background: var(--white); border-radius: var(--radius-lg); max-width: 560px; width: 100%; box-shadow: 0 40px 80px rgba(0,0,0,0.12); max-height: 90vh; overflow-y: auto; }
        .modal-header { padding: var(--sp-24) var(--sp-28); border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; }
        .modal-header h3 { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; color: var(--ink-black); letter-spacing: -0.2px; }
        .modal-header .modal-close { background: none; border: none; color: var(--ink-subtle); cursor: pointer; padding: 4px; display: flex; border-radius: 50%; transition: all 0.2s ease; }
        .modal-header .modal-close:hover { background: var(--bg-neutral); color: var(--ink-black); }
        .modal-body { padding: var(--sp-28); }
        .modal-body .detail-row { display: flex; justify-content: space-between; padding: var(--sp-8) 0; border-bottom: 1px solid var(--border-subtle); font-size: 13.5px; }
        .modal-body .detail-row:last-child { border-bottom: none; }
        .modal-body .detail-row .label { color: var(--ink-subtle); font-weight: 500; }
        .modal-body .detail-row .value { color: var(--ink-black); font-weight: 600; text-align: right; }
        .modal-body .detail-row .value.mono { font-family: 'IBM Plex Mono', monospace; font-size: 13px; }
        .modal-body .detail-row .value .status-badge { font-size: 11px; padding: 3px 12px; }
        .modal-body .bukti-section { margin-top: var(--sp-16); padding-top: var(--sp-16); border-top: 1px solid var(--border-subtle); }
        .modal-body .bukti-section .bukti-label { font-size: 13px; font-weight: 600; color: var(--ink-black); margin-bottom: var(--sp-8); display: block; }
        .modal-body .bukti-image { border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-subtle); background: var(--bg-neutral); width: 100%; }
        .modal-body .bukti-image img { width: 100%; height: auto; max-height: 400px; object-fit: contain; display: block; background: var(--white); }
        .modal-body .bukti-image .no-bukti { padding: var(--sp-32); text-align: center; color: var(--ink-subtle); font-size: 13px; display: flex; flex-direction: column; align-items: center; gap: var(--sp-8); }
        .modal-body .bukti-image .no-bukti .icon { width: 40px; height: 40px; color: var(--border-subtle); }
        .modal-footer { padding: var(--sp-16) var(--sp-28); border-top: 1px solid var(--border-subtle); display: flex; gap: var(--sp-12); justify-content: flex-end; flex-wrap: wrap; }
        .modal-footer .btn { padding: 8px 24px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; border: none; border-radius: var(--radius-pill); cursor: pointer; min-height: 40px; transition: all 0.2s ease; }
        .modal-footer .btn-secondary { background: var(--bg-neutral); color: var(--ink-muted); border: 1px solid var(--border-subtle); }
        .modal-footer .btn-secondary:hover { background: var(--bg-hover); }
        .modal-footer .btn-success { background: var(--status-green); color: var(--white); }
        .modal-footer .btn-success:hover { background: #15804c; }
        .modal-footer .btn-danger { background: var(--status-red); color: var(--white); }
        .modal-footer .btn-danger:hover { background: #a83226; }
        @media (max-width: 768px) { .page-title { font-size: 26px; } .toolbar { flex-direction: column; align-items: stretch; padding: var(--sp-16); } .toolbar-left { flex-direction: column; align-items: stretch; } .search-wrapper { min-width: unset; } .table-wrapper { padding: 0 var(--sp-16) var(--sp-16) var(--sp-16); } table thead th, table tbody td { padding: 8px 10px; font-size: 12px; } .action-group { flex-wrap: wrap; gap: 4px; justify-content: flex-start; } .btn-sm { font-size: 11px; padding: 3px 10px; min-height: 28px; } .modal { margin: var(--sp-16); } .modal-body .detail-row { font-size: 13px; flex-direction: column; gap: 2px; } .modal-body .detail-row .value { text-align: left; } .modal-footer { flex-wrap: wrap; } .modal-footer .btn { flex: 1; min-width: 80px; justify-content: center; } }
      `}</style>

      <div className="hero-row">
        <p className="page-eyebrow">Manajemen Keuangan</p>
        <h1 className="page-title">Verifikasi Pembayaran</h1>
        <p className="page-sub">Verifikasi bukti pembayaran iuran yang dikirim oleh warga. Klik <strong>Detail</strong> untuk melihat bukti pembayaran.</p>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-wrapper">
            <svg className="icon search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            <input type="text" id="searchInput" placeholder="Cari nama warga..." />
          </div>
          <div className="filter-group">
            <label htmlFor="statusFilter">Status</label>
            <select id="statusFilter">
              <option value="all">Semua</option>
              <option value="menunggu" selected>Menunggu</option>
              <option value="terverifikasi">Terverifikasi</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
          <span className="badge-count" id="rowCount">2 menunggu</span>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Daftar Pembayaran</h3>
          <span style={{ fontSize: "12px", color: "var(--ink-subtle)" }}>Total: 5 pembayaran</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Warga</th>
                <th>Iuran</th>
                <th>Periode</th>
                <th>Nominal</th>
                <th>Tanggal Bayar</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody id="tableBody">
              <tr>
                <td>1</td>
                <td><span className="name-cell">Budi Santoso</span></td>
                <td>Iuran RT</td>
                <td><span className="mono">Juli 2026</span></td>
                <td><span className="mono">Rp50.000</span></td>
                <td><span className="mono">14 Jul 2026</span></td>
                <td><span className="status-badge terverifikasi"><svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /></svg> Terverifikasi</span></td>
                <td style={{ textAlign: "right" }}>
                  <div className="action-group" style={{ justifyContent: "flex-end" }}>
                    <button className="btn-sm btn-sm-outline" onClick={() => navigate('/detail-verifikasi/1')}>
                      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
                      Detail
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td><span className="name-cell">Ani Wijaya</span></td>
                <td>Iuran Keamanan</td>
                <td><span className="mono">Juli 2026</span></td>
                <td><span className="mono">Rp30.000</span></td>
                <td><span className="mono">13 Jul 2026</span></td>
                <td><span className="status-badge menunggu"><svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 14" /></svg> Menunggu</span></td>
                <td style={{ textAlign: "right" }}>
                  <div className="action-group" style={{ justifyContent: "flex-end" }}>
                    <button className="btn-sm btn-sm-outline" onClick={() => navigate('/detail-verifikasi/2')}>
                      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
                      Detail
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td><span className="name-cell">Siti Rahayu</span></td>
                <td>Iuran RT</td>
                <td><span className="mono">Juli 2026</span></td>
                <td><span className="mono">Rp50.000</span></td>
                <td><span className="mono">12 Jul 2026</span></td>
                <td><span className="status-badge menunggu"><svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 14" /></svg> Menunggu</span></td>
                <td style={{ textAlign: "right" }}>
                  <div className="action-group" style={{ justifyContent: "flex-end" }}>
                    <button className="btn-sm btn-sm-outline" onClick={() => navigate('/detail-verifikasi/3')}>
                      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
                      Detail
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td><span className="name-cell">Joko Prasetyo</span></td>
                <td>Iuran Sosial</td>
                <td><span className="mono">Juni 2026</span></td>
                <td><span className="mono">Rp20.000</span></td>
                <td><span className="mono">28 Jun 2026</span></td>
                <td><span className="status-badge ditolak"><svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg> Ditolak</span></td>
                <td style={{ textAlign: "right" }}>
                  <div className="action-group" style={{ justifyContent: "flex-end" }}>
                    <button className="btn-sm btn-sm-outline" onClick={() => navigate('/detail-verifikasi/4')}>
                      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
                      Detail
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>5</td>
                <td><span className="name-cell">Eko Prabowo</span></td>
                <td>Iuran Keamanan</td>
                <td><span className="mono">Juli 2026</span></td>
                <td><span className="mono">Rp30.000</span></td>
                <td><span className="mono">11 Jul 2026</span></td>
                <td><span className="status-badge terverifikasi"><svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /></svg> Terverifikasi</span></td>
                <td style={{ textAlign: "right" }}>
                  <div className="action-group" style={{ justifyContent: "flex-end" }}>
                    <button className="btn-sm btn-sm-outline" onClick={() => navigate('/detail-verifikasi/5')}>
                      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
                      Detail
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="modal-overlay" id="detailModal">
        <div className="modal">
          <div className="modal-header">
            <h3>Detail Pembayaran</h3>
            <button className="modal-close" id="modalClose" aria-label="Tutup">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
            </button>
          </div>
          <div className="modal-body" id="modalBody">
            <div className="detail-row">
              <span className="label">Nama Warga</span>
              <span className="value" id="modalWarga">-</span>
            </div>
            <div className="detail-row">
              <span className="label">Iuran</span>
              <span className="value" id="modalIuran">-</span>
            </div>
            <div className="detail-row">
              <span className="label">Periode</span>
              <span className="value mono" id="modalPeriode">-</span>
            </div>
            <div className="detail-row">
              <span className="label">Nominal</span>
              <span className="value mono" id="modalNominal">-</span>
            </div>
            <div className="detail-row">
              <span className="label">Metode Bayar</span>
              <span className="value" id="modalMetode">-</span>
            </div>
            <div className="detail-row">
              <span className="label">Tanggal Bayar</span>
              <span className="value mono" id="modalTanggal">-</span>
            </div>
            <div className="detail-row">
              <span className="label">Status</span>
              <span className="value" id="modalStatus">-</span>
            </div>
            <div className="bukti-section">
              <span className="bukti-label">Bukti Pembayaran</span>
              <div className="bukti-image" id="modalBukti">
                <div className="no-bukti">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                  <span>Tidak ada bukti pembayaran</span>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer" id="modalFooter">
            <button className="btn btn-secondary" id="modalCloseBtn">Tutup</button>
            <button className="btn btn-danger" id="modalRejectBtn" style={{ display: "none" }}>Tolak</button>
            <button className="btn btn-success" id="modalApproveBtn" style={{ display: "none" }}>Verifikasi</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
