import { render, screen } from '@testing-library/react'
import Table from '../components/ui/Table'

describe('Table', () => {
  it('renders headers', () => {
    render(<Table headers={['No', 'Nama', 'Aksi']} />)
    expect(screen.getByText('No')).toBeInTheDocument()
    expect(screen.getByText('Nama')).toBeInTheDocument()
    expect(screen.getByText('Aksi')).toBeInTheDocument()
  })

  it('renders children rows', () => {
    render(
      <Table headers={['Nama']}>
        <tr><td>John Doe</td></tr>
        <tr><td>Jane Smith</td></tr>
      </Table>
    )
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('handles empty headers array', () => {
    const { container } = render(<Table headers={[]} />)
    expect(container.querySelector('th')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Table headers={['Nama']} className="my-table" />)
    expect(container.querySelector('.overflow-x-auto').className).toContain('my-table')
  })

  it('renders table element with correct structure', () => {
    const { container } = render(<Table headers={['Kolom 1']} />)
    expect(container.querySelector('table')).toBeInTheDocument()
    expect(container.querySelector('thead')).toBeInTheDocument()
    expect(container.querySelector('tbody')).toBeInTheDocument()
  })

  it('renders header row with uppercase styling class', () => {
    const { container } = render(<Table headers={['Nama']} />)
    const tr = container.querySelector('thead tr')
    expect(tr.className).toContain('uppercase')
  })
})
