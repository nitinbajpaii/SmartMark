export default function Modal({ open, onClose, children, title }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-lg p-6">
        {title && <div className="text-lg font-semibold mb-4">{title}</div>}
        {children}
        <div className="mt-6 text-right">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-all">Close</button>
        </div>
      </div>
    </div>
  )
}
