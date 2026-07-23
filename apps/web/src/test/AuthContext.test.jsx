import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../context/AuthContext'

vi.mock('../api/auth.api', () => ({
  login: vi.fn(),
}))

function TestComponent() {
  const { user, isAuthenticated, login, logout, loading } = useAuth()
  return (
    <div>
      <span data-testid="auth">{isAuthenticated ? 'true' : 'false'}</span>
      <span data-testid="user">{user ? user.nama : 'null'}</span>
      <span data-testid="loading">{loading ? 'true' : 'false'}</span>
      <button onClick={() => login({ email: 'test@test.com', password: '123' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('provides default unauthenticated state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    expect(screen.getByTestId('auth').textContent).toBe('false')
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  it('sets user and token on successful login', async () => {
    const user = userEvent.setup()
    const { login } = await import('../api/auth.api')
    login.mockResolvedValue({
      data: { accessToken: 'token-123', user: { nama: 'Budi', role: 'RESIDENT' } },
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await user.click(screen.getByText('Login'))
    await waitFor(() => {
      expect(screen.getByTestId('auth').textContent).toBe('true')
      expect(screen.getByTestId('user').textContent).toBe('Budi')
    })
    expect(localStorage.getItem('accessToken')).toBe('token-123')
  })

  it('clears user and token on logout', async () => {
    const user = userEvent.setup()
    localStorage.setItem('accessToken', 'token-123')
    const { login } = await import('../api/auth.api')
    login.mockResolvedValue({
      data: { accessToken: 'token-456', user: { nama: 'Budi', role: 'RESIDENT' } },
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await user.click(screen.getByText('Login'))
    await waitFor(() => expect(screen.getByTestId('auth').textContent).toBe('true'))

    await user.click(screen.getByText('Logout'))
    expect(screen.getByTestId('auth').textContent).toBe('false')
    expect(screen.getByTestId('user').textContent).toBe('null')
    expect(localStorage.getItem('accessToken')).toBeNull()
  })

  it('throws error when useAuth is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestComponent />)).toThrow('useAuth must be used within AuthProvider')
    consoleSpy.mockRestore()
  })
})
