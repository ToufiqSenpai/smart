import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute'

const mockUseAuth = vi.hoisted(() => vi.fn())

vi.mock('../context/AuthContext', () => ({
  useAuth: mockUseAuth,
}))

function renderWithRouter(children, { initialEntries = ['/'] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {children}
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  afterEach(() => {
    mockUseAuth.mockReset()
  })

  it('redirects to /login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ user: null })
    renderWithRouter(
      <ProtectedRoute>
        <div>Dashboard Content</div>
      </ProtectedRoute>
    )
    expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument()
  })

  it('redirects to /dashboard when user role is not allowed', () => {
    mockUseAuth.mockReturnValue({ user: { role: 'RESIDENT' } })
    renderWithRouter(
      <ProtectedRoute roles={['CHAIRPERSON']}>
        <div>Admin Panel</div>
      </ProtectedRoute>
    )
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument()
  })

  it('renders children when user role matches allowed roles', () => {
    mockUseAuth.mockReturnValue({ user: { role: 'CHAIRPERSON' } })
    renderWithRouter(
      <ProtectedRoute roles={['CHAIRPERSON']}>
        <div>Admin Panel</div>
      </ProtectedRoute>
    )
    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
  })

  it('renders children when no roles prop specified and user exists', () => {
    mockUseAuth.mockReturnValue({ user: { role: 'RESIDENT' } })
    renderWithRouter(
      <ProtectedRoute>
        <div>General Content</div>
      </ProtectedRoute>
    )
    expect(screen.getByText('General Content')).toBeInTheDocument()
  })

  it('allows multiple roles and renders if user has one of them', () => {
    mockUseAuth.mockReturnValue({ user: { role: 'OFFICER' } })
    renderWithRouter(
      <ProtectedRoute roles={['CHAIRPERSON', 'OFFICER']}>
        <div>Officer Content</div>
      </ProtectedRoute>
    )
    expect(screen.getByText('Officer Content')).toBeInTheDocument()
  })
})
