import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('axios', () => {
  const reqUse = vi.fn()
  const resUse = vi.fn()
  return {
    default: {
      create: vi.fn(() => ({
        interceptors: { request: { use: reqUse }, response: { use: resUse } },
      })),
    },
  }
})

async function getHandlers() {
  const { default: axios } = await import('axios')
  const instance = axios.create.mock.results[0].value
  const requestHandler = instance.interceptors.request.use.mock.calls[0][0]
  const responseSuccess = instance.interceptors.response.use.mock.calls[0][0]
  const responseError = instance.interceptors.response.use.mock.calls[0][1]
  return { requestHandler, responseSuccess, responseError }
}

describe('http instance', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    localStorage.clear()
  })

  it('creates axios instance with correct config', async () => {
    const { default: axios } = await import('axios')
    await import('../utils/http')
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: '/api/v1',
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' },
    })
  })

  it('request interceptor adds Authorization when token exists', async () => {
    localStorage.setItem('accessToken', 'test-token')
    await import('../utils/http')
    const { requestHandler } = await getHandlers()
    const config = { headers: {} }
    const result = requestHandler(config)
    expect(result.headers.Authorization).toBe('Bearer test-token')
  })

  it('request interceptor does not add header when no token', async () => {
    await import('../utils/http')
    const { requestHandler } = await getHandlers()
    const config = { headers: {} }
    const result = requestHandler(config)
    expect(result.headers.Authorization).toBeUndefined()
  })

  it('response interceptor returns response.data on success', async () => {
    await import('../utils/http')
    const { responseSuccess } = await getHandlers()
    const response = { data: { ok: true }, status: 200 }
    expect(responseSuccess(response)).toEqual({ ok: true })
  })

  it('response interceptor clears token and redirects on 401', async () => {
    delete window.location
    window.location = { href: '' }
    localStorage.setItem('accessToken', 'to-remove')

    await import('../utils/http')
    const { responseError } = await getHandlers()
    const error = { response: { status: 401, data: { message: 'Unauthorized' } } }

    await expect(responseError(error)).rejects.toEqual({ message: 'Unauthorized' })
    expect(localStorage.getItem('accessToken')).toBeNull()
    expect(window.location.href).toBe('/login')
  })

  it('response interceptor passes through non-401 errors', async () => {
    await import('../utils/http')
    const { responseError } = await getHandlers()
    const error = { response: { status: 500, data: { message: 'Server error' } } }

    await expect(responseError(error)).rejects.toEqual({ message: 'Server error' })
  })
})
