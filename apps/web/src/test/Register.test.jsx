import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Register from '../pages/auth/Register'

const mockRegister = vi.hoisted(() => vi.fn())
vi.mock('../api/auth.api', () => ({ register: mockRegister }))

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  )
}

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form fields', () => {
    renderRegister()
    expect(screen.getByPlaceholderText('Masukkan NIK 16 digit')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('contoh@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Masukkan nama lengkap')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Contoh: Jl. Mawar/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('081234567890')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Pilih username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Buat password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ulangi password')).toBeInTheDocument()
  })

  it('shows heading and branding', () => {
    renderRegister()
    expect(screen.getByText('Daftar sebagai Warga')).toBeInTheDocument()
    expect(screen.getByText('SMART RT')).toBeInTheDocument()
  })

  it('requires NIK to be 16 digits', async () => {
    const user = userEvent.setup()
    renderRegister()
    const nikInput = screen.getByPlaceholderText('Masukkan NIK 16 digit')
    await user.type(nikInput, '12345')
    await user.tab()
    await waitFor(() => {
      expect(screen.getByText('NIK harus 16 digit angka')).toBeInTheDocument()
    })
  })

  it('filters non-numeric characters from NIK', async () => {
    const user = userEvent.setup()
    renderRegister()
    const nikInput = screen.getByPlaceholderText('Masukkan NIK 16 digit')
    await user.type(nikInput, 'abc123')
    expect(nikInput).toHaveValue('123')
  })

  it('requires email to be valid', async () => {
    const user = userEvent.setup()
    renderRegister()
    await user.type(screen.getByPlaceholderText('contoh@email.com'), 'invalid-email')
    await user.click(screen.getByRole('button', { name: 'Daftar' }))
    await waitFor(() => {
      expect(screen.getByText('Email tidak valid')).toBeInTheDocument()
    })
  })

  it('requires password min 8 characters', async () => {
    const user = userEvent.setup()
    renderRegister()
    await user.type(screen.getByPlaceholderText('Buat password'), '123')
    await user.click(screen.getByRole('button', { name: 'Daftar' }))
    await waitFor(() => {
      expect(screen.getByText('Password minimal 8 karakter')).toBeInTheDocument()
    })
  })

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup()
    renderRegister()
    await user.type(screen.getByPlaceholderText('Buat password'), 'password123')
    await user.type(screen.getByPlaceholderText('Ulangi password'), 'different')
    await user.click(screen.getByRole('button', { name: 'Daftar' }))
    await waitFor(() => {
      expect(screen.getByText('Password tidak cocok')).toBeInTheDocument()
    })
  })

  it('calls register API on valid submit', async () => {
    mockRegister.mockResolvedValue({})
    const user = userEvent.setup()
    renderRegister()

    await user.type(screen.getByPlaceholderText('Masukkan NIK 16 digit'), '1234567890123456')
    await user.type(screen.getByPlaceholderText('contoh@email.com'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('Masukkan nama lengkap'), 'Test User')
    await user.type(screen.getByPlaceholderText(/Contoh: Jl. Mawar/), 'Jl. Testing 123')
    await user.type(screen.getByPlaceholderText('081234567890'), '08123456789')
    await user.type(screen.getByPlaceholderText('Pilih username'), 'testuser')
    await user.type(screen.getByPlaceholderText('Buat password'), 'password123')
    await user.type(screen.getByPlaceholderText('Ulangi password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Daftar' }))

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        nik: '1234567890123456',
        email: 'test@test.com',
        nama: 'Test User',
        alamat: 'Jl. Testing 123',
        noHp: '08123456789',
        username: 'testuser',
        password: 'password123',
      })
    })
  })

  it('shows success toast after registration', async () => {
    mockRegister.mockResolvedValue({})
    const user = userEvent.setup()
    renderRegister()

    await user.type(screen.getByPlaceholderText('Masukkan NIK 16 digit'), '1234567890123456')
    await user.type(screen.getByPlaceholderText('contoh@email.com'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('Masukkan nama lengkap'), 'Test User')
    await user.type(screen.getByPlaceholderText(/Contoh: Jl. Mawar/), 'Jl. Testing')
    await user.type(screen.getByPlaceholderText('081234567890'), '08123456789')
    await user.type(screen.getByPlaceholderText('Pilih username'), 'testuser')
    await user.type(screen.getByPlaceholderText('Buat password'), 'password123')
    await user.type(screen.getByPlaceholderText('Ulangi password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Daftar' }))

    await waitFor(() => {
      expect(screen.getByText('Pendaftaran berhasil!')).toBeInTheDocument()
    })
  })

  it('shows error toast on failed registration', async () => {
    mockRegister.mockRejectedValue({ message: 'Email sudah terdaftar' })
    const user = userEvent.setup()
    renderRegister()

    await user.type(screen.getByPlaceholderText('Masukkan NIK 16 digit'), '1234567890123456')
    await user.type(screen.getByPlaceholderText('contoh@email.com'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('Masukkan nama lengkap'), 'Test')
    await user.type(screen.getByPlaceholderText(/Contoh: Jl. Mawar/), 'Jl. Test')
    await user.type(screen.getByPlaceholderText('081234567890'), '08123456789')
    await user.type(screen.getByPlaceholderText('Pilih username'), 'test')
    await user.type(screen.getByPlaceholderText('Buat password'), 'password123')
    await user.type(screen.getByPlaceholderText('Ulangi password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Daftar' }))

    await waitFor(() => {
      expect(screen.getByText('Gagal mendaftar')).toBeInTheDocument()
    })
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderRegister()
    const passwordInput = screen.getByPlaceholderText('Buat password')
    expect(passwordInput).toHaveAttribute('type', 'password')

    const toggles = screen.getAllByLabelText('Tampilkan password')
    await user.click(toggles[0])
    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  it('shows status badge "Menunggu Verifikasi"', () => {
    renderRegister()
    expect(screen.getByText(/Menunggu Verifikasi/)).toBeInTheDocument()
  })
})
