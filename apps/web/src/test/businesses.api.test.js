import {
  getBusinesses, getMyBusinesses, getBusinessById,
  createBusiness, updateBusiness, validateBusiness,
} from '../api/businesses.api'

const mockHttp = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), patch: vi.fn() }))
vi.mock('../utils/http', () => ({ default: mockHttp }))

describe('businesses.api', () => {
  afterEach(() => vi.clearAllMocks())

  it('getBusinesses sends GET /businesses with params', () => {
    getBusinesses({ keyword: 'kuliner' })
    expect(mockHttp.get).toHaveBeenCalledWith('/businesses', { params: { keyword: 'kuliner' } })
  })

  it('getMyBusinesses sends GET /businesses/me', () => {
    getMyBusinesses()
    expect(mockHttp.get).toHaveBeenCalledWith('/businesses/me')
  })

  it('getBusinessById sends GET /businesses/:id', () => {
    getBusinessById('10')
    expect(mockHttp.get).toHaveBeenCalledWith('/businesses/10')
  })

  it('createBusiness sends POST /businesses with data', () => {
    createBusiness({ nama_usaha: 'Warung Makan', jenis_usaha: 'KULINER' })
    expect(mockHttp.post).toHaveBeenCalledWith('/businesses', {
      nama_usaha: 'Warung Makan',
      jenis_usaha: 'KULINER',
    })
  })

  it('updateBusiness sends PATCH /businesses/:id', () => {
    updateBusiness('1', { nama_usaha: 'Warung Baru' })
    expect(mockHttp.patch).toHaveBeenCalledWith('/businesses/1', { nama_usaha: 'Warung Baru' })
  })

  it('validateBusiness sends PATCH /businesses/:id/status', () => {
    validateBusiness('2', { status: 'VERIFIED' })
    expect(mockHttp.patch).toHaveBeenCalledWith('/businesses/2/status', { status: 'VERIFIED' })
  })
})
