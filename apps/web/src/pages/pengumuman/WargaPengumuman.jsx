import { useState, useEffect } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { getAnnouncementsApi } from "../../utils/mockApi"

const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-")
  return parseInt(d) + " " + months[parseInt(m) - 1] + " " + y
}

export default function WargaPengumuman() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("publik")
  const [expanded, setExpanded] = useState({})
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnnouncementsApi().then(setData).finally(() => setLoading(false))
  }, [])

  const filtered = data.filter((item) => {
    const statusMap = { PUBLISHED: "publik", DRAFT: "draft" }
    const matchSearch = item.judul.toLowerCase().includes(search.toLowerCase()) || item.isi_pengumuman.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || statusMap[item.status_publikasi] === statusFilter
    return matchSearch && matchStatus
  })

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <DashboardLayout>
      <div className="max-w-[1000px]">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold mb-2">Informasi RT</p>
          <h1 className="font-grotesk text-[32px] font-bold text-text-primary tracking-tight leading-tight mb-2">Pengumuman</h1>
          <p className="text-[14.5px] text-text-muted">Informasi dan pengumuman terbaru dari RT 08.</p>
        </div>

        <div className="bg-bg-card border border-border-subtle rounded-[20px] p-4 px-6 flex items-center gap-4 flex-wrap mb-8 shadow-lux">
          <div className="flex-1 min-w-[200px] relative">
            <svg className="icon absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            <input type="text" placeholder="Cari pengumuman..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full py-2 pl-[38px] pr-3 font-sans text-[13.5px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] transition-all focus:border-primary focus:ring-3 focus:ring-primary-light" />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="statusFilter" className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.05em]">Status</label>
            <select id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="py-1.5 pl-[14px] pr-8 font-sans text-[13px] text-text-primary bg-bg border border-border-subtle rounded-full outline-none h-[38px] appearance-none cursor-pointer transition-all focus:border-primary focus:ring-3 focus:ring-primary-light" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717A' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
              <option value="all">Semua</option>
              <option value="publik">Publik</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <span className="text-[12px] font-semibold text-text-muted bg-bg px-[14px] py-1 rounded-full border border-border-subtle whitespace-nowrap">{filtered.length} pengumuman</span>
        </div>

        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="text-center py-16 px-6 text-text-muted bg-bg-card rounded-[20px] border border-border-subtle">
              <h3 className="font-grotesk text-[20px] font-bold text-text-primary mb-2">Memuat...</h3>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 px-6 text-text-muted bg-bg-card rounded-[20px] border border-border-subtle">
              <svg className="w-14 h-14 text-border-subtle mb-4 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" /><line x1="8" y1="8" x2="16" y2="8" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="8" y1="16" x2="13" y2="16" /></svg>
              <h3 className="font-grotesk text-[20px] font-bold text-text-primary mb-2">Belum ada pengumuman</h3>
              <p className="text-[14px]">Belum ada pengumuman yang tersedia saat ini.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isExpanded = expanded[item.id]
              const statusIsPublished = item.status_publikasi === "PUBLISHED"
              return (
                <div key={item.id} className="bg-bg-card rounded-[20px] border border-border-subtle shadow-lux p-6 px-8 transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-lux-hover hover:border-border-hover" onClick={() => toggleExpand(item.id)}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="font-grotesk text-[18px] font-bold text-text-primary tracking-tight leading-snug">{item.judul}</div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.05em] shrink-0 ${statusIsPublished ? "bg-success-bg text-success border border-[rgba(21,128,61,0.1)]" : "bg-warning-bg text-warning border border-[rgba(180,83,9,0.1)]"}`}>
                      {statusIsPublished ? "● Publik" : "● Draft"}
                    </span>
                  </div>
                  <div className={`text-[14px] text-text-muted leading-relaxed mb-4 ${isExpanded ? "" : "line-clamp-3"}`}>
                    {item.isi_pengumuman}
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-border-subtle text-[12.5px] text-text-muted">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[12px]">{formatDate(item.tanggal_pengumuman)}</span>
                      <span>•</span>
                      <span className="text-text-muted">{item.author}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-12)" }}>
                      {item.lampiran && (
                        <span className="inline-flex items-center gap-1.5 text-primary font-semibold hover:opacity-80 no-underline">
                          <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                          {item.lampiran}
                        </span>
                      )}
                      <button className="bg-transparent border-none text-primary font-semibold text-[12.5px] cursor-pointer p-0 font-sans hover:opacity-80" onClick={(e) => { e.stopPropagation(); toggleExpand(item.id) }}>
                        {isExpanded ? "Sembunyikan" : "Baca selengkapnya"}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
