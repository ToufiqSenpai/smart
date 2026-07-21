import http from '../utils/http'

export function getDashboard() {
  return http.get('/dashboard')
}

export function getDashboardActivities() {
  return http.get('/dashboard/activities')
}
