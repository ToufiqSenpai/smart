import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sidebar } from '@/components/ui/sidebar'

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

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

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
