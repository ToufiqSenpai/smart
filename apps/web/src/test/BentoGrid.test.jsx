import { render, screen } from '@testing-library/react'
import BentoGrid from '../components/dashboard/BentoGrid'

const mockSections = [
  {
    title: 'Iuran Bulan Ini',
    subtitle: 'Rincian pembayaran iuran',
    pill: '5 Menunggu',
    pillVariant: 'warning',
    rows: [
      { label: 'Budi', badge: 'Lunas', badgeVariant: 'success' },
      { label: 'Siti', badge: 'Belum', badgeVariant: 'warning' },
    ],
    footer: { label: 'Lihat semua', href: '/kelola-iuran' },
  },
  {
    title: 'Laporan Terbaru',
    subtitle: 'Kendala warga',
    rows: [
      { label: 'Jalan rusak' },
    ],
  },
]

describe('BentoGrid', () => {
  it('renders all section titles and subtitles', () => {
    render(<BentoGrid sections={mockSections} />)
    expect(screen.getByText('Iuran Bulan Ini')).toBeInTheDocument()
    expect(screen.getByText('Rincian pembayaran iuran')).toBeInTheDocument()
    expect(screen.getByText('Laporan Terbaru')).toBeInTheDocument()
  })

  it('renders rows with labels', () => {
    render(<BentoGrid sections={mockSections} />)
    expect(screen.getByText('Budi')).toBeInTheDocument()
    expect(screen.getByText('Siti')).toBeInTheDocument()
    expect(screen.getByText('Jalan rusak')).toBeInTheDocument()
  })

  it('renders row badges with correct variant', () => {
    render(<BentoGrid sections={mockSections} />)
    const lunas = screen.getByText('Lunas')
    expect(lunas.className).toContain('bg-success-bg')
  })

  it('renders pill badge when provided', () => {
    render(<BentoGrid sections={mockSections} />)
    const pill = screen.getByText('5 Menunggu')
    expect(pill.className).toContain('bg-warning-bg')
  })

  it('renders footer link when provided', () => {
    render(<BentoGrid sections={mockSections} />)
    expect(screen.getByText('Lihat semua')).toBeInTheDocument()
  })

  it('does not render footer when not provided', () => {
    render(<BentoGrid sections={[mockSections[1]]} />)
    expect(screen.queryByText('Lihat semua')).not.toBeInTheDocument()
  })

  it('handles empty sections', () => {
    const { container } = render(<BentoGrid sections={[]} />)
    expect(container.querySelectorAll('.grid > div').length).toBe(0)
  })

  it('does not render pill when not provided', () => {
    render(<BentoGrid sections={[mockSections[1]]} />)
    expect(screen.queryByText('5 Menunggu')).not.toBeInTheDocument()
  })
})
