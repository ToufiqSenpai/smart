const variants = {
  success: "bg-success-bg text-success border border-success/10",
  warning: "bg-warning-bg text-warning border border-warning/10",
  error: "bg-error-bg text-error border border-error/10",
  teal: "bg-teal-bg text-teal border border-teal/10",
  default: "bg-warning-bg text-warning border border-warning/10",
};

export default function Badge({ variant = "default", className = "", children }) {
  return (
    <span
      className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 whitespace-nowrap ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
