import { render, screen } from '@testing-library/react'
import WelcomeBanner from '../components/dashboard/WelcomeBanner'

describe('WelcomeBanner', () => {
  it('renders name in welcome message', () => {
    render(<WelcomeBanner name="Budi" />)
    expect(screen.getByText(/Welcome back, Budi/)).toBeInTheDocument()
  })

  it('renders initials in avatar', () => {
    render(<WelcomeBanner initials="BS" />)
    expect(screen.getByText('BS')).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    render(<WelcomeBanner subtitle="Semoga harimu menyenangkan" />)
    expect(screen.getByText('Semoga harimu menyenangkan')).toBeInTheDocument()
  })

  it('renders role badge with correct text', () => {
    render(<WelcomeBanner roleBadge="Ketua RT" />)
    expect(screen.getByText('Ketua RT')).toBeInTheDocument()
  })

  it('uses default values when no props provided', () => {
    render(<WelcomeBanner />)
    expect(screen.getByText(/Welcome back, User/)).toBeInTheDocument()
    expect(screen.getByText('JD')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('passes roleBadgeColor to Badge component', () => {
    render(<WelcomeBanner roleBadge="Warga" roleBadgeColor="teal" />)
    const badge = screen.getByText('Warga')
    expect(badge.className).toContain('bg-teal-bg')
  })
})
