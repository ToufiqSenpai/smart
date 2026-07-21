import http from '../utils/http'

export function getBusinesses(params) {
  return http.get('/businesses', { params })
}

export function getMyBusinesses() {
  return http.get('/businesses/me')
}

export function getBusinessById(id) {
  return http.get(`/businesses/${id}`)
}

export function createBusiness(data) {
  return http.post('/businesses', data)
}

export function updateBusiness(id, data) {
  return http.patch(`/businesses/${id}`, data)
}

export function validateBusiness(id, data) {
  return http.patch(`/businesses/${id}/status`, data)
}
