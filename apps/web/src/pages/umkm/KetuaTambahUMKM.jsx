import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"

export default function KetuaTambahUMKM() {
  const navigate = useNavigate()

  return (
    <DashboardLayout>
      <style>{`
        .back-link { display: inline-flex; align-items: center; gap: var(--sp-8); font-size: 13px; font-weight: 600; color: var(--ink-muted); background: none; border: none; cursor: pointer; padding: 0; margin-bottom: var(--sp-24); transition: color 0.2s ease; font-family: inherit; }
        .back-link:hover { color: var(--navy-brand); }
        .form-card { background: var(--white); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-lux); padding: var(--sp-32) var(--sp-40); max-width: 720px; }
        .form-header { margin-bottom: var(--sp-32); }
        .form-eyebrow { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: var(--gold-seal); margin-bottom: var(--sp-8); }
        .form-header h2 { font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 700; color: var(--ink-black); letter-spacing: -0.4px; margin-bottom: var(--sp-8); }
        .form-header p { font-size: 14px; color: var(--ink-subtle); }
        .form-group { margin-bottom: var(--sp-24); }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--ink-black); margin-bottom: var(--sp-8); }
        .form-group .label-hint { font-weight: 400; color: var(--ink-subtle); font-size: 12px; }
        .form-control { width: 100%; padding: 11px 14px; border-radius: 10px; border: 1px solid var(--border-subtle); background: var(--white); font-size: 14px; color: var(--ink-black); font-family: inherit; transition: all 0.2s ease; box-shadow: var(--shadow-lux); }
        .form-control:focus { outline: none; border-color: var(--navy-brand); box-shadow: 0 0 0 3px rgba(30,75,133,0.08); }
        .form-control::placeholder { color: var(--ink-subtle); }
        textarea.form-control { resize: vertical; min-height: 100px; }
        select.form-control { cursor: pointer; }
        .helper-text { font-size: 12px; color: var(--ink-subtle); margin-top: var(--sp-6); }
        .error-text { display: none; align-items: center; gap: var(--sp-6); font-size: 12px; color: var(--status-red); margin-top: var(--sp-6); }
        .error-text .icon { width: 14px; height: 14px; }
        .form-actions { display: flex; align-items: center; gap: var(--sp-12); margin-top: var(--sp-32); padding-top: var(--sp-24); border-top: 1px solid var(--border-subtle); }
        .btn { display: inline-flex; align-items: center; gap: var(--sp-8); padding: 10px 24px; border-radius: 10px; font-size: 13.5px; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 0.2s ease; border: none; }
        .btn-primary { background: var(--navy-brand); color: var(--white); box-shadow: 0 4px 12px rgba(30,75,133,0.2); }
        .btn-primary:hover { background: #163d6e; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(30,75,133,0.25); }
        .btn-secondary { background: var(--bg-neutral); color: var(--ink-muted); border: 1px solid var(--border-subtle); }
        .btn-secondary:hover { background: var(--bg-hover); color: var(--ink-black); }
        .status-preview { display: inline-flex; align-items: center; gap: var(--sp-6); font-size: 12.5px; color: var(--status-green); font-weight: 600; padding: 6px 14px; background: var(--status-green-bg); border-radius: var(--radius-pill); border: 1px solid rgba(21,128,61,0.08); }
        .status-preview .icon { width: 14px; height: 14px; }
        @media (max-width: 768px) { .form-card { padding: var(--sp-24); } .form-header h2 { font-size: 22px; } }
      `}</style>

      <button className="back-link" onClick={() => navigate(-1)}>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali ke daftar UMKM
      </button>

      <div className="form-card">
        <div className="form-header">
          <p className="form-eyebrow">Tambah Data</p>
          <h2>Tambah UMKM</h2>
          <p>Daftarkan usaha mikro kecil menengah baru untuk warga RT 08.</p>
        </div>

        <form id="umkmForm" noValidate onSubmit={(e) => { e.preventDefault(); alert('Fitur tambah UMKM oleh Ketua belum tersedia. Gunakan akun warga.'); }}>
          <div className="form-group">
            <label htmlFor="namaUsaha">Nama Usaha</label>
            <input type="text" className="form-control" id="namaUsaha" placeholder="Contoh: Warung Makan Sejahtera" required />
            <div className="helper-text">Nama usaha yang akan terlihat oleh warga.</div>
            <div className="error-text" id="namaUsahaError">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Nama usaha harus diisi</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pemilikUsaha">Nama Pemilik</label>
            <input type="text" className="form-control" id="pemilikUsaha" placeholder="Nama lengkap pemilik usaha" required />
            <div className="helper-text">Nama pemilik sesuai dengan data kependudukan.</div>
            <div className="error-text" id="pemilikUsahaError">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Nama pemilik harus diisi</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="jenisUsaha">Jenis Usaha</label>
            <select className="form-control" id="jenisUsaha" required>
              <option value="">-- Pilih Jenis --</option>
              <option value="Kuliner">Kuliner</option>
              <option value="Perdagangan">Perdagangan</option>
              <option value="Jasa">Jasa</option>
              <option value="Otomotif">Otomotif</option>
              <option value="Fashion">Fashion</option>
              <option value="Kerajinan">Kerajinan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            <div className="helper-text">Kategori jenis usaha UMKM.</div>
            <div className="error-text" id="jenisUsahaError">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Jenis usaha harus dipilih</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="alamatUsaha">Alamat Usaha</label>
            <textarea className="form-control" id="alamatUsaha" placeholder="Masukkan alamat lengkap usaha..." rows="3" required></textarea>
            <div className="helper-text">Alamat lengkap lokasi usaha di RT 08.</div>
            <div className="error-text" id="alamatUsahaError">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Alamat usaha harus diisi</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="noTelp">No. Telepon <span className="label-hint">(opsional)</span></label>
            <input type="text" className="form-control" id="noTelp" placeholder="Contoh: 081234567890" />
            <div className="helper-text">Nomor telepon yang dapat dihubungi.</div>
          </div>

          <div className="form-group">
            <label htmlFor="deskripsiUsaha">Deskripsi Usaha <span className="label-hint">(opsional)</span></label>
            <textarea className="form-control" id="deskripsiUsaha" placeholder="Deskripsi singkat mengenai usaha..." rows="3"></textarea>
            <div className="helper-text">Jelaskan produk atau jasa yang ditawarkan.</div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Status</label>
            <div style={{ marginTop: "var(--sp-4)" }}>
              <span className="status-preview">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /></svg>
                Menunggu Verifikasi (perlu divalidasi)
              </span>
            </div>
            <div className="helper-text">UMKM baru akan otomatis berstatus <strong>Menunggu</strong> hingga divalidasi.</div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Batal</button>
            <button type="submit" className="btn btn-primary" id="submitBtn">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              Simpan
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
