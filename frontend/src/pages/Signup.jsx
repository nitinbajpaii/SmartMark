import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Mail, Lock, User, GraduationCap, BookOpen, UserCheck, Zap, Shield, BarChart3, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const roles = [
  { value: 'Student', icon: GraduationCap, label: 'Student' },
  { value: 'Teacher', icon: BookOpen, label: 'Teacher' },
  { value: 'Mentor', icon: UserCheck, label: 'Mentor' },
]

const brandFeatures = [
  { icon: Shield, text: 'Location-verified attendance' },
  { icon: BarChart3, text: 'Real-time analytics dashboard' },
  { icon: Users, text: 'Role-based access for all users' },
  { icon: Zap, text: 'QR-powered instant check-in' },
]

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'Student' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!form.email.endsWith('@gmail.com')) {
      setError('Email must end with @gmail.com')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    const res = await signup(form.name, form.email, form.password, form.role)
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
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-blue-600/20 via-indigo-700/20 to-purple-700/20 border-r border-white/[0.07] p-12 relative overflow-hidden">
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
              Join the smarter<br />
              <span className="gradient-text">way to attend.</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Create your free account and start managing or tracking attendance with confidence.
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
          className="w-full max-w-md space-y-7"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Create an account</h1>
            <p className="text-gray-400">Start managing attendance today. Free forever.</p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <Input label="Full Name" name="name" placeholder="Jane Smith" icon={User} required onChange={onChange} />
            <Input label="Email address" name="email" type="email" placeholder="you@gmail.com" icon={Mail} required onChange={onChange} />
            <Input label="Password" name="password" type="password" placeholder="Min. 6 characters" icon={Lock} required onChange={onChange} />
            <Input label="Confirm Password" name="confirm" type="password" placeholder="Repeat password" icon={Lock} required onChange={onChange} />

            {/* Role pill selector */}
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-300">I am a…</span>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(({ value, icon: Icon, label }) => {
                  const active = form.role === value
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, role: value }))}
                      className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
                        active
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-glow-purple'
                          : 'bg-white/[0.04] border-white/10 text-gray-400 hover:bg-white/[0.07] hover:text-white'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${active ? 'text-purple-400' : 'text-gray-500'}`} />
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <Button className="w-full py-3.5 text-base" loading={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Have an account?{' '}
            <Link className="text-purple-400 hover:text-purple-300 font-medium transition-colors" to="/login">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
