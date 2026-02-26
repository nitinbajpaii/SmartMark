import { createContext, useContext, useEffect, useState } from 'react'
import * as api from '../services/api.js'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('sa_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = async (email, password) => {
    const res = await api.login(email, password)
    if (res.ok) {
      setUser(res.user)
      localStorage.setItem('sa_user', JSON.stringify(res.user))
    }
    return res
  }

  const signup = async (name, email, password, role) => {
    const res = await api.signup(name, email, password, role)
    if (res.ok) {
      setUser(res.user)
      localStorage.setItem('sa_user', JSON.stringify(res.user))
    }
    return res
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('sa_user')
  }

  return (
    <Ctx.Provider value={{ user, login, signup, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)
