import { render, screen } from '@testing-library/react'
import Card from '../components/ui/Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Konten Kartu</Card>)
    expect(screen.getByText('Konten Kartu')).toBeInTheDocument()
  })

  it('applies default variant class', () => {
    render(<Card>Default</Card>)
    const div = screen.getByText('Default')
    expect(div.className).toContain('rounded-[20px]')
  })

  it('applies stat variant class', () => {
    render(<Card variant="stat">Stat</Card>)
    const div = screen.getByText('Stat')
    expect(div.className).toContain('hover:-translate-y-1')
  })

  it('applies bento variant class', () => {
    render(<Card variant="bento">Bento</Card>)
    const div = screen.getByText('Bento')
    expect(div.className).toContain('flex-col')
  })

  it('applies accent variant class', () => {
    render(<Card variant="accent">Accent</Card>)
    const div = screen.getByText('Accent')
    expect(div.className).toContain('from-white')
  })

  it('merges custom className', () => {
    render(<Card className="my-custom-class">Custom</Card>)
    expect(screen.getByText('Custom').className).toContain('my-custom-class')
  })
})
