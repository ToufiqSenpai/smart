export default function SectionDivider({ icon, label = "" }) {
  const Icon = icon;
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-border-subtle" />
      <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-card border border-border-subtle rounded-full text-text-secondary text-xs font-semibold whitespace-nowrap">
        {icon && (typeof icon === "function" ? <Icon className="w-3.5 h-3.5" /> : icon)}
        {label}
      </div>
      <div className="flex-1 h-px bg-border-subtle" />
    </div>
  );
}
