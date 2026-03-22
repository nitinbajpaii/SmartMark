// Enhanced Card component with variant support
export default function Card({ children, className = '', variant = 'default', noPad = false }) {
  const base = {
    default: 'glass-card',
    stat: 'stat-card',
    flat: 'flat-card',
  }[variant] || 'glass-card'

  return (
    <div className={`${base} ${noPad ? '' : variant === 'stat' ? '' : 'p-6'} transition-all duration-300 hover:shadow-glow hover:border-white/20 ${className}`}>
      {children}
    </div>
  )
}
