import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { register } from '../../api/auth.api'

const ICONS = {
  eye: (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  eyeOff: (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a3 3 0 004.24 4.24" />
      <path d="M6.6 6.6C4.5 8 3 12 3 12s4 7 11 7c1.6 0 3-.3 4.3-.9M17.4 17.4C19.5 16 21 12 21 12s-1.2-2.1-3.2-3.8" />
    </svg>
  ),
  check: (
    <svg className="icon toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.3l2.4 2.4 4.8-5.2" />
    </svg>
  ),
  alert: (
    <svg className="icon toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="7.5" x2="12" y2="13" />
      <line x1="12" y1="16.2" x2="12" y2="16.3" />
    </svg>
  ),
  x: (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  ),
  error: (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="7.5" x2="12" y2="13" />
      <line x1="12" y1="16.2" x2="12" y2="16.3" />
    </svg>
  ),
  clock: (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
  ),
  shield: (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4.5" />
    </svg>
  ),
  checkCircle: (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.3l2.4 2.4 4.8-5.2" />
    </svg>
  ),
}

function Toast({ type, title, message, onClose }) {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => { setVisible(false); onClose() }, 5000)
    return () => clearTimeout(timer)
  }, [onClose])
  if (!visible) return null

  return (
    <div className={`toast toast-${type}`}>
      {type === "success" ? ICONS.check : ICONS.alert}
      <div className="toast-content">
        <div className="toast-title">{title}</div>
        <div className="toast-message">{message}</div>
      </div>
      <button className="toast-close" aria-label="Tutup notifikasi" onClick={() => { setVisible(false); onClose() }}>
        {ICONS.x}
      </button>
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nik: "",
    email: "",
    nama: "",
    alamat: "",
    noHp: "",
    username: "",
    password: "",
    passwordConfirm: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState([])

  const addToast = (type, title, message) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, type, title, message }])
  }
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!/^\d{16}$/.test(form.nik)) newErrors.nik = "NIK harus 16 digit angka"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Email tidak valid"
    if (!form.nama.trim()) newErrors.nama = "Nama lengkap harus diisi"
    if (!form.alamat.trim()) newErrors.alamat = "Alamat harus diisi"
    if (!form.noHp.trim()) newErrors.noHp = "No. HP harus diisi"
    if (form.username.trim().length < 3) newErrors.username = "Username min. 3 karakter"
    if (form.password.length < 8) newErrors.password = "Password minimal 8 karakter"
    if (form.password !== form.passwordConfirm || form.passwordConfirm.length < 8) newErrors.passwordConfirm = "Password tidak cocok"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    if (!validate()) return

    setLoading(true)
    try {
      await register({
        nik: form.nik,
        email: form.email,
        nama: form.nama,
        alamat: form.alamat,
        noHp: form.noHp,
        username: form.username,
        password: form.password,
      })
      addToast("success", "Pendaftaran berhasil!", "Data Anda telah dikirim. Tunggu verifikasi dari Ketua RT.")
      setForm({ nik: "", email: "", nama: "", alamat: "", noHp: "", username: "", password: "", passwordConfirm: "" })
      setTimeout(() => navigate("/login"), 2500)
    } catch (err) {
      const msg = err?.message || "Gagal mendaftar, coba lagi."
      addToast("error", "Gagal mendaftar", msg)
    } finally {
      setLoading(false)
    }
  }

  const handleNikChange = (e) => {
    const val = e.target.value.replace(/\D/g, "")
    setForm((prev) => ({ ...prev, nik: val }))
    if (val.length === 16) {
      setErrors((prev) => ({ ...prev, nik: undefined }))
    }
  }

  const handleNikBlur = (e) => {
    const val = e.target.value
    if (val.length > 0 && val.length < 16) {
      setErrors((prev) => ({ ...prev, nik: "NIK harus 16 digit angka" }))
    }
  }

  const handlePasswordChange = (e) => {
    const val = e.target.value
    setForm((prev) => ({ ...prev, password: val }))
    if (val.length >= 8) setErrors((prev) => ({ ...prev, password: undefined }))
    if (form.passwordConfirm && val !== form.passwordConfirm) {
      setErrors((prev) => ({ ...prev, passwordConfirm: "Password tidak cocok" }))
    } else if (form.passwordConfirm) {
      setErrors((prev) => ({ ...prev, passwordConfirm: undefined }))
    }
  }

  const handlePasswordConfirmChange = (e) => {
    const val = e.target.value
    setForm((prev) => ({ ...prev, passwordConfirm: val }))
    if (val === form.password && val.length >= 8) {
      setErrors((prev) => ({ ...prev, passwordConfirm: undefined }))
    }
  }

  return (
    <>
      <style>{`
        :root {
            --navy-900: #0A1F3D;
            --navy-700: #123A66;
            --navy-500: #1E4B85;
            --navy-100: #E7EEF6;
            --white: #FFFFFF;
            --bg-canvas: #F5F7FA;
            --ink-900: #10192B;
            --ink-600: #4A5568;
            --ink-400: #8A94A6;
            --border: #E1E5EB;
            --gold-seal: #B8863B;
            --status-green: #1F8A5F;
            --status-green-bg: #E4F5EC;
            --status-amber: #B7791F;
            --status-amber-bg: #FBF0DC;
            --status-red: #C0392B;
            --status-red-bg: #FBE8E6;
            --radius-sm: 6px;
            --radius-md: 10px;
            --radius-lg: 12px;
            --shadow-sm: 0 2px 8px rgba(16, 25, 43, 0.06);
            --shadow-md: 0 8px 24px rgba(16, 25, 43, 0.14);
            --sp-4: 4px; --sp-8: 8px; --sp-12: 12px; --sp-16: 16px;
            --sp-24: 24px; --sp-32: 32px; --sp-48: 48px; --sp-64: 64px;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; }
        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--bg-canvas);
            color: var(--ink-600);
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
        }
        .icon { width: 18px; height: 18px; flex-shrink: 0; display: inline-block; }
        .auth-shell {
            display: grid;
            grid-template-columns: minmax(440px, 560px) 1fr;
            min-height: 100vh;
        }
        .auth-form-panel {
            background: var(--white);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 40px 56px;
        }
        .brand-lockup { display: flex; align-items: center; gap: var(--sp-12); flex: 0 0 auto; }
        .brand-mark {
            width: 40px; height: 40px;
            background: var(--navy-700);
            border-radius: var(--radius-sm);
            display: flex; align-items: center; justify-content: center;
            color: var(--white);
            font-family: 'Space Grotesk', monospace;
            font-weight: 700; font-size: 15px;
            flex-shrink: 0;
        }
        .brand-name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; color: var(--navy-900); letter-spacing: -0.2px; }
        .brand-tagline { font-size: 10px; color: var(--ink-400); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-top: 1px; }
        .auth-form-wrap {
            flex: 1 1 auto;
            max-width: 420px;
            width: 100%;
            margin: 0 auto;
            padding: var(--sp-32) 0;
        }
        .eyebrow {
            font-size: 12px; font-weight: 600; text-transform: uppercase;
            letter-spacing: 0.08em; color: var(--gold-seal); margin-bottom: var(--sp-8);
        }
        .auth-form-wrap h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 26px; font-weight: 700; color: var(--ink-900);
            letter-spacing: -0.4px; margin-bottom: var(--sp-8);
        }
        .form-lead { font-size: 14px; color: var(--ink-600); margin-bottom: var(--sp-24); }
        .panel-footnote { font-size: 12px; color: var(--ink-400); flex: 0 0 auto; }
        .form-group { margin-bottom: var(--sp-16); }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--ink-900); margin-bottom: var(--sp-4); }
        .label-hint { font-weight: 400; color: var(--ink-400); font-size: 12px; }
        .form-control {
            width: 100%; height: 44px; padding: 10px 14px;
            font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; color: var(--ink-900);
            background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm);
            transition: border-color .15s ease, box-shadow .15s ease; outline: none;
        }
        .form-control::placeholder { color: var(--ink-400); }
        .form-control:focus { border-color: var(--navy-700); box-shadow: 0 0 0 3px var(--navy-100); }
        .form-control.error { border-color: var(--status-red); }
        .form-control.error:focus { box-shadow: 0 0 0 3px var(--status-red-bg); }
        .form-control--success { border-color: var(--status-green); }
        .form-control--success:focus { box-shadow: 0 0 0 3px var(--status-green-bg); }
        textarea.form-control { height: auto; min-height: 72px; padding-top: 10px; resize: vertical; font-family: 'Plus Jakarta Sans', sans-serif; }
        .error-text { font-size: 12px; color: var(--status-red); margin-top: var(--sp-4); display: none; align-items: center; gap: 6px; }
        .error-text.show { display: flex; }
        .error-text .icon { width: 14px; height: 14px; }
        .helper-text { font-size: 12px; color: var(--ink-400); margin-top: var(--sp-4); }
        .password-wrapper { position: relative; }
        .password-wrapper .form-control { padding-right: 44px; }
        .password-toggle {
            position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
            background: none; border: none; color: var(--ink-400); cursor: pointer;
            padding: 6px; display: flex; border-radius: 6px;
        }
        .password-toggle:hover { color: var(--navy-700); background: var(--navy-100); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-16); }
        .btn {
            display: inline-flex; align-items: center; justify-content: center; gap: var(--sp-8);
            padding: 10px 24px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600;
            border: none; border-radius: var(--radius-sm); cursor: pointer;
            transition: background .15s ease, color .15s ease, border-color .15s ease;
            min-height: 44px; width: 100%; margin-top: var(--sp-4);
        }
        .btn-primary { background: var(--navy-700); color: var(--white); }
        .btn-primary:hover { background: var(--navy-500); }
        .btn-primary:disabled { background: var(--ink-400); opacity: .55; cursor: not-allowed; }
        .register-footer { margin-top: var(--sp-24); text-align: center; font-size: 13px; color: var(--ink-600); }
        .register-footer a { color: var(--navy-700); font-weight: 600; text-decoration: none; }
        .register-footer a:hover { text-decoration: underline; }
        .status-badge {
            display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px;
            border-radius: var(--radius-sm); font-size: 12px; font-weight: 600;
            background: var(--status-amber-bg); color: var(--status-amber); margin-top: var(--sp-16);
        }
        .status-badge .icon { width: 14px; height: 14px; }
        .status-note { font-size: 12px; color: var(--ink-400); margin-top: var(--sp-4); }
        .auth-visual-panel {
            position: sticky; top: 0; height: 100vh;
            background: var(--navy-900);
            overflow: hidden;
            display: flex; align-items: center;
            padding: 56px;
            color: var(--white);
        }
        .visual-bg-grid {
            position: absolute; inset: 0;
            background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
            background-size: 22px 22px;
        }
        .visual-glow {
            position: absolute; top: -140px; right: -120px;
            width: 460px; height: 460px; border-radius: 50%;
            background: radial-gradient(circle, rgba(30,75,133,0.55), transparent 70%);
        }
        .visual-content { position: relative; z-index: 2; max-width: 420px; }
        .visual-eyebrow {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 11px; font-weight: 500; text-transform: uppercase;
            letter-spacing: 0.1em; color: var(--navy-100); opacity: .75; margin-bottom: var(--sp-16);
        }
        .visual-headline {
            font-family: 'Space Grotesk', sans-serif; font-weight: 600;
            font-size: 32px; line-height: 1.2; letter-spacing: -0.5px;
            margin-bottom: var(--sp-16);
        }
        .visual-sub { font-size: 14.5px; line-height: 1.6; color: var(--navy-100); opacity: .82; max-width: 360px; }
        .doc-mock {
            position: relative;
            background: var(--white); color: var(--ink-900);
            border-radius: var(--radius-md);
            width: 260px; padding: 22px 20px 18px;
            box-shadow: 0 28px 48px rgba(0,0,0,0.35);
            transform: rotate(-4deg);
            margin: 36px 0 32px;
        }
        .doc-mock__bar { height: 2px; background: var(--navy-700); width: 42%; position: relative; margin-bottom: 5px; }
        .doc-mock__bar::after { content: ''; position: absolute; top: 4px; left: 0; right: 0; height: 1px; background: var(--navy-700); }
        .doc-mock__label { font-size: 9px; letter-spacing: 0.08em; color: var(--ink-400); text-transform: uppercase; margin: 12px 0 10px; font-weight: 600; }
        .doc-mock__line { height: 7px; background: var(--border); border-radius: 4px; margin-bottom: 8px; }
        .doc-mock__nik {
            font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--ink-900); font-weight: 500;
            margin-top: 4px; letter-spacing: 0.02em;
        }
        .doc-mock__reg {
            font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: var(--ink-600);
            margin-top: 14px; padding-top: 12px; border-top: 1px dashed var(--border);
        }
        .doc-mock__seal {
            position: absolute; top: -16px; right: -16px; width: 68px; height: 68px; border-radius: 50%;
            border: 1.5px dashed var(--status-amber);
            background: var(--status-amber-bg); color: var(--status-amber);
            display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
            transform: rotate(-9deg);
        }
        .doc-mock__seal span { font-family: 'Space Grotesk', sans-serif; font-size: 8px; font-weight: 700; letter-spacing: 0.03em; }
        .doc-mock__seal .icon { width: 16px; height: 16px; }
        .visual-stats { display: flex; flex-direction: column; gap: var(--sp-16); }
        .stat-row { display: flex; align-items: flex-start; gap: 12px; padding-top: var(--sp-16); border-top: 1px solid rgba(255,255,255,0.12); }
        .stat-row:first-child { border-top: none; padding-top: 0; }
        .stat-row .icon { width: 18px; height: 18px; color: var(--navy-100); opacity: .8; margin-top: 2px; }
        .stat-num { font-family: 'IBM Plex Mono', monospace; font-weight: 500; font-size: 14px; color: var(--white); margin-right: 8px; }
        .stat-label { font-size: 13px; color: var(--navy-100); opacity: .78; }
        .skyline { position: absolute; bottom: 0; left: 0; width: 100%; height: 84px; opacity: .5; z-index: 1; }
        .toast-container { position: fixed; top: var(--sp-24); right: var(--sp-24); z-index: 1000; display: flex; flex-direction: column; gap: var(--sp-8); max-width: 380px; width: 100%; }
        .toast { display: flex; align-items: flex-start; gap: var(--sp-12); padding: var(--sp-16); background: var(--white); border-radius: var(--radius-sm); box-shadow: var(--shadow-md); border: 1px solid var(--border); border-left: 3px solid var(--navy-700); animation: slideIn .2s ease-out; }
        .toast-success { border-left-color: var(--status-green); }
        .toast-error { border-left-color: var(--status-red); }
        .toast-success .toast-icon { color: var(--status-green); }
        .toast-error .toast-icon { color: var(--status-red); }
        .toast-icon { flex-shrink: 0; margin-top: 1px; }
        .toast-content { flex: 1; font-size: 13px; line-height: 1.4; }
        .toast-content .toast-title { font-weight: 600; color: var(--ink-900); }
        .toast-content .toast-message { color: var(--ink-600); }
        .toast-close { background: none; border: none; color: var(--ink-400); cursor: pointer; padding: 2px; flex-shrink: 0; display: flex; }
        .toast-close:hover { color: var(--ink-900); }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px) scale(.98); } to { opacity: 1; transform: translateX(0) scale(1); } }
        @media (max-width: 960px) {
            .auth-shell { grid-template-columns: 1fr; }
            .auth-visual-panel { display: none; }
            .auth-form-panel { padding: 28px 20px; }
        }
        @media (max-width: 640px) {
            .form-row { grid-template-columns: 1fr; gap: 0; }
            .toast-container { top: var(--sp-12); right: var(--sp-12); left: var(--sp-12); max-width: none; }
        }
        @media (prefers-reduced-motion: reduce) {
            .toast { animation: none; }
        }
        :focus-visible { outline: 2px solid var(--navy-700); outline-offset: 2px; }
      `}</style>

      <div className="toast-container">
        {toasts.map((t) => (
          <Toast key={t.id} type={t.type} title={t.title} message={t.message} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <div className="auth-shell">
        <section className="auth-form-panel">
          <div className="brand-lockup">
            <div className="brand-mark">RT</div>
            <div>
              <span className="brand-name">SMART RT</span>
              <span className="brand-tagline">Administrasi Rukun Tetangga</span>
            </div>
          </div>

          <div className="auth-form-wrap">
            <p className="eyebrow">Pendaftaran</p>
            <h1>Daftar sebagai Warga</h1>
            <p className="form-lead">Isi data sekali, diverifikasi langsung oleh Ketua RT.</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="nik">NIK <span className="label-hint">(16 digit)</span></label>
                <input
                  type="text"
                  id="nik"
                  className={`form-control${errors.nik ? " error" : form.nik.length === 16 ? " form-control--success" : ""}`}
                  placeholder="Masukkan NIK 16 digit"
                  maxLength="16"
                  inputMode="numeric"
                  pattern="[0-9]{16}"
                  required
                  value={form.nik}
                  onChange={handleNikChange}
                  onBlur={handleNikBlur}
                />
                <div className={`error-text${errors.nik ? " show" : ""}`}>
                  {ICONS.error}
                  <span>NIK harus 16 digit angka</span>
                </div>
                <div className="helper-text">Contoh: 3171020101900001</div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className={`form-control${errors.email ? " error" : ""}`}
                  placeholder="contoh@email.com"
                  required
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
                <div className={`error-text${errors.email ? " show" : ""}`}>
                  {ICONS.error}
                  <span>Email tidak valid</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="nama">Nama Lengkap</label>
                <input
                  type="text"
                  id="nama"
                  className={`form-control${errors.nama ? " error" : ""}`}
                  placeholder="Masukkan nama lengkap"
                  required
                  value={form.nama}
                  onChange={(e) => updateField("nama", e.target.value)}
                />
                <div className={`error-text${errors.nama ? " show" : ""}`}>
                  {ICONS.error}
                  <span>Nama lengkap harus diisi</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="alamat">Alamat</label>
                <textarea
                  id="alamat"
                  className={`form-control${errors.alamat ? " error" : ""}`}
                  placeholder="Contoh: Jl. Mawar No. 12, RT 08/RW 03"
                  rows="2"
                  required
                  value={form.alamat}
                  onChange={(e) => updateField("alamat", e.target.value)}
                />
                <div className={`error-text${errors.alamat ? " show" : ""}`}>
                  {ICONS.error}
                  <span>Alamat harus diisi</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="noHp">No. HP</label>
                  <input
                    type="tel"
                    id="noHp"
                    className={`form-control${errors.noHp ? " error" : ""}`}
                    placeholder="081234567890"
                    required
                    value={form.noHp}
                    onChange={(e) => updateField("noHp", e.target.value)}
                  />
                  <div className={`error-text${errors.noHp ? " show" : ""}`}>
                    {ICONS.error}
                    <span>No. HP harus diisi</span>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    className={`form-control${errors.username ? " error" : ""}`}
                    placeholder="Pilih username"
                    autoComplete="username"
                    required
                    value={form.username}
                    onChange={(e) => updateField("username", e.target.value)}
                  />
                  <div className={`error-text${errors.username ? " show" : ""}`}>
                    {ICONS.error}
                    <span>Username min. 3 karakter</span>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password <span className="label-hint">(min. 8 karakter)</span></label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className={`form-control${errors.password ? " error" : ""}`}
                      placeholder="Buat password"
                      autoComplete="new-password"
                      required
                      value={form.password}
                      onChange={handlePasswordChange}
                    />
                    <button type="button" className="password-toggle" aria-label="Tampilkan password" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? ICONS.eyeOff : ICONS.eye}
                    </button>
                  </div>
                  <div className={`error-text${errors.password ? " show" : ""}`}>
                    {ICONS.error}
                    <span>Password minimal 8 karakter</span>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="passwordConfirm">Konfirmasi Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showPasswordConfirm ? "text" : "password"}
                      id="passwordConfirm"
                      className={`form-control${errors.passwordConfirm ? " error" : form.passwordConfirm && form.passwordConfirm === form.password && form.passwordConfirm.length >= 8 ? " form-control--success" : ""}`}
                      placeholder="Ulangi password"
                      autoComplete="new-password"
                      required
                      value={form.passwordConfirm}
                      onChange={handlePasswordConfirmChange}
                    />
                    <button type="button" className="password-toggle" aria-label="Tampilkan password" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                      {showPasswordConfirm ? ICONS.eyeOff : ICONS.eye}
                    </button>
                  </div>
                  <div className={`error-text${errors.passwordConfirm ? " show" : ""}`}>
                    {ICONS.error}
                    <span>Password tidak cocok</span>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Mendaftar..." : "Daftar"}
              </button>

              <div>
                <span className="status-badge">
                  {ICONS.clock}
                  Status: Menunggu Verifikasi
                </span>
                <p className="status-note">Setelah mendaftar, data Anda akan diverifikasi oleh Ketua RT.</p>
              </div>
            </form>

            <div className="register-footer">
              Sudah punya akun?
              <Link to="/login">Masuk di sini</Link>
            </div>
          </div>

          <p className="panel-footnote">&copy; 2026 SMART RT &middot; RT 08</p>
        </section>

        <aside className="auth-visual-panel" aria-hidden="true">
          <div className="visual-bg-grid"></div>
          <div className="visual-glow"></div>

          <div className="visual-content">
            <p className="visual-eyebrow">Pendaftaran Warga Baru</p>
            <h2 className="visual-headline">Jadi Bagian dari<br />Warga Terdaftar RT 08</h2>
            <p className="visual-sub">Isi data sekali, diverifikasi langsung oleh Ketua RT, lalu akses semua layanan digital RT Anda.</p>

            <div className="doc-mock">
              <div className="doc-mock__bar"></div>
              <p className="doc-mock__label">Formulir Registrasi</p>
              <div className="doc-mock__line" style={{ width: "80%" }}></div>
              <div className="doc-mock__nik">3171 02&bull;&bull; &bull;&bull;&bull;&bull; 0007</div>
              <div className="doc-mock__reg">Diajukan &middot; menunggu verifikasi Ketua RT</div>
              <div className="doc-mock__seal">
                {ICONS.clock}
                <span>PROSES</span>
              </div>
            </div>

            <div className="visual-stats">
              <div className="stat-row">
                {ICONS.shield}
                <div><span className="stat-num">16</span><span className="stat-label">digit NIK Anda terenkripsi & tidak dipakai publik</span></div>
              </div>
              <div className="stat-row">
                {ICONS.checkCircle}
                <div><span className="stat-num">Ketua RT</span><span className="stat-label">memverifikasi setiap pendaftaran warga baru</span></div>
              </div>
              <div className="stat-row">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
                <div><span className="stat-num">19</span><span className="stat-label">modul layanan langsung aktif setelah disetujui</span></div>
              </div>
            </div>
          </div>

          <svg className="skyline" viewBox="0 0 800 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="0,90 0,55 30,55 30,38 55,20 80,38 80,55 110,55 110,90" fill="var(--navy-500)" />
            <polygon points="120,90 120,45 150,45 150,28 175,12 200,28 200,45 235,45 235,90" fill="var(--navy-700)" />
            <polygon points="245,90 245,60 270,60 270,42 292,26 314,42 314,60 345,60 345,90" fill="var(--navy-500)" />
            <polygon points="360,90 360,50 400,50 400,32 425,16 450,32 450,50 495,50 495,90" fill="var(--navy-700)" />
            <polygon points="505,90 505,58 530,58 530,40 552,24 574,40 574,58 605,58 605,90" fill="var(--navy-500)" />
            <polygon points="620,90 620,46 660,46 660,30 685,14 710,30 710,46 750,46 750,90" fill="var(--navy-700)" />
            <polygon points="760,90 760,60 785,60 785,44 800,32 800,90" fill="var(--navy-500)" />
          </svg>
        </aside>
      </div>
    </>
  )
}
