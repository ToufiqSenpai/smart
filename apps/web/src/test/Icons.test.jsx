import { render } from '@testing-library/react'
import * as Icons from '../components/ui/Icons'

const iconNames = [
  'Users', 'Check', 'Clock', 'Shield', 'CheckCircle', 'AlertCircle',
  'ArrowRight', 'ArrowUpRight', 'Calendar', 'FileText', 'Bell',
  'TrendingUp', 'Activity', 'Zap', 'ChevronDown', 'Logout', 'Menu',
]

describe('Icons', () => {
  describe.each(iconNames)('%s', (name) => {
    const Icon = Icons[name]

    it('renders an SVG element', () => {
      const { container } = render(<Icon />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('uses default className w-5 h-5', () => {
      const { container } = render(<Icon />)
      const svg = container.querySelector('svg')
      expect(svg.getAttribute('class')).toBe('w-5 h-5')
    })

    it('accepts custom className', () => {
      const { container } = render(<Icon className="w-8 h-8 text-primary" />)
      const svg = container.querySelector('svg')
      expect(svg.getAttribute('class')).toBe('w-8 h-8 text-primary')
    })

    it('has viewBox attribute', () => {
      const { container } = render(<Icon />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    })
  })
})
