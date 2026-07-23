import { render, screen } from '@testing-library/react'
import AnnouncementList from '../components/dashboard/AnnouncementList'

const mockAnnouncements = [
  {
    title: 'Rapat Warga Bulanan',
    date: '12 Jul 2026',
    excerpt: 'Undangan rapat warga bulan Juli di balai RT.',
    status: 'PUBLISHED',
    statusColor: 'text-success',
  },
  {
    title: 'Pembersihan Got',
    date: '10 Jul 2026',
    excerpt: 'Kegiatan kerja bakti membersihkan selokan.',
  },
]

describe('AnnouncementList', () => {
  it('renders all announcement titles', () => {
    render(<AnnouncementList announcements={mockAnnouncements} />)
    expect(screen.getByText('Rapat Warga Bulanan')).toBeInTheDocument()
    expect(screen.getByText('Pembersihan Got')).toBeInTheDocument()
  })

  it('renders dates', () => {
    render(<AnnouncementList announcements={mockAnnouncements} />)
    expect(screen.getByText('12 Jul 2026')).toBeInTheDocument()
    expect(screen.getByText('10 Jul 2026')).toBeInTheDocument()
  })

  it('renders excerpts', () => {
    render(<AnnouncementList announcements={mockAnnouncements} />)
    expect(screen.getByText(/Undangan rapat warga/)).toBeInTheDocument()
    expect(screen.getByText(/Kegiatan kerja bakti/)).toBeInTheDocument()
  })

  it('renders status badge when provided', () => {
    render(<AnnouncementList announcements={mockAnnouncements} />)
    expect(screen.getByText('PUBLISHED')).toBeInTheDocument()
  })

  it('does not render status when not provided', () => {
    render(<AnnouncementList announcements={mockAnnouncements} />)
    const allStatusTexts = screen.queryAllByText(/PUBLISHED|DRAFT/)
    expect(allStatusTexts.length).toBe(1)
  })

  it('renders section heading', () => {
    render(<AnnouncementList announcements={mockAnnouncements} />)
    expect(screen.getByText('Announcements')).toBeInTheDocument()
  })

  it('renders "See all" link', () => {
    render(<AnnouncementList announcements={mockAnnouncements} />)
    expect(screen.getByText('See all')).toBeInTheDocument()
  })

  it('handles empty announcements', () => {
    const { container } = render(<AnnouncementList announcements={[]} />)
    const items = container.querySelectorAll('.space-y-4 > div')
    expect(items.length).toBe(0)
  })

  it('renders status with custom color', () => {
    render(<AnnouncementList announcements={mockAnnouncements} />)
    const status = screen.getByText('PUBLISHED')
    expect(status.className).toContain('text-success')
  })
})
