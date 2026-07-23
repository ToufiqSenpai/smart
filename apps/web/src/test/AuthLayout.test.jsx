import { render, screen } from '@testing-library/react'
import AuthLayout from '../components/layout/AuthLayout'

describe('AuthLayout', () => {
  it('renders children inside the layout', () => {
    render(<AuthLayout><div>Form Login</div></AuthLayout>)
    expect(screen.getByText('Form Login')).toBeInTheDocument()
  })

  it('displays SMART RT branding', () => {
    render(<AuthLayout><div /></AuthLayout>)
    expect(screen.getByText('SMART RT')).toBeInTheDocument()
    expect(screen.getByText('Administrasi Rukun Tetangga')).toBeInTheDocument()
  })

  it('shows copyright with current year', () => {
    render(<AuthLayout><div /></AuthLayout>)
    const year = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`${year} SMART RT`))).toBeInTheDocument()
  })

  it('shows the hero heading on the right panel', () => {
    render(<AuthLayout><div /></AuthLayout>)
    expect(screen.getByText(/Kelola Administrasi RT/)).toBeInTheDocument()
  })

  it('shows stat cards with sample data', () => {
    render(<AuthLayout><div /></AuthLayout>)
    expect(screen.getByText('128')).toBeInTheDocument()
    expect(screen.getByText('Warga Terdaftar')).toBeInTheDocument()
    expect(screen.getByText(/Rp\s*8,5jt/)).toBeInTheDocument()
    expect(screen.getByText('Iuran Terkumpul')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('UMKM Aktif')).toBeInTheDocument()
    expect(screen.getByText('96%')).toBeInTheDocument()
    expect(screen.getByText('Partisipasi')).toBeInTheDocument()
  })

  it('shows RT logo badge', () => {
    render(<AuthLayout><div /></AuthLayout>)
    const rtBadge = screen.getAllByText('RT')
    expect(rtBadge.length).toBeGreaterThanOrEqual(1)
  })

  it('displays the doc mock section', () => {
    render(<AuthLayout><div /></AuthLayout>)
    expect(screen.getByText('Laporan Bulanan RT 03')).toBeInTheDocument()
  })
})
