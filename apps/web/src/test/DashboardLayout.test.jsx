import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'

const mockUseAuth = vi.hoisted(() => vi.fn())
const mockUseLocation = vi.hoisted(() => vi.fn())
const mockUseNavigate = vi.hoisted(() => vi.fn())

vi.mock('../context/AuthContext', () => ({
  useAuth: mockUseAuth,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: mockUseLocation,
    useNavigate: () => mockUseNavigate,
  }
})

const defaultUser = {
  nama: 'Budi Santoso',
  role: 'RESIDENT',
  jabatan: null,
}

function renderWithRouter(children, { initialEntries = ['/dashboard'] } = {}) {
  mockUseLocation.mockReturnValue({ pathname: initialEntries[0] })
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {children}
    </MemoryRouter>
  )
}

describe('DashboardLayout', () => {
  afterEach(() => {
    mockUseAuth.mockReset()
    mockUseLocation.mockReset()
    mockUseNavigate.mockReset()
  })

  it('renders SMART RT branding in sidebar', () => {
    mockUseAuth.mockReturnValue({ user: defaultUser, logout: vi.fn() })
    renderWithRouter(<DashboardLayout><div>Content</div></DashboardLayout>)
    const rtElements = screen.getAllByText('RT')
    expect(rtElements.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('SMART RT')).toBeInTheDocument()
  })

  it('renders children main content', () => {
    mockUseAuth.mockReturnValue({ user: defaultUser, logout: vi.fn() })
    renderWithRouter(<DashboardLayout><div>Main Content</div></DashboardLayout>)
    expect(screen.getByText('Main Content')).toBeInTheDocument()
  })

  it('shows user name and role in sidebar', () => {
    mockUseAuth.mockReturnValue({ user: defaultUser, logout: vi.fn() })
    renderWithRouter(<DashboardLayout><div /></DashboardLayout>)
    expect(screen.getByText('Budi Santoso')).toBeInTheDocument()
    expect(screen.getByText('Warga')).toBeInTheDocument()
  })

  it('shows user initials', () => {
    mockUseAuth.mockReturnValue({ user: defaultUser, logout: vi.fn() })
    renderWithRouter(<DashboardLayout><div /></DashboardLayout>)
    expect(screen.getByText('BS')).toBeInTheDocument()
  })

  it('shows jabatan for CHAIRPERSON role', () => {
    mockUseAuth.mockReturnValue({
      user: { nama: 'Pak RT', role: 'CHAIRPERSON', jabatan: 'Ketua RT' },
      logout: vi.fn(),
    })
    renderWithRouter(<DashboardLayout><div /></DashboardLayout>)
    expect(screen.getByText('Ketua RT')).toBeInTheDocument()
  })

  it('renders logout button and triggers logout on click', () => {
    const logout = vi.fn()
    mockUseAuth.mockReturnValue({ user: defaultUser, logout })
    renderWithRouter(<DashboardLayout><div /></DashboardLayout>)
    const keluar = screen.getByText('Keluar')
    expect(keluar).toBeInTheDocument()
    fireEvent.click(keluar)
    expect(logout).toHaveBeenCalledTimes(1)
    expect(mockUseNavigate).toHaveBeenCalledWith('/login')
  })

  it('renders warga navigation items for RESIDENT role', () => {
    mockUseAuth.mockReturnValue({ user: defaultUser, logout: vi.fn() })
    renderWithRouter(<DashboardLayout><div /></DashboardLayout>)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Pengumuman')).toBeInTheDocument()
    expect(screen.getByText('Monitoring Laporan')).toBeInTheDocument()
    expect(screen.getByText('Pembayaran Iuran')).toBeInTheDocument()
  })

  it('highlights active link based on current path', () => {
    mockUseAuth.mockReturnValue({ user: defaultUser, logout: vi.fn() })
    renderWithRouter(<DashboardLayout><div /></DashboardLayout>, {
      initialEntries: ['/pengumuman'],
    })
    const links = screen.getAllByText('Pengumuman')
    const activeLink = links.find(
      (el) => el.closest('a')?.className?.includes('bg-white')
    )
    expect(activeLink).toBeTruthy()
  })

  it('renders navigation items for CHAIRPERSON role', () => {
    mockUseAuth.mockReturnValue({
      user: { nama: 'Ketua', role: 'CHAIRPERSON', jabatan: 'Ketua RT' },
      logout: vi.fn(),
    })
    renderWithRouter(<DashboardLayout><div /></DashboardLayout>)
    expect(screen.getByText('Data Warga')).toBeInTheDocument()
    expect(screen.getByText('Kelola Pengurus RT')).toBeInTheDocument()
  })

  it('toggles dropdown menu on click', () => {
    mockUseAuth.mockReturnValue({
      user: { nama: 'Ketua', role: 'CHAIRPERSON', jabatan: 'Ketua RT' },
      logout: vi.fn(),
    })
    renderWithRouter(<DashboardLayout><div /></DashboardLayout>)
    const wargaBtn = screen.getByText('Warga')
    const verifLink = screen.getByText('Verifikasi Warga').closest('div')
    expect(verifLink.className).toContain('max-h-0')
    fireEvent.click(wargaBtn)
    expect(verifLink.className).toContain('max-h-[200px]')
  })
})
