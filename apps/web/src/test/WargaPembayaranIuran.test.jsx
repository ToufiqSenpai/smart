import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import WargaPembayaranIuran from '../pages/iuran/WargaPembayaranIuran'

const mockGetBills = vi.hoisted(() => vi.fn())
const mockSubmitPayment = vi.hoisted(() => vi.fn())
vi.mock('../api/dues.api', () => ({ getCurrentBills: mockGetBills, submitPayment: mockSubmitPayment }))

const mockUseAuth = vi.hoisted(() => vi.fn())
const mockUseLocation = vi.hoisted(() => vi.fn())
const mockUseNavigate = vi.hoisted(() => vi.fn())
vi.mock('../context/AuthContext', () => ({ useAuth: mockUseAuth }))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useLocation: mockUseLocation, useNavigate: () => mockUseNavigate }
})

const mockBills = [
  { id_iuran: 1, nama_iuran: 'Iuran Keamanan', jenis_iuran: 'Wajib', periode: '2026-07', nominal: 50000, tanggal_jatuh_tempo: '2026-08-15', status: 'PENDING' },
  { id_iuran: 2, nama_iuran: 'Iuran Kebersihan', jenis_iuran: 'Wajib', periode: '2026-07', nominal: 30000, tanggal_jatuh_tempo: '2026-08-10', status: 'UNPAID' },
]

function renderPage() {
  mockUseAuth.mockReturnValue({ user: { nama: 'Warga', role: 'RESIDENT' } })
  mockUseLocation.mockReturnValue({ pathname: '/pembayaran-iuran' })
  return render(<MemoryRouter><WargaPembayaranIuran /></MemoryRouter>)
}

describe('WargaPembayaranIuran', () => {
  afterEach(() => vi.clearAllMocks())

  it('shows loading state', () => {
    mockGetBills.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByText('Memuat tagihan...')).toBeInTheDocument()
  })

  it('renders bill cards', async () => {
    mockGetBills.mockResolvedValue({ data: mockBills })
    renderPage()
    expect(await screen.findByText('Iuran Keamanan')).toBeInTheDocument()
    expect(screen.getByText('Iuran Kebersihan')).toBeInTheDocument()
    expect(screen.getByText(/Rp\s*50\.000/)).toBeInTheDocument()
    expect(screen.getByText(/Rp\s*30\.000/)).toBeInTheDocument()
  })

  it('shows empty message when no unpaid bills', async () => {
    mockGetBills.mockResolvedValue({ data: [] })
    renderPage()
    expect(await screen.findByText('Tidak ada tagihan yang belum dibayar.')).toBeInTheDocument()
  })

  it('renders payment form with select and file upload', async () => {
    mockGetBills.mockResolvedValue({ data: mockBills })
    renderPage()
    expect(await screen.findByLabelText('Metode Pembayaran')).toBeInTheDocument()
    expect(screen.getByText(/Klik untuk upload bukti/)).toBeInTheDocument()
  })
})
