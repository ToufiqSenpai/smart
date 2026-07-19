const inputBase =
  "w-full bg-bg border border-border-subtle px-4 py-2.5 text-sm text-text-primary rounded-[10px] transition-all duration-200 placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light";

export default function FormInput({
  label,
  hint,
  error,
  helper,
  as: Component = "input",
  className = "",
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  const inputElement =
    Component === "textarea" ? (
      <textarea id={inputId} className={`${inputBase} min-h-[100px] resize-y ${className}`} {...props} />
    ) : Component === "select" ? (
      <select id={inputId} className={`${inputBase} appearance-none ${className}`} {...props}>
        {props.children}
      </select>
    ) : (
      <input id={inputId} className={`${inputBase} h-11 ${className}`} {...props} />
    );

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-text-primary tracking-wide">
          {label}
          {hint && <span className="text-text-muted font-normal ml-1">({hint})</span>}
        </label>
      )}
      {inputElement}
      {error && <p className="text-xs text-error mt-0.5">{error}</p>}
      {helper && !error && <p className="text-xs text-text-muted mt-0.5">{helper}</p>}
    </div>
  );
}
