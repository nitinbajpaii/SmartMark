const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function signup(name, email, password, role) {
  try {
    const r = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    })
    const data = await r.json()
    if (!r.ok) return { ok: false, message: data.message || 'Failed' }
    return { ok: true, user: data.user }
  } catch (e) {
    return { ok: false, message: 'Network error' }
  }
}

export async function login(email, password) {
  try {
    const r = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await r.json()
    if (!r.ok) return { ok: false, message: data.message || 'Failed' }
    return { ok: true, user: data.user }
  } catch (e) {
    return { ok: false, message: 'Network error' }
  }
}

export async function createSession(payload) {
  const r = await fetch(`${BASE_URL}/api/sessions/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return r.json()
}

export async function getSessions() {
  const r = await fetch(`${BASE_URL}/api/sessions`)
  return r.json()
}

export async function startSession(id) {
  const r = await fetch(`${BASE_URL}/api/sessions/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
  return r.json()
}

export async function endSession(id) {
  const r = await fetch(`${BASE_URL}/api/sessions/end`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
  return r.json()
}

export async function deleteSession(id) {
  const r = await fetch(`${BASE_URL}/api/sessions/${id}`, {
    method: 'DELETE'
  })
  return r.json()
}

export async function markAttendance(payload) {
  try {
    const r = await fetch(`${BASE_URL}/api/attendance/mark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await r.json()
    if (!r.ok) return { ok: false, message: data.message || 'Failed' }
    return { ok: true, ...data }
  } catch {
    return { ok: false, message: 'Network error' }
  }
}

export async function getStudentAttendance(id) {
  const r = await fetch(`${BASE_URL}/api/attendance/student/${id}`)
  return r.json()
}

export async function clearSessionAttendance(sessionId) {
  const r = await fetch(`${BASE_URL}/api/attendance/session/${sessionId}`, { method: 'DELETE' })
  return r.json()
}

export async function clearStudentAttendance(studentId) {
  const r = await fetch(`${BASE_URL}/api/attendance/student/${studentId}`, { method: 'DELETE' })
  return r.json()
}

export async function clearAllAttendance() {
  const r = await fetch(`${BASE_URL}/api/attendance/all`, { method: 'DELETE' })
  return r.json()
}

export async function getUsers() {
  const r = await fetch(`${BASE_URL}/api/auth/users`)
  return r.json()
}
