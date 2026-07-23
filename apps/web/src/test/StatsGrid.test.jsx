import { render, screen } from '@testing-library/react'
import StatsGrid from '../components/dashboard/StatsGrid'

const mockStats = [
  { number: '128', label: 'Warga', icon: <svg data-testid="icon" /> },
  { number: 'Rp 8,5jt', label: 'Iuran', icon: <svg data-testid="icon" /> },
  { number: '12', label: 'UMKM', icon: <svg data-testid="icon" /> },
  { number: '96%', label: 'Partisipasi', icon: <svg data-testid="icon" /> },
]

describe('StatsGrid', () => {
  it('renders all stats', () => {
    render(<StatsGrid stats={mockStats} />)
    expect(screen.getByText('128')).toBeInTheDocument()
    expect(screen.getByText('Warga')).toBeInTheDocument()
    expect(screen.getByText('Rp 8,5jt')).toBeInTheDocument()
    expect(screen.getByText('Iuran')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('UMKM')).toBeInTheDocument()
    expect(screen.getByText('96%')).toBeInTheDocument()
    expect(screen.getByText('Partisipasi')).toBeInTheDocument()
  })

  it('renders empty state when no stats', () => {
    const { container } = render(<StatsGrid stats={[]} />)
    expect(container.querySelector('.grid')).toBeInTheDocument()
    expect(container.querySelectorAll('.grid > div').length).toBe(0)
  })

  it('renders meta text when provided', () => {
    const statsWithMeta = [
      { number: '5', label: 'Baru', meta: 'Hari ini', icon: <svg data-testid="icon" /> },
    ]
    render(<StatsGrid stats={statsWithMeta} />)
    expect(screen.getByText('Hari ini')).toBeInTheDocument()
  })

  it('renders 4 columns when stats length is 4', () => {
    const { container } = render(<StatsGrid stats={mockStats} />)
    const grid = container.querySelector('.grid')
    expect(grid.className).toContain('md:grid-cols-4')
  })

  it('renders 3 columns when stats length is not 4', () => {
    const threeStats = mockStats.slice(0, 3)
    const { container } = render(<StatsGrid stats={threeStats} />)
    const grid = container.querySelector('.grid')
    expect(grid.className).toContain('md:grid-cols-3')
  })

  it('renders icons for each stat', () => {
    const { container } = render(<StatsGrid stats={mockStats} />)
    expect(container.querySelectorAll('[data-testid="icon"]').length).toBe(4)
  })
})
