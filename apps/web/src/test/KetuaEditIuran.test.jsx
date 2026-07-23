import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import KetuaEditIuran from '../pages/iuran/KetuaEditIuran'

const mockGetDueById = vi.hoisted(() => vi.fn())
const mockUpdateDue = vi.hoisted(() => vi.fn())
vi.mock('../api/dues.api', () => ({ getDueById: mockGetDueById, updateDue: mockUpdateDue }))

const mockUseAuth = vi.hoisted(() => vi.fn())
const mockUseLocation = vi.hoisted(() => vi.fn())
const mockUseNavigate = vi.hoisted(() => vi.fn())
vi.mock('../context/AuthContext', () => ({ useAuth: mockUseAuth }))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useLocation: mockUseLocation, useNavigate: () => mockUseNavigate }
})

function renderPage() {
  mockUseAuth.mockReturnValue({ user: { nama: 'Ketua', role: 'CHAIRPERSON' } })
  mockUseLocation.mockReturnValue({ pathname: '/edit-iuran/1' })
  return render(
    <MemoryRouter initialEntries={['/edit-iuran/1']}>
      <Routes>
        <Route path="/edit-iuran/:id" element={<KetuaEditIuran />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('KetuaEditIuran', () => {
  afterEach(() => vi.clearAllMocks())

  it('shows loading while fetching data', () => {
    mockGetDueById.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByText('Memuat data...')).toBeInTheDocument()
  })

  it('renders form pre-filled with due data', async () => {
    mockGetDueById.mockResolvedValue({ data: { nama_iuran: 'Iuran Keamanan', jenis_iuran: 'Keamanan', nominal: 50000, tanggal_jatuh_tempo: '2026-08-15' } })
    renderPage()

    expect(await screen.findByDisplayValue('Iuran Keamanan')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Keamanan')).toBeInTheDocument()
    expect(screen.getByDisplayValue('50000')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2026-08-15')).toBeInTheDocument()
  })

  it('calls updateDue on valid submit', async () => {
    mockUpdateDue.mockResolvedValue({})
    mockGetDueById.mockResolvedValue({ data: { nama_iuran: 'Iuran', jenis_iuran: 'Wajib', nominal: 25000, tanggal_jatuh_tempo: '2026-09-01' } })
    const user = userEvent.setup()
    renderPage()

    expect(await screen.findByDisplayValue('Iuran')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Simpan Perubahan' }))

    await waitFor(() => {
      expect(mockUpdateDue).toHaveBeenCalledWith('1', {
        nama_iuran: 'Iuran',
        jenis_iuran: 'Wajib',
        nominal: 25000,
        tanggal_jatuh_tempo: '2026-09-01',
      })
    })
  })
})
