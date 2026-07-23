import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import KetuaDetailVerifikasi from '../pages/iuran/KetuaDetailVerifikasi'

const mockGetPaymentById = vi.hoisted(() => vi.fn())
const mockVerifyPayment = vi.hoisted(() => vi.fn())
vi.mock('../api/dues.api', () => ({ getPaymentById: mockGetPaymentById, verifyPayment: mockVerifyPayment }))

const mockUseAuth = vi.hoisted(() => vi.fn())
const mockUseLocation = vi.hoisted(() => vi.fn())
const mockUseNavigate = vi.hoisted(() => vi.fn())
vi.mock('../context/AuthContext', () => ({ useAuth: mockUseAuth }))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useLocation: mockUseLocation, useNavigate: () => mockUseNavigate }
})

function renderPage() {
  mockUseAuth.mockReturnValue({ user: { nama: 'Pengurus', role: 'OFFICER' } })
  mockUseLocation.mockReturnValue({ pathname: '/detail-verifikasi/1' })
  return render(
    <MemoryRouter initialEntries={['/detail-verifikasi/1']}>
      <Routes>
        <Route path="/detail-verifikasi/:id" element={<KetuaDetailVerifikasi />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('KetuaDetailVerifikasi', () => {
  afterEach(() => vi.clearAllMocks())

  it('shows loading state', () => {
    mockGetPaymentById.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByText('Memuat data...')).toBeInTheDocument()
  })

  it('renders payment details with menunggu status', async () => {
    mockGetPaymentById.mockResolvedValue({
      data: {
        id_pembayaran: 1, nama_warga: 'Budi', nama_iuran: 'Iuran Keamanan', jenis_iuran: 'Wajib',
        periode: '2026-07', jumlah_bayar: 50000, metode_bayar: 'Transfer Bank',
        tanggal_bayar: '2026-07-20', status_verifikasi: 'PENDING', bukti_pembayaran: null,
      },
    })
    renderPage()

    expect(await screen.findByText('Pembayaran Iuran Keamanan')).toBeInTheDocument()
    expect(screen.getAllByText('Budi').length).toBeGreaterThan(0)
    expect(screen.getByText('Menunggu')).toBeInTheDocument()
    expect(screen.getAllByText('Verifikasi Pembayaran').length).toBeGreaterThan(0)
    expect(screen.getByText('Tolak Pembayaran')).toBeInTheDocument()
  })

  it('renders terverifikasi status without action buttons', async () => {
    mockGetPaymentById.mockResolvedValue({
      data: {
        id_pembayaran: 2, nama_warga: 'Siti', nama_iuran: 'Iuran Kebersihan', jenis_iuran: 'Wajib',
        periode: '2026-07', jumlah_bayar: 30000, metode_bayar: 'Tunai',
        tanggal_bayar: '2026-07-19', status_verifikasi: 'VERIFIED', bukti_pembayaran: null,
      },
    })
    renderPage()

    expect(await screen.findByText('Terverifikasi')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Verifikasi Pembayaran$/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Tolak Pembayaran$/ })).not.toBeInTheDocument()
  })

  it('calls verifyPayment on verifikasi click', async () => {
    mockVerifyPayment.mockResolvedValue({})
    mockGetPaymentById.mockResolvedValue({
      data: {
        id_pembayaran: 1, nama_warga: 'Budi', nama_iuran: 'Iuran', jenis_iuran: 'Wajib',
        periode: '2026-07', jumlah_bayar: 50000, metode_bayar: 'Transfer Bank',
        tanggal_bayar: '2026-07-20', status_verifikasi: 'PENDING', bukti_pembayaran: null,
      },
    })
    const user = userEvent.setup()
    renderPage()

    expect(await screen.findByRole('button', { name: /^Verifikasi Pembayaran$/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^Verifikasi Pembayaran$/ }))

    await waitFor(() => expect(mockVerifyPayment).toHaveBeenCalledWith(1, 'VERIFIED'))
  })

  it('calls verifyPayment on tolak click', async () => {
    mockVerifyPayment.mockResolvedValue({})
    mockGetPaymentById.mockResolvedValue({
      data: {
        id_pembayaran: 1, nama_warga: 'Budi', nama_iuran: 'Iuran', jenis_iuran: 'Wajib',
        periode: '2026-07', jumlah_bayar: 50000, metode_bayar: 'Transfer Bank',
        tanggal_bayar: '2026-07-20', status_verifikasi: 'PENDING', bukti_pembayaran: null,
      },
    })
    const user = userEvent.setup()
    renderPage()

    expect(await screen.findByText('Tolak Pembayaran')).toBeInTheDocument()
    await user.click(screen.getByText('Tolak Pembayaran'))

    await waitFor(() => expect(mockVerifyPayment).toHaveBeenCalledWith(1, 'REJECTED'))
  })
})
