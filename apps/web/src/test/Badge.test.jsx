import { render, screen } from '@testing-library/react'
import Badge from '../components/ui/Badge'

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies default variant class', () => {
    render(<Badge>Default</Badge>)
    const span = screen.getByText('Default')
    expect(span.className).toContain('rounded-full')
  })

  it('applies success variant', () => {
    render(<Badge variant="success">Success</Badge>)
    const span = screen.getByText('Success')
    expect(span.className).toContain('bg-success-bg')
  })

  it('applies error variant', () => {
    render(<Badge variant="error">Error</Badge>)
    const span = screen.getByText('Error')
    expect(span.className).toContain('bg-error-bg')
  })

  it('applies warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>)
    const span = screen.getByText('Warning')
    expect(span.className).toContain('bg-warning-bg')
  })

  it('merges custom className', () => {
    render(<Badge className="extra-class">Custom</Badge>)
    expect(screen.getByText('Custom').className).toContain('extra-class')
  })
})
