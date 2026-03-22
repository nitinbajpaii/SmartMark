import { useEffect, useMemo, useState } from 'react'
import Card from '../../components/Card.jsx'
import * as api from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { CalendarDays, Activity, ClipboardCheck, GraduationCap, BookOpen, CheckCircle2, XCircle, Users } from 'lucide-react'

function Skeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[1,2,3,4].map(i => (
          <div key={i} className="glass-card p-5 space-y-3">
            <div className="skeleton h-9 w-9 rounded-xl" />
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-8 w-12 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1,2].map(i => (
          <div key={i} className="glass-card p-6 space-y-3">
            <div className="skeleton h-5 w-32 rounded" />
            {[1,2,3].map(j => <div key={j} className="skeleton h-12 w-full rounded-xl" />)}
          </div>
        ))}
      </div>
    </div>
  )
}

const statConfig = [
  { key: 'sessions',   label: 'Total Sessions',   icon: CalendarDays,    color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20' },
  { key: 'active',     label: 'Active Sessions',  icon: Activity,        color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { key: 'attendance', label: 'Total Records',    icon: ClipboardCheck,  color: 'text-purple-400',  bg: 'bg-purple-500/10 border-purple-500/20' },
  { key: 'students',   label: 'Unique Students',  icon: GraduationCap,   color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20' },
]

export default function MentorDashboard() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [attendance, setAttendance] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [allSessions, allUsers] = await Promise.all([api.getSessions(), api.getUsers()])
      setSessions(allSessions)
      setUsers(allUsers)
      const all = []
      for (const s of allSessions) {
        const r = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/attendance/session/${s._id}`)
        const d = await r.json()
        if (Array.isArray(d)) all.push(...d)
      }
      setAttendance(all)
      setLoading(false)
    }
    load()
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

  // Build per-student rows
  const studentRows = useMemo(() => {
    return Array.from(
      attendance.reduce((map, a) => {
        const k = a.studentId
        const entry = map.get(k) || { name: a.student?.name || a.studentId, email: a.student?.email || '—', count: 0 }
        entry.count += 1
        map.set(k, entry)
        return map
      }, new Map()).entries()
    ).map(([id, s]) => ({ id, ...s }))
  }, [attendance])

  // Build per-teacher rows
  const teacherRows = useMemo(() => {
    return Array.from(
      sessions.reduce((map, s) => {
        const k = s.teacherId
        const t = users.find(u => u._id === k) || null
        const entry = map.get(k) || { name: t ? t.name : 'Unknown', email: t ? t.email : '—', count: 0 }
        entry.count += 1
        map.set(k, entry)
        return map
      }, new Map()).entries()
    ).map(([id, t]) => ({ id, ...t }))
  }, [sessions, users])

  if (loading) return <Skeleton />

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Welcome back, <span className="gradient-text">{user?.name}</span> 👋
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Consolidated overview of all sessions and attendance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statConfig.map(({ key, label, icon: Icon, color, bg }) => (
          <Card key={key} className="hover:scale-[1.02]">
            <div className={`inline-flex p-2.5 rounded-xl border ${bg} mb-3`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</div>
            <div className="text-3xl font-bold text-white mt-1">{stats[key]}</div>
          </Card>
        ))}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students table */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <GraduationCap className="h-4 w-4 text-gray-400" />
            <h2 className="font-semibold text-white">Students</h2>
            <span className="ml-auto badge badge-gray">{studentRows.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Attended</th>
                </tr>
              </thead>
              <tbody>
                {studentRows.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-600/30 border border-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-300 shrink-0">
                          {(s.name || 'U')[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-white text-sm truncate max-w-[120px]">{s.name}</span>
                      </div>
                    </td>
                    <td className="text-gray-400 text-xs truncate max-w-[120px]">{s.email}</td>
                    <td>
                      <span className="badge badge-blue">{s.count}</span>
                    </td>
                  </tr>
                ))}
                {studentRows.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-8 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <Users className="h-7 w-7 opacity-40" />
                        <p className="text-sm">No data yet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Teachers table */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="h-4 w-4 text-gray-400" />
            <h2 className="font-semibold text-white">Teachers</h2>
            <span className="ml-auto badge badge-gray">{teacherRows.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Email</th>
                  <th>Sessions</th>
                </tr>
              </thead>
              <tbody>
                {teacherRows.map(t => (
                  <tr key={t.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500/30 to-teal-600/30 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-300 shrink-0">
                          {(t.name || 'U')[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-white text-sm truncate max-w-[120px]">{t.name}</span>
                      </div>
                    </td>
                    <td className="text-gray-400 text-xs truncate max-w-[120px]">{t.email}</td>
                    <td>
                      <span className="badge badge-purple">{t.count}</span>
                    </td>
                  </tr>
                ))}
                {teacherRows.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-8 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <BookOpen className="h-7 w-7 opacity-40" />
                        <p className="text-sm">No data yet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
