import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Login from '../pages/auth/Login'

const mockAuth = vi.hoisted(() => ({ login: vi.fn() }))
vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuth,
}))

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form with email and password fields', () => {
    renderLogin()
    expect(screen.getByPlaceholderText('Masukkan email Anda')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Masukkan password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeInTheDocument()
  })

  it('shows heading and branding', () => {
    renderLogin()
    expect(screen.getByText('Masuk ke SMART RT')).toBeInTheDocument()
    expect(screen.getByText('SMART RT')).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup()
    renderLogin()
    await user.click(screen.getByRole('button', { name: 'Masuk' }))
    expect(screen.getAllByText('Email harus diisi').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Password harus diisi').length).toBeGreaterThanOrEqual(1)
  })

  it('calls auth.login on valid submit', async () => {
    mockAuth.login.mockResolvedValue({})
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByPlaceholderText('Masukkan email Anda'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('Masukkan password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Masuk' }))

    await waitFor(() => {
      expect(mockAuth.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      })
    })
  })

  it('shows loading state while submitting', async () => {
    mockAuth.login.mockImplementation(() => new Promise(() => {}))
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByPlaceholderText('Masukkan email Anda'), 'a@b.com')
    await user.type(screen.getByPlaceholderText('Masukkan password'), '12345678')
    await user.click(screen.getByRole('button', { name: 'Masuk' }))

    expect(await screen.findByText('Memproses...')).toBeInTheDocument()
  })

  it('shows error toast on failed login', async () => {
    mockAuth.login.mockRejectedValue({ message: 'Email atau password salah' })
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByPlaceholderText('Masukkan email Anda'), 'a@b.com')
    await user.type(screen.getByPlaceholderText('Masukkan password'), 'wrong')
    await user.click(screen.getByRole('button', { name: 'Masuk' }))

    expect(await screen.findByText('Gagal masuk')).toBeInTheDocument()
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderLogin()
    const passwordInput = screen.getByPlaceholderText('Masukkan password')
    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(screen.getByLabelText('Tampilkan password'))
    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  it('navigates to register page via link', () => {
    renderLogin()
    const link = screen.getByRole('link', { name: /daftar/i })
    expect(link).toHaveAttribute('href', '/register')
  })
})
