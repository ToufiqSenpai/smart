import { render, screen } from '@testing-library/react'
import TaskGrid from '../components/dashboard/TaskGrid'

function DummyIcon() {
  return <svg data-testid="task-icon" />
}

const mockTasks = [
  { title: 'Verifikasi Warga', count: '3 pendaftaran baru', icon: DummyIcon, countNum: 3, href: '/verifikasi-warga' },
  { title: 'Validasi UMKM', count: '2 UMKM menunggu', icon: DummyIcon },
  { title: 'Iuran Tertunggak', count: '5 warga', icon: DummyIcon, countNum: 5 },
]

describe('TaskGrid', () => {
  it('renders all task titles', () => {
    render(<TaskGrid tasks={mockTasks} />)
    expect(screen.getByText('Verifikasi Warga')).toBeInTheDocument()
    expect(screen.getByText('Validasi UMKM')).toBeInTheDocument()
    expect(screen.getByText('Iuran Tertunggak')).toBeInTheDocument()
  })

  it('renders task count descriptions', () => {
    render(<TaskGrid tasks={mockTasks} />)
    expect(screen.getByText('3 pendaftaran baru')).toBeInTheDocument()
    expect(screen.getByText('2 UMKM menunggu')).toBeInTheDocument()
    expect(screen.getByText('5 warga')).toBeInTheDocument()
  })

  it('renders countNum badge when provided', () => {
    render(<TaskGrid tasks={mockTasks} />)
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('does not render countNum badge when not provided', () => {
    render(<TaskGrid tasks={mockTasks} />)
    const counts = screen.getAllByText(/^\d+$/)
    expect(counts.length).toBe(2)
  })

  it('renders links with correct href', () => {
    render(<TaskGrid tasks={mockTasks} />)
    const link = screen.getByText('Verifikasi Warga').closest('a')
    expect(link).toHaveAttribute('href', '/verifikasi-warga')
  })

  it('renders default href when not provided', () => {
    render(<TaskGrid tasks={mockTasks} />)
    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      expect(link).toHaveAttribute('href')
    })
    const noHrefTask = screen.getByText('Validasi UMKM').closest('a')
    expect(noHrefTask).toHaveAttribute('href', '#')
  })

  it('renders icons', () => {
    const { container } = render(<TaskGrid tasks={mockTasks} />)
    expect(container.querySelectorAll('[data-testid="task-icon"]').length).toBe(3)
  })

  it('handles empty tasks', () => {
    const { container } = render(<TaskGrid tasks={[]} />)
    expect(container.querySelectorAll('a').length).toBe(0)
  })
})
