import {
  getResidents, getResidentById, updateResident,
  getPendingVerifications, verifyResident,
  getOfficers, updateOfficerRole,
} from '../api/residents.api'

const mockHttp = vi.hoisted(() => ({ get: vi.fn(), patch: vi.fn() }))
vi.mock('../utils/http', () => ({ default: mockHttp }))

describe('residents.api', () => {
  afterEach(() => vi.clearAllMocks())

  it('getResidents sends GET /residents with params', () => {
    getResidents({ status: 'AKTIF' })
    expect(mockHttp.get).toHaveBeenCalledWith('/residents', { params: { status: 'AKTIF' } })
  })

  it('getResidentById sends GET /residents/:id', () => {
    getResidentById('1')
    expect(mockHttp.get).toHaveBeenCalledWith('/residents/1')
  })

  it('updateResident sends PATCH /residents/:id', () => {
    updateResident('1', { alamat: 'Jl. Baru' })
    expect(mockHttp.patch).toHaveBeenCalledWith('/residents/1', { alamat: 'Jl. Baru' })
  })

  it('getPendingVerifications sends GET /residents/pending-verifications', () => {
    getPendingVerifications()
    expect(mockHttp.get).toHaveBeenCalledWith('/residents/pending-verifications')
  })

  it('verifyResident sends PATCH /residents/:id/verification-status', () => {
    verifyResident('2', { status: 'AKTIF' })
    expect(mockHttp.patch).toHaveBeenCalledWith('/residents/2/verification-status', { status: 'AKTIF' })
  })

  it('getOfficers sends GET /residents/officers', () => {
    getOfficers()
    expect(mockHttp.get).toHaveBeenCalledWith('/residents/officers')
  })

  it('updateOfficerRole sends PATCH /residents/:id/officer-role', () => {
    updateOfficerRole('3', { jabatan: 'Sekretaris', periodeJabatan: '2026-2027' })
    expect(mockHttp.patch).toHaveBeenCalledWith('/residents/3/officer-role', {
      jabatan: 'Sekretaris',
      periodeJabatan: '2026-2027',
    })
  })
})
