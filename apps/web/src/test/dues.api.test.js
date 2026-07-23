import {
  getDues, getDueById, createDue, updateDue, toggleDueStatus,
  getCurrentBills, getMyPayments, getAllPayments, getPaymentById,
  submitPayment, verifyPayment,
} from '../api/dues.api'

const mockHttp = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), patch: vi.fn() }))
vi.mock('../utils/http', () => ({ default: mockHttp }))

describe('dues.api', () => {
  afterEach(() => vi.clearAllMocks())

  it('getDues sends GET /dues with params', () => {
    getDues({ page: 1 })
    expect(mockHttp.get).toHaveBeenCalledWith('/dues', { params: { page: 1 } })
  })

  it('getDueById sends GET /dues/:id', () => {
    getDueById('1')
    expect(mockHttp.get).toHaveBeenCalledWith('/dues/1')
  })

  it('createDue sends POST /dues with data', () => {
    createDue({ nama_iuran: 'Iuran Bulanan', nominal: 50000 })
    expect(mockHttp.post).toHaveBeenCalledWith('/dues', { nama_iuran: 'Iuran Bulanan', nominal: 50000 })
  })

  it('updateDue sends PATCH /dues/:id with data', () => {
    updateDue('1', { nominal: 60000 })
    expect(mockHttp.patch).toHaveBeenCalledWith('/dues/1', { nominal: 60000 })
  })

  it('toggleDueStatus sends PATCH /dues/:id/status', () => {
    toggleDueStatus('1', { status: 'ACTIVE' })
    expect(mockHttp.patch).toHaveBeenCalledWith('/dues/1/status', { status: 'ACTIVE' })
  })

  it('getCurrentBills sends GET /dues/bills/current', () => {
    getCurrentBills()
    expect(mockHttp.get).toHaveBeenCalledWith('/dues/bills/current')
  })

  it('getMyPayments sends GET /dues/me/payments', () => {
    getMyPayments()
    expect(mockHttp.get).toHaveBeenCalledWith('/dues/me/payments')
  })

  it('getAllPayments sends GET /dues/payments with params', () => {
    getAllPayments({ status: 'PENDING' })
    expect(mockHttp.get).toHaveBeenCalledWith('/dues/payments', { params: { status: 'PENDING' } })
  })

  it('getPaymentById sends GET /dues/payments/:id', () => {
    getPaymentById('1')
    expect(mockHttp.get).toHaveBeenCalledWith('/dues/payments/1')
  })

  it('submitPayment sends POST /dues/payments with data', () => {
    submitPayment({ dueId: '1', amount: 50000 })
    expect(mockHttp.post).toHaveBeenCalledWith('/dues/payments', { dueId: '1', amount: 50000 })
  })

  it('verifyPayment sends PATCH /dues/payments/:id/status', () => {
    verifyPayment('1', { status: 'VERIFIED' })
    expect(mockHttp.patch).toHaveBeenCalledWith('/dues/payments/1/status', { status: 'VERIFIED' })
  })
})
