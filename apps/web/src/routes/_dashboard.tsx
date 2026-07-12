import {
  createFileRoute,
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  LayoutGrid,
  Megaphone,
  AlertTriangle,
  Store,
  Coins,
  LogOut,
  Menu,
  X,
  Users,
  ChevronDown,
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
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const isResidentsActive = location.pathname.startsWith('/residents')
  const [isResidentsOpen, setIsResidentsOpen] = useState(isResidentsActive)

  const isAnnouncementsActive = location.pathname.startsWith('/announcements')
  const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState(
    isAnnouncementsActive,
  )

  const isComplaintsActive = location.pathname.startsWith('/complaints')
  const [isComplaintsOpen, setIsComplaintsOpen] = useState(isComplaintsActive)

  const isMarketplaceActive = location.pathname.startsWith('/marketplace')
  const [isMarketplaceOpen, setIsMarketplaceOpen] =
    useState(isMarketplaceActive)

  const isContributionsActive = location.pathname.startsWith('/contributions')
  const [isContributionsOpen, setIsContributionsOpen] = useState(
    isContributionsActive,
  )

  useEffect(() => {
    if (isResidentsActive) {
      setIsResidentsOpen(true)
    }
  }, [isResidentsActive])

  useEffect(() => {
    if (isAnnouncementsActive) {
      setIsAnnouncementsOpen(true)
    }
  }, [isAnnouncementsActive])

  useEffect(() => {
    if (isComplaintsActive) {
      setIsComplaintsOpen(true)
    }
  }, [isComplaintsActive])

  useEffect(() => {
    if (isMarketplaceActive) {
      setIsMarketplaceOpen(true)
    }
  }, [isMarketplaceActive])

  useEffect(() => {
    if (isContributionsActive) {
      setIsContributionsOpen(true)
    }
  }, [isContributionsActive])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    navigate({ to: '/login' })
  }

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
          {/* 1. Dashboard */}
          <Link
            to="/"
            activeOptions={{ exact: true }}
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
                <LayoutGrid
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-[#0047cc]' : 'text-slate-400'
                  }`}
                />
                <span>Dashboard</span>
              </>
            )}
          </Link>

          {/* 2. Collapsible Announcements Dropdown */}
          <div>
            <button
              onClick={() => setIsAnnouncementsOpen(!isAnnouncementsOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-r-xl transition-all text-sm font-medium border-l-4 cursor-pointer select-none ${
                isAnnouncementsActive
                  ? 'bg-[#edf4ff] text-[#0047cc] border-[#0047cc] font-semibold'
                  : 'border-transparent text-slate-600 hover:bg-slate-50/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Megaphone
                  className={`w-5 h-5 transition-colors ${
                    isAnnouncementsActive ? 'text-[#0047cc]' : 'text-slate-400'
                  }`}
                />
                <span>Announcement</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isAnnouncementsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isAnnouncementsOpen && (
              <div className="pl-9 pr-2 py-1.5 space-y-1 animate-[fadeIn_0.2s_ease-out]">
                <Link
                  to="/announcements"
                  activeOptions={{ exact: true }}
                  onClick={() => setIsSidebarOpen(false)}
                  activeProps={{
                    className:
                      'text-[#0047cc] font-bold bg-[#edf4ff]/50 rounded-lg',
                  }}
                  inactiveProps={{
                    className:
                      'text-slate-500 hover:text-slate-800 hover:bg-slate-50/40 rounded-lg',
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all"
                >
                  <span>Daftar Pengumuman</span>
                </Link>
                <Link
                  to="/announcements/tambah"
                  onClick={() => setIsSidebarOpen(false)}
                  activeProps={{
                    className:
                      'text-[#0047cc] font-bold bg-[#edf4ff]/50 rounded-lg',
                  }}
                  inactiveProps={{
                    className:
                      'text-slate-500 hover:text-slate-800 hover:bg-slate-50/40 rounded-lg',
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all"
                >
                  <span>Tambah Pengumuman</span>
                </Link>
              </div>
            )}
          </div>

          {/* 3. Collapsible Complaints Dropdown */}
          <div>
            <button
              onClick={() => setIsComplaintsOpen(!isComplaintsOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-r-xl transition-all text-sm font-medium border-l-4 cursor-pointer select-none ${
                isComplaintsActive
                  ? 'bg-[#edf4ff] text-[#0047cc] border-[#0047cc] font-semibold'
                  : 'border-transparent text-slate-600 hover:bg-slate-50/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle
                  className={`w-5 h-5 transition-colors ${
                    isComplaintsActive ? 'text-[#0047cc]' : 'text-slate-400'
                  }`}
                />
                <span>Complaints</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isComplaintsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isComplaintsOpen && (
              <div className="pl-9 pr-2 py-1.5 space-y-1 animate-[fadeIn_0.2s_ease-out]">
                <Link
                  to="/complaints"
                  activeOptions={{ exact: true }}
                  onClick={() => setIsSidebarOpen(false)}
                  activeProps={{
                    className:
                      'text-[#0047cc] font-bold bg-[#edf4ff]/50 rounded-lg',
                  }}
                  inactiveProps={{
                    className:
                      'text-slate-500 hover:text-slate-800 hover:bg-slate-50/40 rounded-lg',
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all"
                >
                  <span>Kirim Keluhan</span>
                </Link>
                <Link
                  to="/complaints/warga"
                  onClick={() => setIsSidebarOpen(false)}
                  activeProps={{
                    className:
                      'text-[#0047cc] font-bold bg-[#edf4ff]/50 rounded-lg',
                  }}
                  inactiveProps={{
                    className:
                      'text-slate-500 hover:text-slate-800 hover:bg-slate-50/40 rounded-lg',
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all"
                >
                  <span>Keluhan Warga</span>
                </Link>
              </div>
            )}
          </div>

          {/* 4. Collapsible Residents Dropdown */}
          <div>
            <button
              onClick={() => setIsResidentsOpen(!isResidentsOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-r-xl transition-all text-sm font-medium border-l-4 cursor-pointer select-none ${
                isResidentsActive
                  ? 'bg-[#edf4ff] text-[#0047cc] border-[#0047cc] font-semibold'
                  : 'border-transparent text-slate-600 hover:bg-slate-50/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users
                  className={`w-5 h-5 transition-colors ${
                    isResidentsActive ? 'text-[#0047cc]' : 'text-slate-400'
                  }`}
                />
                <span>Residents</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isResidentsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isResidentsOpen && (
              <div className="pl-9 pr-2 py-1.5 space-y-1 animate-[fadeIn_0.2s_ease-out]">
                <Link
                  to="/residents/warga"
                  onClick={() => setIsSidebarOpen(false)}
                  activeProps={{
                    className:
                      'text-[#0047cc] font-bold bg-[#edf4ff]/50 rounded-lg',
                  }}
                  inactiveProps={{
                    className:
                      'text-slate-500 hover:text-slate-800 hover:bg-slate-50/40 rounded-lg',
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all"
                >
                  <span>Data Warga</span>
                </Link>
                <Link
                  to="/residents/pengurus"
                  onClick={() => setIsSidebarOpen(false)}
                  activeProps={{
                    className:
                      'text-[#0047cc] font-bold bg-[#edf4ff]/50 rounded-lg',
                  }}
                  inactiveProps={{
                    className:
                      'text-slate-500 hover:text-slate-800 hover:bg-slate-50/40 rounded-lg',
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all"
                >
                  <span>Pengurus RT</span>
                </Link>
              </div>
            )}
          </div>

          {/* 5. Collapsible Marketplace Dropdown */}
          <div>
            <button
              onClick={() => setIsMarketplaceOpen(!isMarketplaceOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-r-xl transition-all text-sm font-medium border-l-4 cursor-pointer select-none ${
                isMarketplaceActive
                  ? 'bg-[#edf4ff] text-[#0047cc] border-[#0047cc] font-semibold'
                  : 'border-transparent text-slate-600 hover:bg-slate-50/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Store
                  className={`w-5 h-5 transition-colors ${
                    isMarketplaceActive ? 'text-[#0047cc]' : 'text-slate-400'
                  }`}
                />
                <span>Marketplace</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isMarketplaceOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isMarketplaceOpen && (
              <div className="pl-9 pr-2 py-1.5 space-y-1 animate-[fadeIn_0.2s_ease-out]">
                <Link
                  to="/marketplace"
                  activeOptions={{ exact: true }}
                  onClick={() => setIsSidebarOpen(false)}
                  activeProps={{
                    className:
                      'text-[#0047cc] font-bold bg-[#edf4ff]/50 rounded-lg',
                  }}
                  inactiveProps={{
                    className:
                      'text-slate-500 hover:text-slate-800 hover:bg-slate-50/40 rounded-lg',
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all"
                >
                  <span>Daftar UMKM</span>
                </Link>
                <Link
                  to="/marketplace/validasi"
                  onClick={() => setIsSidebarOpen(false)}
                  activeProps={{
                    className:
                      'text-[#0047cc] font-bold bg-[#edf4ff]/50 rounded-lg',
                  }}
                  inactiveProps={{
                    className:
                      'text-slate-500 hover:text-slate-800 hover:bg-slate-50/40 rounded-lg',
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all"
                >
                  <span>Validasi UMKM</span>
                </Link>
              </div>
            )}
          </div>

          {/* 6. Collapsible Contributions Dropdown */}
          <div>
            <button
              onClick={() => setIsContributionsOpen(!isContributionsOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-r-xl transition-all text-sm font-medium border-l-4 cursor-pointer select-none ${
                isContributionsActive
                  ? 'bg-[#edf4ff] text-[#0047cc] border-[#0047cc] font-semibold'
                  : 'border-transparent text-slate-600 hover:bg-slate-50/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Coins
                  className={`w-5 h-5 transition-colors ${
                    isContributionsActive ? 'text-[#0047cc]' : 'text-slate-400'
                  }`}
                />
                <span>Contributions</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isContributionsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isContributionsOpen && (
              <div className="pl-9 pr-2 py-1.5 space-y-1 animate-[fadeIn_0.2s_ease-out]">
                <Link
                  to="/contributions"
                  activeOptions={{ exact: true }}
                  onClick={() => setIsSidebarOpen(false)}
                  activeProps={{
                    className:
                      'text-[#0047cc] font-bold bg-[#edf4ff]/50 rounded-lg',
                  }}
                  inactiveProps={{
                    className:
                      'text-slate-500 hover:text-slate-800 hover:bg-slate-50/40 rounded-lg',
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all"
                >
                  <span>Iuran Saya</span>
                </Link>
                <Link
                  to="/contributions/kelola"
                  onClick={() => setIsSidebarOpen(false)}
                  activeProps={{
                    className:
                      'text-[#0047cc] font-bold bg-[#edf4ff]/50 rounded-lg',
                  }}
                  inactiveProps={{
                    className:
                      'text-slate-500 hover:text-slate-800 hover:bg-slate-50/40 rounded-lg',
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all"
                >
                  <span>Kelola Iuran</span>
                </Link>
                <Link
                  to="/contributions/pengeluaran"
                  onClick={() => setIsSidebarOpen(false)}
                  activeProps={{
                    className:
                      'text-[#0047cc] font-bold bg-[#edf4ff]/50 rounded-lg',
                  }}
                  inactiveProps={{
                    className:
                      'text-slate-500 hover:text-slate-800 hover:bg-slate-50/40 rounded-lg',
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all"
                >
                  <span>Pengeluaran</span>
                </Link>
              </div>
            )}
          </div>
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
