import { useEffect, useState, memo } from 'react'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import * as api from '../../services/api.js'
import Modal from '../../components/Modal.jsx'
import QRScanner from '../../components/QRScanner.jsx'
import { Percent, CalendarCheck, ListChecks, QrCode, MapPin, CheckCircle2, XCircle, ClipboardList } from 'lucide-react'
import { motion } from 'framer-motion'
import { getAccurateLocation } from '../../utils/geo.js'

// Circular progress ring component
const ProgressRing = memo(function ProgressRing({ percent }) {
  const r = 36
  const circum = 2 * Math.PI * r
  const dash = (percent / 100) * circum
  const color = percent >= 75 ? '#10b981' : percent >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <svg className="h-24 w-24 -rotate-90" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
      <circle
        cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circum - dash}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
    </svg>
  )
})

// Skeleton loader
function Skeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
          <div key={i} className="glass-card p-6 space-y-3">
            <div className="skeleton h-4 w-24 rounded-md" />
            <div className="skeleton h-10 w-16 rounded-md" />
            <div className="skeleton h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
      <div className="glass-card p-6 space-y-3">
        <div className="skeleton h-5 w-40 rounded-md" />
        <div className="skeleton h-8 w-full rounded-md" />
        {[1,2,3].map(i => <div key={i} className="skeleton h-12 w-full rounded-md" />)}
      </div>
    </div>
  )
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [attendance, setAttendance] = useState([])
  const [selected, setSelected] = useState('')
  const [status, setStatus] = useState({ msg: '', type: '' })
  const [scanOpen, setScanOpen] = useState(false)
  const [scannedId, setScannedId] = useState('')
  const [marking, setMarking] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await Promise.all([
        api.getSessions().then(setSessions),
        user?._id ? api.getStudentAttendance(user._id).then(setAttendance) : Promise.resolve()
      ])
      setLoading(false)
    }
    load()
  }, [user])

  const mark = async (sessionId) => {
    setStatus({ msg: '', type: '' })
    const sid = sessionId || selected
    if (!sid) {
      setStatus({ msg: 'Select or scan an active session', type: 'error' })
      return
    }
    setMarking(true)
    try {
      // Robust location fetching with getCurrentPosition, retries, and fallbacks
      const pos = await getAccurateLocation({ timeout: 15000, maximumAge: 0, maxRetries: 1 })
      
      const { latitude, longitude, accuracy } = pos.coords
      console.log(`[Student] Lat: ${latitude}, Lng: ${longitude}, Acc: ${accuracy}m`)
      
      // Allow up to 250m accuracy for indoor classrooms
      if (accuracy > 250) {
        setStatus({ msg: `GPS accuracy too low (${Math.round(accuracy)}m). Try moving near a window.`, type: 'error' })
        setMarking(false)
        return
      }

      const res = await api.markAttendance({
        sessionId: sid,
        studentId: user._id,
        studentLocation: { lat: latitude, lng: longitude, accuracy },
        imageData: null
      })
      if (res.ok) {
        setStatus({ msg: 'Attendance marked successfully! ✓', type: 'success' })
        const list = await api.getStudentAttendance(user._id)
        setAttendance(list)
      } else {
        setStatus({ msg: res.message || 'Failed to mark attendance', type: 'error' })
      }
    } catch (err) {
      console.error('[Student Dashboard] Geo Error:', err);
      setStatus({ msg: err.message || 'Could not get your location. Please try again.', type: 'error' })
    }
    setMarking(false)
  }


  const totalSessions = sessions.length || 1
  const attendedSessionIds = new Set(attendance.map(a => a.sessionId))
  const percent = Math.round((attendedSessionIds.size / totalSessions) * 100)
  const activeSessions = sessions.filter(s => s.isActive)
  const selectedSession = sessions.find(s => s._id === selected)

  if (loading) return <Skeleton />

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Welcome back, <span className="gradient-text">{user?.name}</span> 👋
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Here is your attendance overview for this period.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Attendance % with ring */}
        <Card className="hover:scale-[1.02]">
          <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center">
              <ProgressRing percent={percent} />
              <div className="absolute text-center">
                <div className="text-lg font-bold text-white leading-none">{percent}%</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Attendance</div>
              <div className="text-2xl font-bold text-white mt-0.5">{percent}%</div>
              <div className="text-xs text-gray-500 mt-1">of {sessions.length} sessions</div>
            </div>
          </div>
        </Card>

        <Card className="hover:scale-[1.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <CalendarCheck className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sessions Attended</div>
              <div className="text-2xl font-bold text-white mt-0.5">{attendedSessionIds.size}</div>
              <div className="text-xs text-gray-500 mt-1">unique sessions</div>
            </div>
          </div>
        </Card>

        <Card className="hover:scale-[1.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <ListChecks className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Records</div>
              <div className="text-2xl font-bold text-white mt-0.5">{attendance.length}</div>
              <div className="text-xs text-gray-500 mt-1">attendance entries</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Mark attendance card */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-white">Mark Attendance</h2>
            <p className="text-xs text-gray-500 mt-0.5">Select an active session or scan QR</p>
          </div>
          <Button
            icon={QrCode}
            onClick={() => setScanOpen(true)}
            disabled={marking}
            size="sm"
          >
            Scan QR
          </Button>
        </div>

        <div className="space-y-4">
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            className="input-premium px-4 py-3 w-full bg-transparent"
          >
            <option className="bg-slate-900" value="">Select active session…</option>
            {activeSessions.map(s => (
              <option key={s._id} className="bg-slate-900" value={s._id}>{s.title} • {s.subject}</option>
            ))}
          </select>

          {/* Selected session detail */}
          {selectedSession && (
            <div className="flat-card p-4 space-y-1 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <ClipboardList className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-gray-500">Title:</span> {selectedSession.title}
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <ClipboardList className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-gray-500">Subject:</span> {selectedSession.subject}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs">Status:</span>
                {selectedSession.isActive
                  ? <span className="badge badge-green">Active</span>
                  : <span className="badge badge-gray">Inactive</span>
                }
              </div>
            </div>
          )}

          {selected && (
            <Button
              icon={MapPin}
              onClick={() => mark()}
              loading={marking}
              className="w-full"
            >
              {marking ? 'Verifying location…' : 'Mark Attendance'}
            </Button>
          )}

          {/* Status message */}
          {status.msg && (
            <div className={`flex items-center gap-2.5 p-3.5 rounded-xl text-sm border ${
              status.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-red-500/10 border-red-500/20 text-red-300'
            }`}>
              {status.type === 'success'
                ? <CheckCircle2 className="h-4 w-4 shrink-0" />
                : <XCircle className="h-4 w-4 shrink-0" />
              }
              {status.msg}
            </div>
          )}
        </div>
      </Card>

      {/* Attendance history table */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <ClipboardList className="h-4 w-4 text-gray-400" />
          <h2 className="font-semibold text-white">Attendance History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Session</th>
                <th>Timestamp</th>
                <th>Location Verified</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(a => {
                const s = sessions.find(x => x._id === a.sessionId)
                return (
                  <tr key={a._id}>
                    <td className="font-medium text-white">{s ? `${s.title} • ${s.subject}` : a.sessionId}</td>
                    <td className="text-gray-400 text-xs">{new Date(a.timestamp).toLocaleString()}</td>
                    <td>
                      {a.locationVerified
                        ? <span className="badge badge-green"><CheckCircle2 className="h-3 w-3" />Verified</span>
                        : <span className="badge badge-red"><XCircle className="h-3 w-3" />Not verified</span>
                      }
                    </td>
                  </tr>
                )
              })}
              {attendance.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <ClipboardList className="h-8 w-8 opacity-40" />
                      <p className="text-sm">No attendance records yet</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* QR Scanner Modal */}
      <Modal open={scanOpen} onClose={() => setScanOpen(false)} title="Scan Session QR Code">
        <QRScanner onResult={(data) => {
          setScannedId(data)
          setSelected(data)
          setScanOpen(false)
          setStatus({ msg: 'Session detected via QR. Verifying location…', type: '' })
          setTimeout(() => mark(data), 300)
        }} />
        {scannedId && (
          <p className="text-xs text-gray-500 mt-3">Session ID: <span className="font-mono">{scannedId}</span></p>
        )}
      </Modal>
    </div>
  )
}
