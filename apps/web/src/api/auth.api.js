import http from '../utils/http'

export function login({ email, username, password }) {
  return http.post('/auth/login', { email, username, password })
}

export function register({ nik, email, nama, alamat, noHp, username, password }) {
  return http.post('/residents/register', {
    nik,
    email,
    nama,
    alamat,
    no_hp: noHp,
    username,
    password,
  })
}
