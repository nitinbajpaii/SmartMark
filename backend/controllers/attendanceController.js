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
  const { sessionId, studentId, studentLocation, imageData } = req.body || {}
  if (!sessionId || !studentId || !studentLocation) return res.status(400).json({ message: 'Missing fields' })
  
  const sessions = await readSessions()
  const s = sessions.find(x => x._id === sessionId)
  if (!s) return res.status(404).json({ message: 'Session not found' })
  if (!s.isActive) return res.status(400).json({ message: 'Session not active' })

  const dist = haversine(studentLocation, s.teacherLocation)
  const ALLOWED_DISTANCE = 100
  
  // Accuracy Buffer Logic
  const teacherAcc = s.teacherLocation.accuracy || 0
  const studentAcc = studentLocation.accuracy || 0
  const tolerance = teacherAcc + studentAcc
  const effectiveAllowedDistance = ALLOWED_DISTANCE + tolerance

  console.log(`--- Attendance Verification ---`)
  console.log(`Session: ${s.title} (ID: ${sessionId})`)
  console.log(`Student ID: ${studentId}`)
  console.log(`Teacher Location: ${s.teacherLocation.lat}, ${s.teacherLocation.lng} (Accuracy: ${teacherAcc}m)`)
  console.log(`Student Location: ${studentLocation.lat}, ${studentLocation.lng} (Accuracy: ${studentAcc}m)`)
  console.log(`Raw Distance: ${dist.toFixed(2)}m`)
  console.log(`Tolerance (Teacher + Student Acc): ${tolerance.toFixed(2)}m`)
  console.log(`Allowed Range: ${ALLOWED_DISTANCE}m + ${tolerance.toFixed(2)}m tolerance = ${effectiveAllowedDistance.toFixed(2)}m`)

  if (dist > effectiveAllowedDistance) {
    console.log(`Verification Failed: Outside allowed range.`)
    return res.status(403).json({ 
      message: `Location mismatch (${Math.round(dist)}m away). Allowed range is ${Math.round(effectiveAllowedDistance)}m (including ${Math.round(tolerance)}m accuracy buffer). Please try again closer to the teacher.` 
    })
  }
  
  console.log(`Verification Successful!`)
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
