import { render, screen } from '@testing-library/react'
import SectionDivider from '../components/dashboard/SectionDivider'

function DummyIcon() {
  return <svg data-testid="divider-icon" />
}

describe('SectionDivider', () => {
  it('renders label text', () => {
    render(<SectionDivider label="Fitur Cepat" />)
    expect(screen.getByText('Fitur Cepat')).toBeInTheDocument()
  })

  it('renders icon when provided as function', () => {
    render(<SectionDivider icon={DummyIcon} label="Ikon" />)
    expect(document.querySelector('[data-testid="divider-icon"]')).toBeInTheDocument()
  })

  it('renders icon when provided as JSX element', () => {
    const icon = <svg data-testid="jsx-icon" />
    render(<SectionDivider icon={icon} label="JSX" />)
    expect(document.querySelector('[data-testid="jsx-icon"]')).toBeInTheDocument()
  })

  it('renders without icon', () => {
    const { container } = render(<SectionDivider label="Tanpa Ikon" />)
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })

  it('renders horizontal lines', () => {
    const { container } = render(<SectionDivider label="Test" />)
    const lines = container.querySelectorAll('.h-px')
    expect(lines.length).toBe(2)
  })
})
