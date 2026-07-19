import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { ArrowRight } from "../ui/Icons";

export default function BentoGrid({ sections = [] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
      {sections.map((section, i) => (
        <Card key={i} variant="bento">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-text-primary font-bold text-base">{section.title}</h3>
              <p className="text-text-secondary text-xs mt-0.5">{section.subtitle}</p>
            </div>
            {section.pill && (
              <Badge variant={section.pillVariant || "default"}>{section.pill}</Badge>
            )}
          </div>
          <div className="flex-1 space-y-3">
            {(section.rows || []).map((row, j) => (
              <div key={j} className="flex items-center justify-between py-2.5 border-b border-border-subtle last:border-0">
                <span className="text-text-primary text-sm font-medium">{row.label}</span>
                {row.badge && (
                  <Badge variant={row.badgeVariant || "default"}>{row.badge}</Badge>
                )}
              </div>
            ))}
          </div>
          {section.footer && (
            <a
              href={section.footer.href || "#"}
              className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-sm text-text-muted hover:text-primary transition-colors group"
            >
              <span>{section.footer.label || "View all"}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          )}
        </Card>
      ))}
    </div>
  );
}
