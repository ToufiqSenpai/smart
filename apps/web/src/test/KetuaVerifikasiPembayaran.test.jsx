import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import KetuaVerifikasiPembayaran from '../pages/iuran/KetuaVerifikasiPembayaran'

const mockGetAllPayments = vi.hoisted(() => vi.fn())
const mockVerifyPayment = vi.hoisted(() => vi.fn())
vi.mock('../api/dues.api', () => ({ getAllPayments: mockGetAllPayments, verifyPayment: mockVerifyPayment }))

const mockUseAuth = vi.hoisted(() => vi.fn())
const mockUseLocation = vi.hoisted(() => vi.fn())
const mockUseNavigate = vi.hoisted(() => vi.fn())
vi.mock('../context/AuthContext', () => ({ useAuth: mockUseAuth }))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useLocation: mockUseLocation, useNavigate: () => mockUseNavigate }
})

const mockPayments = [
  { id_pembayaran: 1, nama_warga: 'Budi', nama_iuran: 'Iuran Keamanan', jenis_iuran: 'Wajib', periode: '2026-07', jumlah_bayar: 50000, tanggal_bayar: '2026-07-20', status_verifikasi: 'PENDING', metode_bayar: 'Transfer Bank', bukti_pembayaran: null },
  { id_pembayaran: 2, nama_warga: 'Siti', nama_iuran: 'Iuran Kebersihan', jenis_iuran: 'Wajib', periode: '2026-07', jumlah_bayar: 30000, tanggal_bayar: '2026-07-19', status_verifikasi: 'VERIFIED', metode_bayar: 'Tunai', bukti_pembayaran: null },
]

function renderPage() {
  mockUseAuth.mockReturnValue({ user: { nama: 'Pengurus', role: 'OFFICER' } })
  mockUseLocation.mockReturnValue({ pathname: '/verifikasi-pembayaran' })
  return render(<MemoryRouter><KetuaVerifikasiPembayaran /></MemoryRouter>)
}

describe('KetuaVerifikasiPembayaran', () => {
  afterEach(() => vi.clearAllMocks())

  it('shows loading state', () => {
    mockGetAllPayments.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByText('Memuat data...')).toBeInTheDocument()
  })

  it('renders table with payments', async () => {
    mockGetAllPayments.mockResolvedValue({ data: mockPayments })
    renderPage()
    expect(await screen.findByText('Budi')).toBeInTheDocument()
    expect(screen.getByText('Siti')).toBeInTheDocument()
    expect(screen.getAllByText('Menunggu').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Terverifikasi').length).toBeGreaterThan(0)
  })

  it('opens modal on detail click', async () => {
    const user = userEvent.setup()
    mockGetAllPayments.mockResolvedValue({ data: [mockPayments[0]] })
    renderPage()

    expect(await screen.findByText('Budi')).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: /detail/i })[0])
    expect(screen.getByText('Detail Pembayaran')).toBeInTheDocument()
  })

  it('verifies payment from modal', async () => {
    mockVerifyPayment.mockResolvedValue({})
    const user = userEvent.setup()
    mockGetAllPayments.mockResolvedValue({ data: mockPayments })

    renderPage()
    expect(await screen.findByText('Budi')).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: /detail/i })[0])
    await user.click(screen.getByRole('button', { name: /verifikasi/i }))

    await waitFor(() => expect(mockVerifyPayment).toHaveBeenCalledWith(1, 'VERIFIED'))
  })

  it('rejects payment from modal', async () => {
    mockVerifyPayment.mockResolvedValue({})
    const user = userEvent.setup()
    mockGetAllPayments.mockResolvedValue({ data: mockPayments })

    renderPage()
    expect(await screen.findByText('Budi')).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: /detail/i })[0])
    await user.click(screen.getByRole('button', { name: /tolak/i }))

    await waitFor(() => expect(mockVerifyPayment).toHaveBeenCalledWith(1, 'REJECTED'))
  })
})
