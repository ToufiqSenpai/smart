import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import KetuaKelolaIuran from '../pages/iuran/KetuaKelolaIuran'

const mockGetDues = vi.hoisted(() => vi.fn())
vi.mock('../api/dues.api', () => ({ getDues: mockGetDues }))

const mockUseAuth = vi.hoisted(() => vi.fn())
const mockUseLocation = vi.hoisted(() => vi.fn())
const mockUseNavigate = vi.hoisted(() => vi.fn())
vi.mock('../context/AuthContext', () => ({ useAuth: mockUseAuth }))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useLocation: mockUseLocation, useNavigate: () => mockUseNavigate }
})

const mockDues = [
  { id: 1, nama_iuran: 'Iuran Keamanan', jenis_iuran: 'Keamanan', nominal: 50000, tanggal_jatuh_tempo: '2026-08-15', status_aktif: true },
  { id: 2, nama_iuran: 'Iuran Kebersihan', jenis_iuran: 'Kebersihan', nominal: 30000, tanggal_jatuh_tempo: '2026-08-10', status_aktif: false },
]

function renderPage() {
  mockUseAuth.mockReturnValue({ user: { nama: 'Ketua', role: 'CHAIRPERSON' } })
  mockUseLocation.mockReturnValue({ pathname: '/kelola-iuran' })
  return render(<MemoryRouter><KetuaKelolaIuran /></MemoryRouter>)
}

describe('KetuaKelolaIuran', () => {
  afterEach(() => vi.clearAllMocks())

  it('shows loading state', () => {
    mockGetDues.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByText('Memuat data...')).toBeInTheDocument()
  })

  it('renders table with dues data', async () => {
    mockGetDues.mockResolvedValue({ data: mockDues })
    renderPage()

    expect(await screen.findByText('Iuran Keamanan')).toBeInTheDocument()
    expect(screen.getByText('Iuran Kebersihan')).toBeInTheDocument()
    expect(screen.getByText('Keamanan')).toBeInTheDocument()
    expect(screen.getAllByText('Aktif').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Nonaktif').length).toBeGreaterThan(0)
  })

  it('shows empty state when no dues', async () => {
    mockGetDues.mockResolvedValue({ data: [] })
    renderPage()
    expect(await screen.findByText('Tidak ada data iuran.')).toBeInTheDocument()
  })

  it('renders "Tambah Iuran" button', async () => {
    mockGetDues.mockResolvedValue({ data: mockDues })
    renderPage()
    expect(await screen.findByText('Tambah Iuran')).toBeInTheDocument()
  })
})
