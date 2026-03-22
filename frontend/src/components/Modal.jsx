import { useEffect } from 'react'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

// Enhanced Modal with slide-up animation, X close button, proper layout
export default function Modal({ open, onClose, children, title }) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            className="relative glass-card w-full max-w-lg overflow-hidden"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 360 }}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10">
                <h2 className="text-base font-semibold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {/* Body */}
            <div className="px-6 py-5">
              {children}
            </div>
            {/* Footer close button if no title provided */}
            {!title && (
              <div className="px-6 pb-5 flex justify-end">
                <button
                  onClick={onClose}
                  className="outline-btn px-4 py-2 text-sm"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
