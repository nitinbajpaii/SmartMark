import { v4 as uuid } from 'uuid'
import { readAttendance, writeAttendance, readSessions } from '../utils/store.js'
import { readUsers } from '../utils/store.js'

function haversine(a, b) {
  const toRad = v => (v * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const s = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))
  return R * c
}

export async function mark(req, res) {
  const { sessionId, studentId, studentLocation, sessionCode, qrToken, qrTimestamp, imageData } = req.body || {}
  if (!sessionId || !studentId) return res.status(400).json({ message: 'Missing fields' })
  
  const studentIp = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const sessions = await readSessions()
  const s = sessions.find(x => x._id === sessionId)
  
  if (!s) return res.status(404).json({ message: 'Session not found' })
  if (!s.isActive) return res.status(400).json({ message: 'Session not active' })

  // --- LAYER 1: Dynamic QR Token Verification ---
  if (qrToken) {
    // Check if QR has expired (60 seconds)
    const now = Date.now()
    const qrAge = (now - parseInt(qrTimestamp)) / 1000
    if (qrAge > 60) return res.status(403).json({ message: 'QR code expired. Please scan the latest one.' })
    if (qrToken !== s.randomToken) return res.status(403).json({ message: 'Invalid QR token.' })
  }

  // --- LAYER 2: Session Code Verification ---
  if (!sessionCode || sessionCode !== s.sessionCode) {
    return res.status(403).json({ message: 'Incorrect session code. Please enter the 6-digit code shown by the teacher.' })
  }

  // --- LAYER 3: Hybrid Verification (Network OR GPS) ---
  const sameNetwork = s.teacherIp && studentIp && s.teacherIp === studentIp
  
  let isLocationValid = false
  let dist = 0
  let allowedDistance = 0
  
  if (studentLocation && studentLocation.lat && studentLocation.lng) {
    dist = haversine(studentLocation, s.teacherLocation)
    const MAX_RANGE = 100 // Strict 100m range as per requirement
    const teacherAcc = s.teacherLocation.accuracy || 0
    const studentAcc = studentLocation.accuracy || 0
    // Optional: add accuracy buffer if desired, but requirement says "distance <= 100m"
    isLocationValid = dist <= MAX_RANGE
  }

  console.log(`--- 3-Layer Attendance Verification ---`)
  console.log(`Session: ${s.title} | Student: ${studentId}`)
  console.log(`QR Valid: ${qrToken ? 'YES' : 'BYPASS'} | Code Valid: YES`)
  console.log(`Network Match: ${sameNetwork ? 'YES' : 'NO'} (${studentIp} vs ${s.teacherIp})`)
  console.log(`GPS Match: ${isLocationValid ? 'YES' : 'NO'} (${dist.toFixed(1)}m / 100m)`)

  if (!sameNetwork && !isLocationValid) {
    return res.status(403).json({ 
      message: `Verification failed. You must be on the same WiFi as the teacher OR within 100m range.` 
    })
  }

  // Mark attendance if all checks pass
  const attendance = await readAttendance()
  const duplicate = attendance.find(a => a.sessionId === sessionId && a.studentId === studentId)
  if (duplicate) return res.status(409).json({ message: 'Attendance already marked for this session' })
  const a = {
    _id: uuid(),
    sessionId,
    studentId,
    timestamp: new Date().toISOString(),
    locationVerified: true,
    imageProof: imageData ? String(imageData).slice(0, 100) : null
  }
  attendance.push(a)
  await writeAttendance(attendance)
  res.json({ ok: true, attendance: a })
}

export async function byStudent(req, res) {
  const { id } = req.params
  const attendance = await readAttendance()
  res.json(attendance.filter(a => a.studentId === id))
}

export async function bySession(req, res) {
  const { id } = req.params
  const attendance = await readAttendance()
  const users = await readUsers()
  const list = attendance
    .filter(a => a.sessionId === id)
    .map(a => {
      const u = users.find(x => x._id === a.studentId)
      return { ...a, student: u ? { _id: u._id, name: u.name, email: u.email } : null }
    })
  res.json(list)
}

export async function removeBySession(req, res) {
  const { id } = req.params
  const attendance = await readAttendance()
  const next = attendance.filter(a => a.sessionId !== id)
  const removed = attendance.length - next.length
  await writeAttendance(next)
  res.json({ ok: true, removed })
}

export async function removeByStudent(req, res) {
  const { id } = req.params
  const attendance = await readAttendance()
  const next = attendance.filter(a => a.studentId !== id)
  const removed = attendance.length - next.length
  await writeAttendance(next)
  res.json({ ok: true, removed })
}

export async function removeOne(req, res) {
  const { id } = req.params
  const attendance = await readAttendance()
  const next = attendance.filter(a => a._id !== id)
  const removed = attendance.length - next.length
  await writeAttendance(next)
  res.json({ ok: true, removed })
}

export async function removeAll(req, res) {
  await writeAttendance([])
  res.json({ ok: true })
}
