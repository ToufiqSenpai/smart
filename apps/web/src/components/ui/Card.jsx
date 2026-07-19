const base = "bg-bg-card border border-border-subtle rounded-[20px] shadow-lux p-6";

const variants = {
  default: base,
  stat: `${base} relative overflow-hidden hover:-translate-y-1 hover:shadow-lux-hover transition-all duration-300`,
  bento: `${base} flex flex-col hover:shadow-lux-hover transition-all duration-300`,
  accent: `${base} relative overflow-hidden hover:-translate-y-1 hover:shadow-lux-hover transition-all duration-300 border-warning/20 bg-gradient-to-br from-white to-warning-bg`,
};

export default function Card({ variant = "default", className = "", children }) {
  return <div className={`${variants[variant]} ${className}`}>{children}</div>;
}
