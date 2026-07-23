import { render, screen } from '@testing-library/react'
import FormInput from '../components/ui/FormInput'

describe('FormInput', () => {
  it('renders input with label', () => {
    render(<FormInput label="Nama Lengkap" />)
    expect(screen.getByLabelText('Nama Lengkap')).toBeInTheDocument()
    expect(screen.getByText('Nama Lengkap')).toBeInTheDocument()
  })

  it('renders input with default type', () => {
    render(<FormInput label="Email" />)
    const input = screen.getByLabelText('Email')
    expect(input.tagName).toBe('INPUT')
  })

  it('renders as textarea when as="textarea"', () => {
    render(<FormInput label="Alamat" as="textarea" />)
    const el = screen.getByLabelText('Alamat')
    expect(el.tagName).toBe('TEXTAREA')
  })

  it('renders as select when as="select"', () => {
    render(
      <FormInput label="Kategori" as="select">
        <option value="">Pilih</option>
      </FormInput>
    )
    const el = screen.getByLabelText('Kategori')
    expect(el.tagName).toBe('SELECT')
  })

  it('shows error message and hides helper', () => {
    render(<FormInput label="Nama" error="Field wajib diisi" helper="Bantuan" />)
    expect(screen.getByText('Field wajib diisi')).toBeInTheDocument()
    expect(screen.queryByText('Bantuan')).not.toBeInTheDocument()
  })

  it('shows helper text when no error', () => {
    render(<FormInput label="Nama" helper="Masukkan nama lengkap" />)
    expect(screen.getByText('Masukkan nama lengkap')).toBeInTheDocument()
  })

  it('shows hint in label', () => {
    render(<FormInput label="NIK" hint="16 digit" />)
    expect(screen.getByText('(16 digit)')).toBeInTheDocument()
  })

  it('auto-generates id from label', () => {
    render(<FormInput label="Nama Lengkap" />)
    expect(screen.getByLabelText('Nama Lengkap')).toHaveAttribute('id', 'nama-lengkap')
  })

  it('uses custom id prop', () => {
    render(<FormInput label="Nama" id="custom-id" />)
    expect(screen.getByLabelText('Nama')).toHaveAttribute('id', 'custom-id')
  })

  it('applies custom className to input', () => {
    render(<FormInput label="Nama" className="extra-class" />)
    expect(screen.getByLabelText('Nama').className).toContain('extra-class')
  })

  it('passes additional props to input', () => {
    render(<FormInput label="Password" type="password" placeholder="Min 8 karakter" />)
    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('type', 'password')
    expect(input).toHaveAttribute('placeholder', 'Min 8 karakter')
  })

  it('renders without label', () => {
    render(<FormInput placeholder="Tanpa label" />)
    expect(screen.getByPlaceholderText('Tanpa label')).toBeInTheDocument()
  })

  it('applies textarea specific classes', () => {
    render(<FormInput label="Deskripsi" as="textarea" />)
    const el = screen.getByLabelText('Deskripsi')
    expect(el.className).toContain('min-h-[100px]')
    expect(el.className).toContain('resize-y')
  })

  it('applies select specific classes', () => {
    render(
      <FormInput label="Pilih" as="select">
        <option>1</option>
      </FormInput>
    )
    const el = screen.getByLabelText('Pilih')
    expect(el.className).toContain('appearance-none')
  })
})
