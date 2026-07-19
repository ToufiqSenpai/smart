import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

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
}

function Toast({ type, title, message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`toast toast-${type}`}>
      {type === "success" ? ICONS.check : ICONS.alert}
      <div className="toast-content">
        <div className="toast-title">{title}</div>
        <div className="toast-message">{message}</div>
      </div>
      <button className="toast-close" aria-label="Tutup notifikasi" onClick={onClose}>
        {ICONS.x}
      </button>
    </div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const auth = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
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

  const validate = () => {
    const newErrors = {}
    if (!email.trim()) newErrors.email = "Email harus diisi"
    if (!password.trim()) newErrors.password = "Password harus diisi"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    if (!validate()) return

    setLoading(true)

    try {
      await auth.login({ email: email.trim(), password: password.trim() })
      addToast("success", "Berhasil masuk!", "Selamat datang di SMART RT.")
      setTimeout(() => navigate("/dashboard"), 800)
    } catch (err) {
      addToast("error", "Gagal masuk", err.message)
      setLoading(false)
      setErrors({ email: " ", password: " " })
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
            grid-template-columns: minmax(420px, 520px) 1fr;
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
            display: flex;
            flex-direction: column;
            justify-content: center;
            max-width: 400px;
            width: 100%;
            margin: 0 auto;
            padding: var(--sp-48) 0;
        }
        .eyebrow {
            font-size: 12px; font-weight: 600; text-transform: uppercase;
            letter-spacing: 0.08em; color: var(--gold-seal); margin-bottom: var(--sp-8);
        }
        .auth-form-wrap h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 28px; font-weight: 700; color: var(--ink-900);
            letter-spacing: -0.4px; margin-bottom: var(--sp-8);
        }
        .form-lead { font-size: 14px; color: var(--ink-600); margin-bottom: var(--sp-32); }
        .panel-footnote { font-size: 12px; color: var(--ink-400); flex: 0 0 auto; }
        .form-group { margin-bottom: var(--sp-16); }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--ink-900); margin-bottom: var(--sp-4); }
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
        .error-text {
            font-size: 12px; color: var(--status-red); margin-top: var(--sp-4);
            display: none; align-items: center; gap: 6px;
        }
        .error-text.show { display: flex; }
        .error-text .icon { width: 14px; height: 14px; }
        .password-wrapper { position: relative; }
        .password-wrapper .form-control { padding-right: 44px; }
        .password-toggle {
            position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
            background: none; border: none; color: var(--ink-400); cursor: pointer;
            padding: 6px; display: flex; border-radius: 6px;
        }
        .password-toggle:hover { color: var(--navy-700); background: var(--navy-100); }
        .btn {
            display: inline-flex; align-items: center; justify-content: center; gap: var(--sp-8);
            padding: 10px 24px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600;
            border: none; border-radius: var(--radius-sm); cursor: pointer;
            transition: background .15s ease, color .15s ease, border-color .15s ease;
            min-height: 44px; width: 100%; margin-top: var(--sp-8);
        }
        .btn-primary { background: var(--navy-700); color: var(--white); }
        .btn-primary:hover { background: var(--navy-500); }
        .btn-primary:disabled { background: var(--ink-400); opacity: .55; cursor: not-allowed; }
        .login-footer { margin-top: var(--sp-24); text-align: center; font-size: 13px; color: var(--ink-600); }
        .login-footer a { color: var(--navy-700); font-weight: 600; text-decoration: none; }
        .login-footer a:hover { text-decoration: underline; }
        .login-footer .divider { color: var(--border); margin: 0 var(--sp-8); }
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
            font-size: 34px; line-height: 1.18; letter-spacing: -0.5px;
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
            margin: 40px 0 36px;
        }
        .doc-mock__bar { height: 2px; background: var(--navy-700); width: 42%; position: relative; margin-bottom: 5px; }
        .doc-mock__bar::after { content: ''; position: absolute; top: 4px; left: 0; right: 0; height: 1px; background: var(--navy-700); }
        .doc-mock__label { font-size: 9px; letter-spacing: 0.08em; color: var(--ink-400); text-transform: uppercase; margin: 12px 0 10px; font-weight: 600; }
        .doc-mock__line { height: 7px; background: var(--border); border-radius: 4px; margin-bottom: 8px; }
        .doc-mock__reg {
            font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: var(--ink-600);
            margin-top: 14px; padding-top: 12px; border-top: 1px dashed var(--border);
        }
        .doc-mock__seal {
            position: absolute; top: -16px; right: -16px; width: 68px; height: 68px; border-radius: 50%;
            border: 1.5px dashed var(--status-green);
            background: var(--status-green-bg); color: var(--status-green);
            display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
            transform: rotate(-9deg);
        }
        .doc-mock__seal span {
            font-family: 'Space Grotesk', sans-serif; font-size: 8px; font-weight: 700; letter-spacing: 0.03em;
        }
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
            .auth-form-wrap { padding: var(--sp-32) 0; }
        }
        @media (max-width: 480px) {
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
            <p className="eyebrow">Akses Sistem</p>
            <h1>Masuk ke SMART RT</h1>
            <p className="form-lead">Pantau iuran, laporan kendala, dan pengumuman RT Anda dalam satu sistem.</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className={`form-control${errors.email ? " error" : ""}`}
                  placeholder="Masukkan email Anda"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (e.target.value.trim()) setErrors((prev) => ({ ...prev, email: undefined })) }}
                  onBlur={(e) => { if (!e.target.value.trim()) setErrors((prev) => ({ ...prev, email: "Email harus diisi" })) }}
                />
                <div className={`error-text${errors.email ? " show" : ""}`}>
                  {ICONS.error}
                  <span>Email harus diisi</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`form-control${errors.password ? " error" : ""}`}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (e.target.value.trim()) setErrors((prev) => ({ ...prev, password: undefined })) }}
                  />
                  <button type="button" className="password-toggle" aria-label="Tampilkan password" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? ICONS.eyeOff : ICONS.eye}
                  </button>
                </div>
                <div className={`error-text${errors.password ? " show" : ""}`}>
                  {ICONS.error}
                  <span>Password harus diisi</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </form>

            <div className="login-footer">
              Belum punya akun?
              <Link to="/register">Daftar di sini</Link>
              <span className="divider">|</span>
              <a href="#">Lupa password?</a>
            </div>
          </div>

          <p className="panel-footnote">&copy; 2026 SMART RT &middot; RT 08</p>
        </section>

        <aside className="auth-visual-panel" aria-hidden="true">
          <div className="visual-bg-grid"></div>
          <div className="visual-glow"></div>

          <div className="visual-content">
            <p className="visual-eyebrow">Sistem Administrasi RT &middot; Digital</p>
            <h2 className="visual-headline">Satu Pintu untuk<br />Semua Urusan RT Anda</h2>
            <p className="visual-sub">Iuran, laporan kendala, dan pengumuman warga — tercatat rapi, bisa dipantau kapan saja.</p>

            <div className="doc-mock">
              <div className="doc-mock__bar"></div>
              <p className="doc-mock__label">Laporan Kendala</p>
              <div className="doc-mock__line" style={{ width: "88%" }}></div>
              <div className="doc-mock__line" style={{ width: "65%" }}></div>
              <div className="doc-mock__line" style={{ width: "74%" }}></div>
              <div className="doc-mock__reg">007/KEND/RT08/VII/2026</div>
              <div className="doc-mock__seal">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span>SAH</span>
              </div>
            </div>

            <div className="visual-stats">
              <div className="stat-row">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
                <div><span className="stat-num">19</span><span className="stat-label">modul layanan warga & pengurus dalam satu sistem</span></div>
              </div>
              <div className="stat-row">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="8" r="3" />
                  <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                  <circle cx="17" cy="9" r="2.5" />
                  <path d="M15 14.5c2.5.3 4.5 2.3 4.8 5.5" />
                </svg>
                <div><span className="stat-num">3</span><span className="stat-label">tingkat akses: Warga, Pengurus, dan Ketua RT</span></div>
              </div>
              <div className="stat-row">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="20" x2="5" y2="12" />
                  <line x1="12" y1="20" x2="12" y2="6" />
                  <line x1="19" y1="20" x2="19" y2="15" />
                </svg>
                <div><span className="stat-num">100%</span><span className="stat-label">transparan — laporan & kas RT real-time</span></div>
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
