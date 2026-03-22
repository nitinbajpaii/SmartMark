import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Mail, Lock, Zap, Shield, BarChart3, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const brandFeatures = [
  { icon: Shield, text: 'Location-verified attendance' },
  { icon: BarChart3, text: 'Real-time analytics dashboard' },
  { icon: Users, text: 'Role-based access for all users' },
  { icon: Zap, text: 'QR-powered instant check-in' },
]

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await login(form.email, form.password)
    setLoading(false)
    if (!res.ok) {
      setError(res.message)
      return
    }
    if (res.user.role === 'Student') navigate('/student')
    if (res.user.role === 'Teacher') navigate('/teacher')
    if (res.user.role === 'Mentor') navigate('/mentor')
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex">
      {/* Left branding panel - hidden on mobile */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-blue-600/20 via-indigo-700/20 to-purple-700/20 border-r border-white/[0.07] p-12 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-glow">
              S
            </div>
            <span className="font-bold text-white text-lg">SmartMark</span>
          </div>
        </div>

        <div className="relative space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Attendance made<br />
              <span className="gradient-text">intelligent.</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              The modern platform that makes attendance fraud-free, effortless, and fully automated.
            </p>
          </div>
          <ul className="space-y-3">
            {brandFeatures.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-gray-300">
                <div className="h-7 w-7 rounded-lg bg-white/[0.07] border border-white/10 flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5 text-purple-400" />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-gray-600">© {new Date().getFullYear()} SmartMark</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome back</h1>
            <p className="text-gray-400">Sign in to your SmartMark account.</p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <Input
              label="Email address"
              name="email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              required
              onChange={onChange}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Your password"
              icon={Lock}
              required
              onChange={onChange}
            />

            {error && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <Button className="w-full py-3.5 text-base" loading={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500">
            No account?{' '}
            <Link className="text-purple-400 hover:text-purple-300 font-medium transition-colors" to="/signup">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
