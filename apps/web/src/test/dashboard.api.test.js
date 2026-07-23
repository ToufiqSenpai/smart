import { getDashboard, getDashboardActivities } from '../api/dashboard.api'

const mockHttp = vi.hoisted(() => ({ get: vi.fn() }))
vi.mock('../utils/http', () => ({ default: mockHttp }))

describe('dashboard.api', () => {
  afterEach(() => vi.clearAllMocks())

  it('getDashboard sends GET /dashboard', () => {
    getDashboard()
    expect(mockHttp.get).toHaveBeenCalledWith('/dashboard')
  })

  it('getDashboardActivities sends GET /dashboard/activities', () => {
    getDashboardActivities()
    expect(mockHttp.get).toHaveBeenCalledWith('/dashboard/activities')
  })
})
