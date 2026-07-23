import {
  getAnnouncements, getAnnouncementById, createAnnouncement,
  updateAnnouncement, deleteAnnouncement,
} from '../api/announcements.api'

const mockHttp = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() }))
vi.mock('../utils/http', () => ({ default: mockHttp }))

describe('announcements.api', () => {
  afterEach(() => vi.clearAllMocks())

  it('getAnnouncements sends GET /announcements with params', () => {
    getAnnouncements({ status: 'PUBLISHED' })
    expect(mockHttp.get).toHaveBeenCalledWith('/announcements', { params: { status: 'PUBLISHED' } })
  })

  it('getAnnouncementById sends GET /announcements/:id', () => {
    getAnnouncementById('3')
    expect(mockHttp.get).toHaveBeenCalledWith('/announcements/3')
  })

  it('createAnnouncement sends POST /announcements with data', () => {
    createAnnouncement({ judul: 'Pengumuman', isi_pengumuman: 'Isi', status_publikasi: 'DRAFT' })
    expect(mockHttp.post).toHaveBeenCalledWith('/announcements', {
      judul: 'Pengumuman',
      isi_pengumuman: 'Isi',
      status_publikasi: 'DRAFT',
    })
  })

  it('updateAnnouncement sends PATCH /announcements/:id', () => {
    updateAnnouncement('1', { judul: 'Update' })
    expect(mockHttp.patch).toHaveBeenCalledWith('/announcements/1', { judul: 'Update' })
  })

  it('deleteAnnouncement sends DELETE /announcements/:id', () => {
    deleteAnnouncement('5')
    expect(mockHttp.delete).toHaveBeenCalledWith('/announcements/5')
  })
})
