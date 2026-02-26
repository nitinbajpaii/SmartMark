import { useEffect, useMemo, useState } from 'react'
import Card from '../../components/Card.jsx'
import * as api from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function MentorDashboard() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [attendance, setAttendance] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.getSessions().then(setSessions)
    api.getUsers().then(setUsers)
    ;(async () => {
      const all = []
      for (const s of await api.getSessions()) {
        const r = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/attendance/session/${s._id}`)
        const d = await r.json()
        if (Array.isArray(d)) all.push(...d)
      }
      setAttendance(all)
    })()
  }, [])

  const stats = useMemo(() => {
    const students = new Set(attendance.map(a => a.studentId))
    const active = sessions.filter(s => s.isActive).length
    return {
      sessions: sessions.length,
      active,
      attendance: attendance.length,
      students: students.size
    }
  }, [sessions, attendance])

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <div className="text-3xl md:text-4xl font-bold">Welcome back, {user?.name} 👋</div>
        <div className="text-gray-400 mt-2">Here is the consolidated overview.</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card><div className="text-gray-300">Sessions</div><div className="text-3xl font-semibold">{stats.sessions}</div></Card>
        <Card><div className="text-gray-300">Active</div><div className="text-3xl font-semibold">{stats.active}</div></Card>
        <Card><div className="text-gray-300">Attendance</div><div className="text-3xl font-semibold">{stats.attendance}</div></Card>
        <Card><div className="text-gray-300">Students</div><div className="text-3xl font-semibold">{stats.students}</div></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="text-lg mb-4">Students</div>
          <div className="overflow-x-auto bg-white/5 backdrop-blur-lg rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-300">
                  <th className="py-2 pr-4">Student Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Attendance count</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(attendance.reduce((map, a) => {
                  const k = a.studentId
                  const entry = map.get(k) || { name: a.student?.name || a.studentId, email: a.student?.email || '—', role: 'Student', count: 0 }
                  entry.count += 1
                  map.set(k, entry)
                  return map
                }, new Map()).entries()).map(([id, s]) => (
                  <tr key={id} className="border-t border-white/10 hover:bg-white/10 transition-all">
                    <td className="py-3 pr-4">{s.name}</td>
                    <td className="py-3 pr-4">{s.email}</td>
                    <td className="py-3 pr-4">{s.role}</td>
                    <td className="py-3 pr-4">{s.count}</td>
                  </tr>
                ))}
                {attendance.length===0 && (
                  <tr className="border-t border-white/10"><td className="py-3" colSpan="4">No data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-lg mb-4">Teachers</div>
          <div className="overflow-x-auto bg-white/5 backdrop-blur-lg rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-300">
                  <th className="py-2 pr-4">Teacher Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Sessions created</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(sessions.reduce((map, s) => {
                  const k = s.teacherId
                  const t = users.find(u => u._id === k) || null
                  const entry = map.get(k) || { name: t ? t.name : 'Unknown', email: t ? t.email : '—', count: 0 }
                  entry.count += 1
                  map.set(k, entry)
                  return map
                }, new Map()).entries()).map(([id, t]) => (
                  <tr key={id} className="border-t border-white/10 hover:bg-white/10 transition-all">
                    <td className="py-3 pr-4">{t.name}</td>
                    <td className="py-3 pr-4">{t.email}</td>
                    <td className="py-3 pr-4">{t.count}</td>
                  </tr>
                ))}
                {sessions.length===0 && (
                  <tr className="border-t border-white/10"><td className="py-3" colSpan="3">No data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
