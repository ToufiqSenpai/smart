import http from '../utils/http'

export function getProfile() {
  return http.get('/profile/me')
}

export function updateProfile(data) {
  return http.patch('/profile/me', data)
}
