// Enhanced Button component with variants, sizes, loading state and icon support
export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon = null,
  ...props
}) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-7 py-3.5 text-base',
  }

  const variantClasses = {
    primary: 'gradient-btn',
    outline: 'outline-btn',
    ghost: 'ghost-btn',
    danger: 'danger-btn',
  }

  return (
    <button
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon className="h-4 w-4 shrink-0" />
      ) : null}
      {children}
    </button>
  )
}
