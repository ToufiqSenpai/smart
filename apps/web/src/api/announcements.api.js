import http from '../utils/http'

export function getAnnouncements(params) {
  return http.get('/announcements', { params })
}

export function getAnnouncementById(id) {
  return http.get(`/announcements/${id}`)
}

export function createAnnouncement(data) {
  return http.post('/announcements', data)
}

export function updateAnnouncement(id, data) {
  return http.patch(`/announcements/${id}`, data)
}

export function deleteAnnouncement(id) {
  return http.delete(`/announcements/${id}`)
}
