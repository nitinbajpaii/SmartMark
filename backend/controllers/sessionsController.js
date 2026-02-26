import { v4 as uuid } from 'uuid'
import { readSessions, writeSessions, readAttendance, writeAttendance } from '../utils/store.js'

export async function create(req, res) {
  const { title, subject, teacherId, teacherLocation } = req.body || {}
  if (!title || !subject || !teacherId || !teacherLocation) return res.status(400).json({ message: 'Missing fields' })
  const sessions = await readSessions()
  const sess = {
    _id: uuid(),
    title,
    subject,
    teacherId,
    teacherLocation,
    startTime: '',
    endTime: '',
    isActive: false
  }
  sessions.push(sess)
  await writeSessions(sessions)
  res.json(sess)
}

export async function list(req, res) {
  const sessions = await readSessions()
  res.json(sessions)
}

export async function start(req, res) {
  const { id } = req.body || {}
  const sessions = await readSessions()
  const s = sessions.find(x => x._id === id)
  if (!s) return res.status(404).json({ message: 'Not found' })
  s.isActive = true
  s.startTime = new Date().toISOString()
  await writeSessions(sessions)
  res.json({ ok: true })
}

export async function end(req, res) {
  const { id } = req.body || {}
  const sessions = await readSessions()
  const s = sessions.find(x => x._id === id)
  if (!s) return res.status(404).json({ message: 'Not found' })
  s.isActive = false
  s.endTime = new Date().toISOString()
  await writeSessions(sessions)
  res.json({ ok: true })
}

export async function remove(req, res) {
  const { id } = req.params || {}
  const sessions = await readSessions()
  const s = sessions.find(x => x._id === id)
  if (!s) return res.status(404).json({ message: 'Not found' })
  if (s.isActive) return res.status(400).json({ message: 'Cannot delete an active session' })
  const next = sessions.filter(x => x._id !== id)
  await writeSessions(next)
  // Clean related attendance
  const attendance = await readAttendance()
  const cleaned = attendance.filter(a => a.sessionId !== id)
  const removedAttendance = attendance.length - cleaned.length
  if (removedAttendance > 0) await writeAttendance(cleaned)
  res.json({ ok: true, removedAttendance })
}
