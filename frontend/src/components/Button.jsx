export default function Button({ children, className, ...props }) {
  return (
    <button className={`gradient-btn hover:shadow-purple-500/30 px-5 py-3 ${className || ''}`} {...props}>
      {children}
    </button>
  )
}
