import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'

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
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-md p-8 transition-all duration-300 hover:shadow-purple-500/20 hover:scale-[1.01]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Create an account</h1>
          <p className="text-gray-300">Start managing attendance</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input label="Full Name" name="name" required onChange={onChange} />
          <Input label="Email" name="email" type="email" required onChange={onChange} />
          <Input label="Password" name="password" type="password" required onChange={onChange} />
          <Input label="Confirm Password" name="confirm" type="password" required onChange={onChange} />
          <label className="block space-y-2">
            <span className="text-gray-300">Role</span>
            <select name="role" value={form.role} onChange={onChange} className="input-premium px-4 py-3 w-full bg-transparent">
              <option className="bg-slate-900" value="Student">Student</option>
              <option className="bg-slate-900" value="Teacher">Teacher</option>
              <option className="bg-slate-900" value="Mentor">Mentor</option>
            </select>
          </label>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <Button className="w-full">{loading ? 'Creating...' : 'Sign Up'}</Button>
        </form>
        <div className="text-center text-sm text-gray-300 mt-4">
          Have an account? <Link className="text-white underline" to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
