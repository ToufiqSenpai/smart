import { ArrowRight } from "../ui/Icons";

export default function AnnouncementList({ announcements = [] }) {
  return (
    <div className="bg-bg-card border border-border-subtle rounded-[20px] shadow-lux p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-text-primary font-bold text-base">Announcements</h2>
        <a href="#" className="text-text-muted hover:text-primary transition-colors text-sm flex items-center gap-1.5">
          See all <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
      <div className="space-y-4">
        {announcements.map((a, i) => (
          <div key={i} className="pb-4 border-b border-border-subtle last:border-0 last:pb-0">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="text-text-primary font-semibold text-sm leading-snug">{a.title}</h3>
              <span className={`text-xs font-medium whitespace-nowrap shrink-0 ${a.statusColor || "text-text-muted"}`}>
                {a.date}
              </span>
            </div>
            <p className="text-text-secondary text-xs leading-relaxed">{a.excerpt}</p>
            {a.status && (
              <span className={`inline-block mt-1.5 text-xs font-semibold ${a.statusColor || "text-warning"}`}>
                {a.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
