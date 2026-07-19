import Badge from "../ui/Badge";

export default function ActivitySection({ activities = [] }) {
  return (
    <div>
      <h2 className="text-text-primary font-bold text-base mb-4">Aktivitas Terbaru</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activities.map((a, i) => {
          const Icon = a.icon;
          return (
            <div
              key={i}
              className={`bg-bg-card border border-border-subtle rounded-[20px] p-5 hover:shadow-lux-hover transition-all duration-300 ${a.borderColor ? `border-l-4 ${a.borderColor}` : ""}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  {typeof a.icon === "function" ? <Icon /> : Icon}
                </div>
                <h3 className="text-text-primary font-semibold text-sm">{a.title}</h3>
              </div>
              {a.badge && (
                <Badge variant={a.badgeVariant || "default"} className="mb-2">{a.badge}</Badge>
              )}
              {a.meta && (
                <p className="text-text-muted text-xs mt-2">{a.meta}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
