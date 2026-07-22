import http from '../utils/http'

export function getResidents(params) {
  return http.get('/residents', { params })
}

export function getResidentById(id) {
  return http.get(`/residents/${id}`)
}

export function updateResident(id, data) {
  return http.patch(`/residents/${id}`, data)
}

export function getPendingVerifications() {
  return http.get('/residents/pending-verifications')
}

export function verifyResident(id, data) {
  return http.patch(`/residents/${id}/verification-status`, data)
}

export function getOfficers() {
  return http.get('/residents/officers')
}

export function updateOfficerRole(id, data) {
  return http.patch(`/residents/${id}/officer-role`, data)
}

// Gunakan register() dari auth.api.js yang sudah memiliki mapping noHp → no_hp
