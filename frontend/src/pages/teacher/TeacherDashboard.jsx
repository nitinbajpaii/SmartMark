import { useEffect, useState } from 'react'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import * as api from '../../services/api.js'
import Modal from '../../components/Modal.jsx'
import * as QRCode from 'qrcode'
import { PlusCircle, QrCode, Trash2, Play, StopCircle, CheckCircle2, XCircle, ClipboardList, MapPin, Download } from 'lucide-react'
import { getAccurateLocation } from '../../utils/geo.js'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [form, setForm] = useState({ title: '', subject: '' })
  const [creating, setCreating] = useState(false)
  const [selected, setSelected] = useState('')
  const [attendance, setAttendance] = useState([])
  const [qrFor, setQrFor] = useState(null)
  const [qrDataUrl, setQrDataUrl] = useState('')

  const reload = async () => {
    const list = await api.getSessions()
    setSessions(list.filter(s => s.teacherId === user._id))
  }

  useEffect(() => {
    if (user) reload()
  }, [user])

  const create = async () => {
    if (!form.title || !form.subject) return
    setCreating(true)
    try {
      const pos = await getAccurateLocation({ timeout: 15000, maximumAge: 0, maxRetries: 1 })
      const payload = {
        title: form.title,
        subject: form.subject,
        teacherId: user._id,
        teacherLocation: { 
          lat: pos.coords.latitude, 
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        }
      }
      await api.createSession(payload)
      setForm({ title: '', subject: '' })
      await reload()
    } catch (err) {
      alert(err.message || 'Could not get location. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  const start = async id => {
    try {
      const pos = await getAccurateLocation({ timeout: 15000, maximumAge: 0, maxRetries: 1 })
      const teacherLocation = { 
        lat: pos.coords.latitude, 
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy
      }
      console.log('[Teacher] Start Session Lat:', teacherLocation.lat, 'Lng:', teacherLocation.lng, 'Acc:', teacherLocation.accuracy)
      await api.startSession(id, teacherLocation)
      await reload()
    } catch (err) {
      alert(err.message || 'Could not get location. Please try again.')
    }
  }
  const end   = async id => { await api.endSession(id);   await reload() }

  useEffect(() => {
    let timer;
    const gen = async () => {
      if (!qrFor) return setQrDataUrl('')
      
      // Dynamic QR: sessionId|timestamp|randomToken
      const qrValue = `${qrFor._id}|${qrFor.qrTimestamp || Date.now()}|${qrFor.randomToken || ''}`
      const url = await QRCode.toDataURL(qrValue, { width: 256, margin: 2 })
      setQrDataUrl(url)

      // Refresh QR every 30 seconds if session is active
      if (qrFor.isActive) {
        timer = setTimeout(async () => {
          await reload();
          // The re-render will trigger this effect again with updated qrFor
        }, 30000);
      }
    }
    gen()
    return () => clearTimeout(timer);
  }, [qrFor])

  useEffect(() => {
    const load = async () => {
      if (!selected) return
      const r = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/attendance/session/${selected}`)
      const data = await r.json()
      setAttendance(Array.isArray(data) ? data : [])
    }
    load()
  }, [selected])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Welcome back, <span className="gradient-text">{user?.name}</span> 👋
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Create sessions and monitor student attendance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Session */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <PlusCircle className="h-4 w-4 text-gray-400" />
            <h2 className="font-semibold text-white">Create Session</h2>
          </div>
          <div className="space-y-3">
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Session title"
              className="input-premium px-4 py-3 w-full"
            />
            <input
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              placeholder="Subject"
              className="input-premium px-4 py-3 w-full"
            />
            <Button
              icon={PlusCircle}
              onClick={create}
              loading={creating}
              className="w-full"
            >
              {creating ? 'Creating…' : 'Create Session'}
            </Button>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <MapPin className="h-3 w-3" /> Location captured automatically at creation
            </p>
          </div>
        </Card>

        {/* Session list */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <ClipboardList className="h-4 w-4 text-gray-400" />
            <h2 className="font-semibold text-white">Your Sessions</h2>
            <span className="ml-auto badge badge-gray">{sessions.length}</span>
          </div>
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {sessions.map(s => (
              <div
                key={s._id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:border-white/[0.12] transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-white truncate">{s.title}</div>
                  <div className="text-xs text-gray-500 truncate">{s.subject}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                  {s.isActive
                    ? <span className="badge badge-green">Active</span>
                    : <span className="badge badge-gray">Inactive</span>
                  }
                  <button
                    onClick={() => setQrFor(s)}
                    title="Show QR"
                    className="ghost-btn p-1.5 rounded-lg"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                  </button>
                  {!s.isActive && (
                    <button
                      onClick={async () => {
                        const ok = window.confirm('Delete this session? This will also remove its attendance records.')
                        if (!ok) return
                        await api.deleteSession(s._id)
                        if (selected === s._id) setSelected('')
                        await reload()
                      }}
                      title="Delete"
                      className="ghost-btn p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {!s.isActive ? (
                    <button onClick={() => start(s._id)} title="Start" className="ghost-btn p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10">
                      <Play className="h-3.5 w-3.5 fill-current" />
                    </button>
                  ) : (
                    <button onClick={() => end(s._id)} title="End" className="ghost-btn p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10">
                      <StopCircle className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8 text-gray-500">
                <ClipboardList className="h-8 w-8 opacity-40" />
                <p className="text-sm">No sessions yet</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Attendance table */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-gray-400" />
            <h2 className="font-semibold text-white">Session Attendance</h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={selected}
              onChange={e => setSelected(e.target.value)}
              className="input-premium px-4 py-2 bg-transparent text-sm"
            >
              <option className="bg-slate-900" value="">Select session…</option>
              {sessions.map(s => (
                <option key={s._id} value={s._id} className="bg-slate-900">{s.title}</option>
              ))}
            </select>
            <Button
              variant="danger"
              size="sm"
              onClick={async () => {
                if (!selected) return
                await api.clearSessionAttendance(selected)
                const r = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/attendance/session/${selected}`)
                const data = await r.json()
                setAttendance(Array.isArray(data) ? data : [])
              }}
            >
              Clear Session
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Time</th>
                <th>Location Verified</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(a => (
                <tr key={a._id}>
                  <td className="font-medium text-white">{a.student?.name || a.studentId}</td>
                  <td className="text-gray-400 text-xs">{new Date(a.timestamp).toLocaleString()}</td>
                  <td>
                    {a.locationVerified
                      ? <span className="badge badge-green"><CheckCircle2 className="h-3 w-3" />Verified</span>
                      : <span className="badge badge-red"><XCircle className="h-3 w-3" />Not verified</span>
                    }
                  </td>
                </tr>
              ))}
              {attendance.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <ClipboardList className="h-8 w-8 opacity-40" />
                      <p className="text-sm">{selected ? 'No attendance records' : 'Select a session to view attendance'}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* QR Modal */}
      <Modal open={!!qrFor} onClose={() => setQrFor(null)} title={qrFor ? `QR Code: ${qrFor.title}` : ''}>
        <div className="flex flex-col items-center gap-5">
          {qrDataUrl ? (
            <>
              <div className="p-4 bg-white rounded-2xl shadow-lg">
                <img src={qrDataUrl} alt="Session QR" className="w-52 h-52" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-semibold text-white">{qrFor?.title}</p>
                <p className="text-sm text-gray-400">{qrFor?.subject}</p>
                {qrFor?.isActive && (
                  <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Session Code</p>
                    <p className="text-3xl font-mono font-bold text-white tracking-widest mt-1">{qrFor.sessionCode}</p>
                    <p className="text-[10px] text-amber-400 mt-2">QR refreshes every 30s</p>
                  </div>
                )}
              </div>
              <a
                href={qrDataUrl}
                download={`${qrFor?.title}-qr.png`}
                className="outline-btn px-5 py-2 text-sm gap-2"
              >
                <Download className="h-4 w-4" /> Download QR
              </a>
            </>
          ) : (
            <div className="flex items-center gap-3 text-gray-400 py-8">
              <QrCode className="h-6 w-6 animate-pulse" />
              Generating QR…
            </div>
          )}
          <p className="text-xs text-gray-500 text-center max-w-xs">
            Students must be on-site within 100m. Location is verified after scanning.
          </p>
        </div>
      </Modal>
    </div>
  )
}
