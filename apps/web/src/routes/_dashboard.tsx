import {
  createFileRoute,
  Outlet,
  redirect,
  Link,
  useNavigate,
} from '@tanstack/react-router'
import { useState } from 'react'
import {
  LayoutGrid,
  Megaphone,
  AlertTriangle,
  Store,
  Coins,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import smartLogo from '../assets/smart-logo.svg'

export const Route = createFileRoute('/_dashboard')({
  beforeLoad: () => {
    // const token = localStorage.getItem('accessToken')
    // if (!token || token === 'null') {
    //   throw redirect({ to: '/login' })
    // }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    navigate({ to: '/login' })
  }

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutGrid },
    { to: '/announcements', label: 'Announcement', icon: Megaphone },
    { to: '/complaints', label: 'Complaints', icon: AlertTriangle },
    { to: '/marketplace', label: 'Marketplace', icon: Store },
    { to: '/contributions', label: 'Contributions', icon: Coins },
  ] as const

  // Get current date formatted in Indonesian
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date().toLocaleDateString('id-ID', options)
  }

  return (
    <div className="h-screen flex bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Section */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-slate-100 flex flex-col transform transition-transform duration-300 ease-in-out h-full lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="h-16 px-6 border-b border-slate-100/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={smartLogo} alt="SMART Logo" className="w-8 h-8" />
            <span className="text-[#0047cc] font-extrabold text-base tracking-wider uppercase">
              SMART System
            </span>
          </div>
          {/* Close Sidebar Button on Mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={item.to === '/' ? { exact: true } : undefined}
              onClick={() => setIsSidebarOpen(false)}
              activeProps={{
                className:
                  'bg-[#edf4ff] text-[#0047cc] border-l-4 border-[#0047cc] font-semibold',
              }}
              inactiveProps={{
                className:
                  'border-l-4 border-transparent text-slate-600 hover:bg-slate-50/70 hover:text-slate-900',
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-r-xl transition-all text-sm font-medium"
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-[#0047cc]' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Profile & Logout Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
          <Link
            to="/profile"
            className="flex items-center gap-3 min-w-0 hover:bg-slate-100/50 p-1.5 -m-1.5 rounded-xl transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#0047cc]/10 text-[#0047cc] font-bold flex items-center justify-center text-sm shrink-0 shadow-inner">
              BS
            </div>
            <div className="min-w-0">
              <h4
                className="text-slate-800 text-sm font-semibold truncate"
                title="Budi Santoso"
              >
                Budi Santoso
              </h4>
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider truncate">
                WARGA RT 05
              </p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            title="Keluar dari sistem"
            className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:block">
              {getFormattedDate()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-slate-400">
                Selamat datang kembali,
              </span>
              <span className="text-xs font-semibold text-slate-700">
                Budi Santoso
              </span>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
