import { login, register } from '../api/auth.api'

const mockHttp = vi.hoisted(() => ({ post: vi.fn() }))
vi.mock('../utils/http', () => ({ default: mockHttp }))

describe('auth.api', () => {
  afterEach(() => vi.clearAllMocks())

  it('login sends POST /auth/login with credentials', () => {
    login({ email: 'test@test.com', password: 'rahasia' })
    expect(mockHttp.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@test.com',
      username: undefined,
      password: 'rahasia',
    })
  })

  it('login sends username when provided', () => {
    login({ username: 'budi', password: '123' })
    expect(mockHttp.post).toHaveBeenCalledWith('/auth/login', {
      email: undefined,
      username: 'budi',
      password: '123',
    })
  })

  it('register sends POST /residents/register with mapped fields', () => {
    register({
      nik: '1234567890123456',
      email: 'budi@test.com',
      nama: 'Budi',
      alamat: 'Jl. Merdeka',
      noHp: '08123456789',
      username: 'budi123',
      password: 'rahasia',
    })
    expect(mockHttp.post).toHaveBeenCalledWith('/residents/register', {
      nik: '1234567890123456',
      email: 'budi@test.com',
      nama: 'Budi',
      alamat: 'Jl. Merdeka',
      no_hp: '08123456789',
      username: 'budi123',
      password: 'rahasia',
    })
  })
})
