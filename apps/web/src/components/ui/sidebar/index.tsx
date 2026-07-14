import { useState, useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import {
  LayoutGrid,
  Megaphone,
  AlertTriangle,
  Store,
  Coins,
  LogOut,
  Users,
  ChevronDown,
  X,
  type LucideIcon,
} from 'lucide-react'
import smartLogo from '@/assets/smart-logo.svg'

interface NavSubItem {
  label: string
  to: string
  exact?: boolean
}

interface NavSection {
  label: string
  icon: LucideIcon
  basePath: string
  items: NavSubItem[]
}

const navSections: NavSection[] = [
  {
    label: 'Pengumuman',
    icon: Megaphone,
    basePath: '/announcements',
    items: [
      { label: 'Daftar Pengumuman', to: '/announcements', exact: true },
      { label: 'Tambah Pengumuman', to: '/announcements/tambah' },
    ],
  },
  {
    label: 'Keluhan',
    icon: AlertTriangle,
    basePath: '/complaints',
    items: [
      { label: 'Kirim Keluhan', to: '/complaints', exact: true },
      { label: 'Keluhan Warga', to: '/complaints/warga' },
    ],
  },
  {
    label: 'Warga',
    icon: Users,
    basePath: '/residents',
    items: [
      { label: 'Data Warga', to: '/residents/warga' },
      { label: 'Pengurus RT', to: '/residents/pengurus' },
    ],
  },
  {
    label: 'Pasar Warga',
    icon: Store,
    basePath: '/marketplace',
    items: [
      { label: 'Daftar UMKM', to: '/marketplace', exact: true },
      { label: 'Validasi UMKM', to: '/marketplace/validasi' },
    ],
  },
  {
    label: 'Iuran',
    icon: Coins,
    basePath: '/contributions',
    items: [
      { label: 'Iuran Saya', to: '/contributions', exact: true },
      { label: 'Kelola Iuran', to: '/contributions/kelola' },
      { label: 'Pengeluaran', to: '/contributions/pengeluaran' },
    ],
  },
]

function SidebarNavLink({
  item,
  onClose,
}: {
  item: NavSubItem
  onClose: () => void
}) {
  return (
    <Link
      to={item.to}
      {...(item.exact ? { activeOptions: { exact: true } } : {})}
      onClick={onClose}
      activeProps={{
        className: 'text-[#0047cc] font-bold bg-[#edf4ff]/50 rounded-lg',
      }}
      inactiveProps={{
        className:
          'text-slate-500 hover:text-slate-800 hover:bg-slate-50/40 rounded-lg',
      }}
      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all"
    >
      <span>{item.label}</span>
    </Link>
  )
}

function SidebarCollapsible({
  section,
  onClose,
}: {
  section: NavSection
  onClose: () => void
}) {
  const location = useLocation()
  const isActive = location.pathname.startsWith(section.basePath)
  const [isOpen, setIsOpen] = useState(isActive)

  useEffect(() => {
    if (isActive) setIsOpen(true)
  }, [isActive])

  const Icon = section.icon

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-r-xl transition-all text-sm font-medium border-l-4 cursor-pointer select-none ${
          isActive
            ? 'bg-[#edf4ff] text-[#0047cc] border-[#0047cc] font-semibold'
            : 'border-transparent text-slate-600 hover:bg-slate-50/70 hover:text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon
            className={`w-5 h-5 transition-colors ${
              isActive ? 'text-[#0047cc]' : 'text-slate-400'
            }`}
          />
          <span>{section.label}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="pl-9 pr-2 py-1.5 space-y-1 animate-[fadeIn_0.2s_ease-out]">
          {section.items.map((item) => (
            <SidebarNavLink key={item.to} item={item} onClose={onClose} />
          ))}
        </div>
      )}
    </div>
  )
}

function SidebarDashboardLink({ onClose }: { onClose: () => void }) {
  return (
    <Link
      to="/"
      activeOptions={{ exact: true }}
      onClick={onClose}
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
  )
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
}

export function Sidebar({ isOpen, onClose, onLogout }: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-slate-100 flex flex-col transform transition-transform duration-300 ease-in-out h-full lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-16 px-6 border-b border-slate-100/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={smartLogo} alt="SMART Logo" className="w-8 h-8" />
          <span className="text-[#0047cc] font-extrabold text-base tracking-wider uppercase">
            SMART System
          </span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <SidebarDashboardLink onClose={onClose} />
        {navSections.map((section) => (
          <SidebarCollapsible
            key={section.basePath}
            section={section}
            onClose={onClose}
          />
        ))}
      </nav>

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
          onClick={onLogout}
          title="Keluar dari sistem"
          className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50/50 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  )
}
