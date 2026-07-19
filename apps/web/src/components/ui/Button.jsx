const variants = {
  primary: "bg-primary text-white hover:bg-[#163b6a]",
  secondary: "bg-bg text-text-muted border border-border-subtle hover:bg-bg-hover",
  success: "bg-success text-white hover:brightness-90",
  danger: "bg-error text-white hover:brightness-90",
  outline: "bg-transparent text-primary border border-primary",
};

const sizes = {
  sm: "h-9 px-5 text-xs",
  md: "h-11 px-7 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  onClick,
  disabled = false,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-semibold rounded-full inline-flex items-center justify-center gap-2 transition-all duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
