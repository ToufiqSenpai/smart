import {
  getIssues, getMyIssues, getIssueById, createIssue,
  updateIssue, verifyIssue, followUpIssue,
} from '../api/issues.api'

const mockHttp = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), patch: vi.fn() }))
vi.mock('../utils/http', () => ({ default: mockHttp }))

describe('issues.api', () => {
  afterEach(() => vi.clearAllMocks())

  it('getIssues sends GET /issues with params', () => {
    getIssues({ status: 'PENDING' })
    expect(mockHttp.get).toHaveBeenCalledWith('/issues', { params: { status: 'PENDING' } })
  })

  it('getMyIssues sends GET /issues/me', () => {
    getMyIssues()
    expect(mockHttp.get).toHaveBeenCalledWith('/issues/me')
  })

  it('getIssueById sends GET /issues/:id', () => {
    getIssueById('5')
    expect(mockHttp.get).toHaveBeenCalledWith('/issues/5')
  })

  it('createIssue sends POST /issues with data', () => {
    createIssue({ kategori_kendala: 'Jalan Rusak', deskripsi: 'Lubang besar' })
    expect(mockHttp.post).toHaveBeenCalledWith('/issues', {
      kategori_kendala: 'Jalan Rusak',
      deskripsi: 'Lubang besar',
    })
  })

  it('updateIssue sends PATCH /issues/:id', () => {
    updateIssue('2', { deskripsi: 'Updated' })
    expect(mockHttp.patch).toHaveBeenCalledWith('/issues/2', { deskripsi: 'Updated' })
  })

  it('verifyIssue sends PATCH /issues/:id/status', () => {
    verifyIssue('3', { status: 'VERIFIED' })
    expect(mockHttp.patch).toHaveBeenCalledWith('/issues/3/status', { status: 'VERIFIED' })
  })

  it('followUpIssue sends PATCH /issues/:id/follow-up', () => {
    followUpIssue('4', { tanggapan: 'Sudah diperbaiki', status: 'RESOLVED' })
    expect(mockHttp.patch).toHaveBeenCalledWith('/issues/4/follow-up', {
      tanggapan: 'Sudah diperbaiki',
      status: 'RESOLVED',
    })
  })
})
