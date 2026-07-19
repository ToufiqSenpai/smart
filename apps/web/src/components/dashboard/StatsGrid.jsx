import Card from "../ui/Card";
import { ArrowUpRight } from "../ui/Icons";

export default function StatsGrid({ stats = [] }) {
  const cols = stats.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-5`}>
      {stats.map((s, i) => (
        <Card key={i} variant="stat">
          <div className="flex items-start justify-between mb-3">
            <span className={`p-2.5 rounded-xl ${s.accent || "bg-primary/10 text-primary"}`}>
              {s.icon}
            </span>
            <ArrowUpRight className={`w-4 h-4 ${s.accent ? s.accent.replace("bg-", "text-").replace("/10", "") : "text-primary"}`} />
          </div>
          <p className="text-3xl font-bold text-text-primary tracking-tight">{s.number}</p>
          <p className="text-text-secondary text-sm mt-0.5">{s.label}</p>
          {s.meta && (
            <p className="text-text-muted text-xs mt-1.5">{s.meta}</p>
          )}
        </Card>
      ))}
    </div>
  );
}
