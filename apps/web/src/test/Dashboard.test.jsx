import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../pages/dashboard/Dashboard'

const mockDash = vi.hoisted(() => ({
  dashboard: vi.fn(),
  activities: vi.fn(),
}))
const mockAnnounce = vi.hoisted(() => ({ getAnnouncements: vi.fn() }))
const mockResidents = vi.hoisted(() => ({ getPendingVerifications: vi.fn() }))
const mockDues = vi.hoisted(() => ({ getCurrentBills: vi.fn() }))
const mockBiz = vi.hoisted(() => ({ getMyBusinesses: vi.fn() }))

vi.mock('../api/dashboard.api', () => ({
  getDashboard: mockDash.dashboard,
  getDashboardActivities: mockDash.activities,
}))
vi.mock('../api/announcements.api', () => mockAnnounce)
vi.mock('../api/residents.api', () => mockResidents)
vi.mock('../api/dues.api', () => mockDues)
vi.mock('../api/businesses.api', () => mockBiz)

const mockUseAuth = vi.hoisted(() => vi.fn())
const mockUseLocation = vi.hoisted(() => vi.fn())
const mockUseNavigate = vi.hoisted(() => vi.fn())

vi.mock('../context/AuthContext', () => ({ useAuth: mockUseAuth }))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useLocation: mockUseLocation, useNavigate: () => mockUseNavigate }
})

function mockUser(role) {
  return { id: 1, nama: 'Test User', role, jabatan: role === 'CHAIRPERSON' ? 'Ketua RT' : role === 'OFFICER' ? 'Pengurus' : null }
}

function setupMocks() {
  mockDash.dashboard.mockResolvedValue({ data: { totalWarga: 128, totalUMKM: 12, totalIuranAktif: 3, pengumumanAktif: 5, jumlahUMKM: 2, jumlahTagihanBelumDibayar: 1, jumlahLaporanSaya: 0, totalPengeluaranKas: 500000, totalLaporanKendala: 8, pendingCounts: { umkmMenunggu: 3, pembayaranMenunggu: 2, laporanMenungguValidasi: 1, laporanMenungguTindakLanjut: 2 } } })
  mockDash.activities.mockResolvedValue({ data: [] })
  mockAnnounce.getAnnouncements.mockResolvedValue({ data: [{ judul: 'Pengumuman 1', isi_pengumuman: 'Isi pengumuman', status_publikasi: 'PUBLISHED', tanggal_pengumuman: '2026-07-22' }] })
  mockDues.getCurrentBills.mockResolvedValue({ data: [] })
  mockBiz.getMyBusinesses.mockResolvedValue({ data: [] })
  mockResidents.getPendingVerifications.mockResolvedValue({ data: [] })
}

function renderDashboard(initialEntries = ['/dashboard']) {
  mockUseLocation.mockReturnValue({ pathname: initialEntries[0] })
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Dashboard />
    </MemoryRouter>
  )
}

describe('Dashboard', () => {
  afterEach(() => vi.clearAllMocks())

  it('shows loading state initially', () => {
    mockUseAuth.mockReturnValue({ user: mockUser('RESIDENT') })
    setupMocks()
    renderDashboard()
    expect(screen.getByText('Memuat data...')).toBeInTheDocument()
  })

  it('renders Warga section for RESIDENT role', async () => {
    mockUseAuth.mockReturnValue({ user: mockUser('RESIDENT') })
    setupMocks()
    renderDashboard()

    expect(await screen.findByText(/Welcome back/)).toBeInTheDocument()
    expect(screen.getByText('Status Iuran')).toBeInTheDocument()
    expect(screen.getByText('Announcements')).toBeInTheDocument()
    expect(screen.getByText('Aktivitas Terbaru')).toBeInTheDocument()
  })

  it('renders Pengurus section for OFFICER role', async () => {
    mockUseAuth.mockReturnValue({ user: mockUser('OFFICER') })
    setupMocks()
    renderDashboard()

    expect(await screen.findByText(/Welcome back/)).toBeInTheDocument()
    expect(screen.getByText('Total Warga')).toBeInTheDocument()
    expect(screen.getAllByText('Validasi UMKM').length).toBeGreaterThan(0)
    expect(screen.getByText('Sebagai Pengurus')).toBeInTheDocument()
  })

  it('renders Ketua section for CHAIRPERSON role', async () => {
    mockUseAuth.mockReturnValue({ user: mockUser('CHAIRPERSON') })
    setupMocks()
    renderDashboard()

    expect(await screen.findByText(/Welcome back/)).toBeInTheDocument()
    expect(screen.getByText('Warga Menunggu Verifikasi')).toBeInTheDocument()
    expect(screen.getByText('Sebagai Ketua')).toBeInTheDocument()
    expect(screen.getAllByText('Verifikasi Warga').length).toBeGreaterThan(0)
    expect(screen.getByText('Sebagai Ketua')).toBeInTheDocument()
  })

  it('displays stat numbers from dashboard data', async () => {
    mockUseAuth.mockReturnValue({ user: mockUser('OFFICER') })
    setupMocks()
    renderDashboard()

    expect(await screen.findByText('128')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('renders announcements', async () => {
    mockUseAuth.mockReturnValue({ user: mockUser('RESIDENT') })
    setupMocks()
    renderDashboard()

    expect(await screen.findByText('Pengumuman 1')).toBeInTheDocument()
  })

  it('handles API error gracefully', async () => {
    mockUseAuth.mockReturnValue({ user: mockUser('RESIDENT') })
    mockDash.dashboard.mockRejectedValue(new Error('Network error'))
    mockDash.activities.mockRejectedValue(new Error('Network error'))
    mockAnnounce.getAnnouncements.mockRejectedValue(new Error('Network error'))
    mockDues.getCurrentBills.mockRejectedValue(new Error('Network error'))
    mockBiz.getMyBusinesses.mockRejectedValue(new Error('Network error'))

    renderDashboard()
    await waitFor(() => {
      expect(screen.queryByText('Memuat data...')).not.toBeInTheDocument()
    })
  })
})
