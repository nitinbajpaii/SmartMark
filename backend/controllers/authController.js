import { v4 as uuid } from 'uuid'
import crypto from 'crypto'
import { readUsers, writeUsers } from '../utils/store.js'

const hash = s => crypto.createHash('sha256').update(s).digest('hex')

export async function signup(req, res) {
  const { name, email, password, role } = req.body || {}
  if (!name || !email || !password || !role) return res.status(400).json({ message: 'All fields required' })
  if (!email.endsWith('@gmail.com')) return res.status(400).json({ message: 'Gmail required' })
  if (password.length < 6) return res.status(400).json({ message: 'Password too short' })
  const users = await readUsers()
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) return res.status(409).json({ message: 'Email already exists' })
  const user = {
    _id: uuid(),
    name,
    email,
    password: hash(password),
    role,
    createdAt: new Date().toISOString()
  }
  users.push(user)
  await writeUsers(users)
  const { password: _, ...publicUser } = user
  res.json({ user: publicUser })
}

export async function login(req, res) {
  const { email, password } = req.body || {}
  const users = await readUsers()
  const u = users.find(x => x.email.toLowerCase() === String(email).toLowerCase())
  if (!u || u.password !== hash(password)) return res.status(401).json({ message: 'Invalid credentials' })
  const { password: _, ...publicUser } = u
  res.json({ user: publicUser })
}

export async function listUsers(req, res) {
  const users = await readUsers()
  const publicUsers = users.map(({ password, ...u }) => u)
  res.json(publicUsers)
}
