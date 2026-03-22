import { useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

// DashboardLayout: desktop sidebar + mobile off-canvas drawer
export default function DashboardLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/[0.07] bg-white/[0.02]">
        <Sidebar />
      </aside>

      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden fixed bottom-5 right-5 z-30 gradient-btn h-12 w-12 rounded-2xl shadow-glow-lg p-0 flex items-center justify-center"
        onClick={() => setDrawerOpen(v => !v)}
        aria-label="Toggle sidebar"
      >
        {drawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 bottom-0 w-72 z-30 glass-card rounded-none rounded-r-3xl border-l-0 lg:hidden"
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              <Sidebar onNavigate={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {children}
        </div>
      </main>
    </div>
  )
}
