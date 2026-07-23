import { render, screen } from '@testing-library/react'
import ActivitySection from '../components/dashboard/ActivitySection'

function DummyIcon() {
  return <svg data-testid="activity-icon" />
}

const mockActivities = [
  {
    icon: DummyIcon,
    title: 'Pembayaran Iuran',
    badge: 'Rp 150.000',
    badgeVariant: 'success',
    meta: '2 jam yang lalu',
  },
  {
    icon: DummyIcon,
    title: 'Laporan Baru',
    meta: '1 jam yang lalu',
  },
  {
    icon: DummyIcon,
    title: 'UMKM Terverifikasi',
    badge: 'Baru',
    borderColor: 'border-l-4 border-success',
  },
]

describe('ActivitySection', () => {
  it('renders section heading', () => {
    render(<ActivitySection activities={mockActivities} />)
    expect(screen.getByText('Aktivitas Terbaru')).toBeInTheDocument()
  })

  it('renders all activity titles', () => {
    render(<ActivitySection activities={mockActivities} />)
    expect(screen.getByText('Pembayaran Iuran')).toBeInTheDocument()
    expect(screen.getByText('Laporan Baru')).toBeInTheDocument()
    expect(screen.getByText('UMKM Terverifikasi')).toBeInTheDocument()
  })

  it('renders badge when provided', () => {
    render(<ActivitySection activities={mockActivities} />)
    expect(screen.getByText('Rp 150.000')).toBeInTheDocument()
    expect(screen.getByText('Baru')).toBeInTheDocument()
  })

  it('renders meta text when provided', () => {
    render(<ActivitySection activities={mockActivities} />)
    expect(screen.getByText('2 jam yang lalu')).toBeInTheDocument()
    expect(screen.getByText('1 jam yang lalu')).toBeInTheDocument()
  })

  it('does not render badge when not provided', () => {
    render(<ActivitySection activities={mockActivities} />)
    const laporanBaruCard = screen.getByText('Laporan Baru').closest('div[class*="bg-bg-card"]')
    expect(laporanBaruCard.textContent).not.toContain('Rp')
  })

  it('applies borderColor when provided', () => {
    render(<ActivitySection activities={mockActivities} />)
    const lastCard = screen.getByText('UMKM Terverifikasi').closest('div[class*="bg-bg-card"]')
    expect(lastCard.className).toContain('border-l-4')
  })

  it('renders icons', () => {
    const { container } = render(<ActivitySection activities={mockActivities} />)
    expect(container.querySelectorAll('[data-testid="activity-icon"]').length).toBe(3)
  })

  it('handles empty activities', () => {
    render(<ActivitySection activities={[]} />)
    expect(screen.getByText('Aktivitas Terbaru')).toBeInTheDocument()
  })
})
