import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Logo from './Logo.jsx'
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

function Avatar({ name }) {
  const initials = (name || 'U').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-sm font-semibold shadow-glow shrink-0">
      {initials}
    </div>
  )
}

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const dashPath = user?.role === 'Teacher' ? '/teacher' : user?.role === 'Mentor' ? '/mentor' : '/student'

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: dashPath, label: 'Dashboard' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  const isActive = (to) => location.pathname === to

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="group flex items-center gap-2.5">
            <Logo size={9} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
            <span className="font-bold text-base tracking-tight group-hover:gradient-text transition-all duration-300">SmartMark</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to)
                    ? 'text-purple-300 bg-purple-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <Avatar name={user.name} />
                  <div className="text-sm leading-tight">
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-xs text-gray-400">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); navigate('/login') }}
                  className="ghost-btn px-3 py-2 text-sm gap-1.5"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="gradient-btn px-4 py-2 text-sm">
                Sign In
              </Link>
            )}
            {/* Mobile hamburger */}
            <button
              className="md:hidden ghost-btn p-2 rounded-lg"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              className="fixed top-16 left-0 right-0 z-40 mx-3 md:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', damping: 28, stiffness: 360 }}
            >
              <div className="glass-card p-3 space-y-1">
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(to)
                        ? 'bg-purple-500/15 text-purple-300'
                        : 'text-gray-300 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4 opacity-60" />
                    {label}
                  </Link>
                ))}
                {user && (
                  <button
                    onClick={() => { logout(); navigate('/login'); setMobileOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
