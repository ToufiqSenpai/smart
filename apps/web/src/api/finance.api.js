import http from '../utils/http'

export function getExpenses(params) {
  return http.get('/finance/expenses', { params })
}

export function getExpenseById(id) {
  return http.get(`/finance/expenses/${id}`)
}

export function createExpense(data) {
  return http.post('/finance/expenses', data)
}

export function updateExpense(id, data) {
  return http.patch(`/finance/expenses/${id}`, data)
}

export function deleteExpense(id) {
  return http.delete(`/finance/expenses/${id}`)
}

export function getFinanceReport(params) {
  return http.get('/finance/report', { params })
}
