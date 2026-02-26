import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'

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
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-md p-8 transition-all duration-300 hover:shadow-purple-500/20 hover:scale-[1.01]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-gray-300">Sign in to your account</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input label="Email" name="email" type="email" required onChange={onChange} />
          <Input label="Password" name="password" type="password" required onChange={onChange} />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <Button className="w-full">{loading ? 'Signing in...' : 'Sign In'}</Button>
        </form>
        <div className="text-center text-sm text-gray-300 mt-4">
          No account? <Link className="text-white underline" to="/signup">Create one</Link>
        </div>
      </div>
    </div>
  )
}
