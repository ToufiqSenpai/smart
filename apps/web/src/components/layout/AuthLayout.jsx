export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <div className="bg-bg-card flex flex-col justify-between p-10 px-14 min-w-[420px] max-w-[520px] max-sm:min-w-0 max-sm:max-w-none max-sm:w-full max-sm:p-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-[14px] flex items-center justify-center text-white font-grotesk font-bold text-sm flex-shrink-0">
              RT
            </div>
            <div>
              <div className="font-grotesk font-bold text-[17px] text-text-primary tracking-tight">SMART RT</div>
              <div className="text-[9px] text-text-muted font-bold uppercase tracking-widest block mt-px">
                Administrasi Rukun Tetangga
              </div>
            </div>
          </div>
          <div className="mt-16 max-sm:mt-10">{children}</div>
        </div>
        <div className="text-text-muted text-xs mt-8">
          &copy; {new Date().getFullYear()} SMART RT. All rights reserved.
        </div>
      </div>
      <div
        className="bg-primary sticky top-0 h-screen flex-1 flex items-center p-14 text-white overflow-hidden max-sm:hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 40%, rgba(255,255,255,0.15) 0%, transparent 50%),
            radial-gradient(circle at 75% 60%, rgba(255,255,255,0.08) 0%, transparent 40%),
            radial-gradient(circle at 50% 80%, rgba(255,255,255,0.12) 0%, transparent 45%),
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 30%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 35%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 60%)
          `,
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, white 1px, transparent 0)
            `,
            backgroundSize: "24px 24px",
          }}
        />
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 flex flex-col gap-12 max-w-[500px]">
          <div>
            <h2 className="text-3xl font-bold leading-tight tracking-tight">
              Kelola Administrasi RT<br />dengan Lebih Mudah
            </h2>
            <p className="mt-4 text-white/70 text-sm leading-relaxed">
              Platform digital untuk管理 administrasi RT, mulai dari data warga, iuran, UMKM, hingga laporan keuangan.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-12 rounded-lg bg-white/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Laporan Bulanan RT 03</span>
                  <span className="text-[10px] text-white/50">PDF &bull; 2.4 MB</span>
                </div>
                <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-white/30 rounded-full" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-2xl font-bold">128</div>
                <div className="text-[11px] text-white/60 mt-0.5">Warga Terdaftar</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-2xl font-bold">Rp 8,5jt</div>
                <div className="text-[11px] text-white/60 mt-0.5">Iuran Terkumpul</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-2xl font-bold">12</div>
                <div className="text-[11px] text-white/60 mt-0.5">UMKM Aktif</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-2xl font-bold">96%</div>
                <div className="text-[11px] text-white/60 mt-0.5">Partisipasi</div>
              </div>
            </div>
          </div>
        </div>
        <svg
          className="absolute bottom-0 left-0 w-full h-auto"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ opacity: 0.08 }}
        >
          <path
            d="M0 120V60C120 20 240 0 360 20C480 40 600 80 720 90C840 100 960 80 1080 50C1200 20 1320 10 1440 30V120H0Z"
            fill="white"
          />
          <path
            d="M0 120V80C160 50 320 40 480 60C640 80 800 100 960 90C1120 80 1280 50 1440 40V120H0Z"
            fill="white"
            style={{ opacity: 0.5 }}
          />
        </svg>
      </div>
    </div>
  )
}
