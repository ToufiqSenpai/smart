import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { wargaNav, pengurusNav, ketuaNav } from "../../data/navigation"
import { useAuth } from "../../context/AuthContext"
import { ChevronDown, Logout } from "../ui/Icons"

function NavItem({ item, currentPath }) {
  const [open, setOpen] = useState(false)
  const isActive = item.path && currentPath === item.path

  if (item.type === "link") {
    return (
      <Link
        to={item.path}
        className={`flex items-center gap-3 px-3 py-[10px] rounded-lg text-[13.5px] font-medium transition-all duration-200 mb-1 ${
          isActive
            ? "bg-white text-primary font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
              : "text-[rgba(255,255,255,0.75)] hover:bg-white/10 hover:text-white"
        }`}
      >
        {item.icon}
        <span className="nav-label">{item.label}</span>
      </Link>
    )
  }

  if (item.type === "dropdown") {
    const childActive = item.children.some((c) => currentPath === c.path)
    const expanded = childActive || open
    return (
      <div className="mb-1">
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-3 w-full px-3 py-[10px] rounded-lg text-[13.5px] font-medium transition-all duration-200 text-left font-sans ${
            expanded
              ? "bg-white text-primary font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
            : "text-[rgba(255,255,255,0.75)] hover:bg-white/10 hover:text-white"
          }`}
        >
          {item.icon}
          <span className="nav-label">{item.label}</span>
          <span className={`ml-auto transition-transform duration-250 ${expanded ? "rotate-180" : ""}`}>
            <ChevronDown className="w-[18px] h-[18px]" />
          </span>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease pl-2 ${
            expanded ? "max-h-[200px] opacity-100 py-1 pb-2" : "max-h-0 opacity-0"
          }`}
        >
          {item.children.map((child, i) => (
            <Link
              key={i}
              to={child.path}
              className={`flex items-center gap-3 px-3 py-2 ml-6 rounded-lg text-[13px] font-medium transition-all duration-200 mb-0.5 ${
                currentPath === child.path
                  ? "bg-white/15 text-white font-semibold"
                  : "text-[rgba(255,255,255,0.7)] hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{child.label}</span>
            </Link>
          ))}
        </div>
      </div>
    )
  }
  return null
}

function generateInitials(nama) {
  return (nama || '').split(' ').map(k => k.charAt(0).toUpperCase()).slice(0, 2).join('')
}

export default function DashboardLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const role = user?.role || "RESIDENT"
  const navItems = role === "CHAIRPERSON" ? ketuaNav : role === "OFFICER" ? pengurusNav : wargaNav
  const userName = user?.nama || ''
  const userRole = user?.jabatan || (role === "CHAIRPERSON" ? "Ketua RT" : role === "OFFICER" ? "Pengurus" : "Warga")
  const userInitials = generateInitials(userName)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="grid grid-cols-[280px_1fr] min-h-screen bg-canvas max-md:grid-cols-[80px_1fr] max-sm:grid-cols-1">
      <aside className="bg-primary px-6 py-8 flex flex-col justify-between sticky top-0 h-screen shadow-sidebar z-[100] overflow-y-auto max-md:px-3 max-md:py-8 max-md:items-center max-sm:hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
        <div>
          <div className="flex items-center gap-3 pb-8 border-b border-white/10 flex-shrink-0 max-md:pb-6 max-md:justify-center">
            <div className="w-8 h-8 bg-white rounded-[14px] flex items-center justify-center text-primary font-grotesk font-bold text-[13px] flex-shrink-0">
              RT
            </div>
            <div className="max-md:hidden">
              <div className="font-grotesk font-bold text-[15px] text-white tracking-tight">SMART RT</div>
              <div className="text-[8px] text-white/60 font-bold uppercase tracking-widest block mt-px">
                Administrasi Rukun Tetangga
              </div>
            </div>
          </div>
          <nav className="flex-1 mt-8 overflow-y-auto">
            {navItems.map((item, i) => (
              <NavItem key={i} item={item} currentPath={location.pathname} />
            ))}
          </nav>
        </div>
        <div className="border-t border-white/10 pt-6 flex-shrink-0 max-md:items-center max-md:pt-0">
          <div className="flex items-center gap-3 mb-4 max-md:mb-0">
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white font-semibold text-[13px] flex-shrink-0">
              {userInitials}
            </div>
            <div className="max-md:hidden">
              <div className="font-semibold text-white text-[13.5px]">{userName}</div>
              <div className="text-[11px] text-white/60">{userRole}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/60 text-[12.5px] transition-colors duration-200 hover:text-[#FF8A8A] bg-transparent border-none cursor-pointer font-sans p-0 max-md:justify-center max-md:mt-4"
          >
            <Logout className="w-[18px] h-[18px]" />
            <span className="max-md:hidden">Keluar</span>
          </button>
        </div>
      </aside>
      <main className="bg-bg overflow-y-auto max-h-screen flex flex-col">
        <div className="flex-1 w-full max-w-[1340px] mx-auto p-12 max-sm:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
