import {
  getExpenses, getExpenseById, createExpense,
  updateExpense, deleteExpense, getFinanceReport,
} from '../api/finance.api'

const mockHttp = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() }))
vi.mock('../utils/http', () => ({ default: mockHttp }))

describe('finance.api', () => {
  afterEach(() => vi.clearAllMocks())

  it('getExpenses sends GET /finance/expenses with params', () => {
    getExpenses({ kategori: 'Operasional' })
    expect(mockHttp.get).toHaveBeenCalledWith('/finance/expenses', { params: { kategori: 'Operasional' } })
  })

  it('getExpenseById sends GET /finance/expenses/:id', () => {
    getExpenseById('2')
    expect(mockHttp.get).toHaveBeenCalledWith('/finance/expenses/2')
  })

  it('createExpense sends POST /finance/expenses with data', () => {
    createExpense({ kategori: 'Kegiatan', nominal: 100000 })
    expect(mockHttp.post).toHaveBeenCalledWith('/finance/expenses', { kategori: 'Kegiatan', nominal: 100000 })
  })

  it('updateExpense sends PATCH /finance/expenses/:id', () => {
    updateExpense('1', { nominal: 150000 })
    expect(mockHttp.patch).toHaveBeenCalledWith('/finance/expenses/1', { nominal: 150000 })
  })

  it('deleteExpense sends DELETE /finance/expenses/:id', () => {
    deleteExpense('3')
    expect(mockHttp.delete).toHaveBeenCalledWith('/finance/expenses/3')
  })

  it('getFinanceReport sends GET /finance/report with params', () => {
    getFinanceReport({ periode: '2026-07' })
    expect(mockHttp.get).toHaveBeenCalledWith('/finance/report', { params: { periode: '2026-07' } })
  })
})
