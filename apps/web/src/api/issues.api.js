import http from '../utils/http'

export function getIssues(params) {
  return http.get('/issues', { params })
}

export function getMyIssues() {
  return http.get('/issues/me')
}

export function getIssueById(id) {
  return http.get(`/issues/${id}`)
}

export function createIssue(data) {
  return http.post('/issues', data)
}

export function updateIssue(id, data) {
  return http.patch(`/issues/${id}`, data)
}

export function verifyIssue(id, data) {
  return http.patch(`/issues/${id}/status`, data)
}

export function followUpIssue(id, data) {
  return http.patch(`/issues/${id}/follow-up`, data)
}
