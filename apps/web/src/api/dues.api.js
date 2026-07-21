import http from '../utils/http'

// Dues
export function getDues(params) {
  return http.get('/dues', { params })
}

export function getDueById(id) {
  return http.get(`/dues/${id}`)
}

export function createDue(data) {
  return http.post('/dues', data)
}

export function updateDue(id, data) {
  return http.patch(`/dues/${id}`, data)
}

export function toggleDueStatus(id, data) {
  return http.patch(`/dues/${id}/status`, data)
}

// Payments
export function getCurrentBills() {
  return http.get('/dues/bills/current')
}

export function getMyPayments() {
  return http.get('/dues/me/payments')
}

export function getAllPayments(params) {
  return http.get('/dues/payments', { params })
}

export function getPaymentById(id) {
  return http.get(`/dues/payments/${id}`)
}

export function submitPayment(data) {
  return http.post('/dues/payments', data)
}

export function verifyPayment(id, data) {
  return http.patch(`/dues/payments/${id}/status`, data)
}
