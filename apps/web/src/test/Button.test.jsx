import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../components/ui/Button'

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Klik Saya</Button>)
    expect(screen.getByRole('button', { name: /klik saya/i })).toBeInTheDocument()
  })

  it('applies default variant and size classes', () => {
    render(<Button>Test</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-primary')
    expect(btn.className).toContain('h-11')
  })

  it('applies custom variant and size', () => {
    render(<Button variant="danger" size="sm">Hapus</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-error')
    expect(btn.className).toContain('h-9')
  })

  it('disables button and adds disabled styling', () => {
    render(<Button disabled>Disabled</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn.className).toContain('opacity-50')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Klik</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Klik</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders with custom className', () => {
    render(<Button className="extra-class">Custom</Button>)
    expect(screen.getByRole('button').className).toContain('extra-class')
  })

  it('uses button type by default', () => {
    render(<Button>Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })
})
