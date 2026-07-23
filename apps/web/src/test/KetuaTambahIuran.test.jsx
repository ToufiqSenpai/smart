import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import KetuaTambahIuran from '../pages/iuran/KetuaTambahIuran'

const mockCreateDue = vi.hoisted(() => vi.fn())
vi.mock('../api/dues.api', () => ({ createDue: mockCreateDue }))

const mockUseAuth = vi.hoisted(() => vi.fn())
const mockUseLocation = vi.hoisted(() => vi.fn())
const mockUseNavigate = vi.hoisted(() => vi.fn())
vi.mock('../context/AuthContext', () => ({ useAuth: mockUseAuth }))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useLocation: mockUseLocation, useNavigate: () => mockUseNavigate }
})

function renderPage() {
  mockUseAuth.mockReturnValue({ user: { nama: 'Ketua', role: 'CHAIRPERSON', jabatan: 'Ketua RT' } })
  mockUseLocation.mockReturnValue({ pathname: '/tambah-iuran' })
  return render(<MemoryRouter><KetuaTambahIuran /></MemoryRouter>)
}

describe('KetuaTambahIuran', () => {
  afterEach(() => vi.clearAllMocks())

  it('renders form with all fields', () => {
    renderPage()
    expect(screen.getByText('Tambah Iuran')).toBeInTheDocument()
    expect(screen.getByLabelText('Nama Iuran')).toBeInTheDocument()
    expect(screen.getByLabelText('Jenis Iuran')).toBeInTheDocument()
    expect(screen.getByLabelText('Nominal (Rp)')).toBeInTheDocument()
    expect(screen.getByLabelText('Tanggal Jatuh Tempo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Simpan' })).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: 'Simpan' }))
    expect(screen.getByText('Nama iuran harus diisi')).toBeInTheDocument()
    expect(screen.getByText('Jenis iuran harus dipilih')).toBeInTheDocument()
    expect(screen.getByText('Nominal harus berupa angka')).toBeInTheDocument()
    expect(screen.getByText('Tanggal jatuh tempo harus diisi')).toBeInTheDocument()
  })

  it('calls createDue on valid submit', async () => {
    mockCreateDue.mockResolvedValue({ data: {} })
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText('Nama Iuran'), 'Iuran Keamanan')
    await user.selectOptions(screen.getByLabelText('Jenis Iuran'), 'Keamanan')
    await user.type(screen.getByLabelText('Nominal (Rp)'), '50000')
    await user.type(screen.getByLabelText('Tanggal Jatuh Tempo'), '2026-08-15')
    await user.click(screen.getByRole('button', { name: 'Simpan' }))

    await waitFor(() => {
      expect(mockCreateDue).toHaveBeenCalledWith({
        nama_iuran: 'Iuran Keamanan',
        jenis_iuran: 'Keamanan',
        nominal: 50000,
        tanggal_jatuh_tempo: '2026-08-15',
      })
    })
  })
})
