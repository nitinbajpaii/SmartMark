export default function Card({ children, className }) {
  return (
    <div className={`glass-card hover:shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300 p-6 ${className || ''}`}>
      {children}
    </div>
  )
}
