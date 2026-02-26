import { useEffect, useMemo, useState } from 'react'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import * as api from '../../services/api.js'
import Modal from '../../components/Modal.jsx'
import * as QRCode from 'qrcode'

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
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(p => res(p), e => rej(e), { enableHighAccuracy: true }))
      const payload = {
        title: form.title,
        subject: form.subject,
        teacherId: user._id,
        teacherLocation: { lat: pos.coords.latitude, lng: pos.coords.longitude }
      }
      await api.createSession(payload)
      setForm({ title: '', subject: '' })
      await reload()
    } finally {
      setCreating(false)
    }
  }

  const start = async id => {
    await api.startSession(id)
    await reload()
  }
  const end = async id => {
    await api.endSession(id)
    await reload()
  }

  useEffect(() => {
    const gen = async () => {
      if (!qrFor) return setQrDataUrl('')
      const url = await QRCode.toDataURL(qrFor._id)
      setQrDataUrl(url)
    }
    gen()
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
    <div className="space-y-8">
      <div className="mb-8">
        <div className="text-3xl md:text-4xl font-bold">Welcome back, {user?.name} 👋</div>
        <div className="text-gray-400 mt-2">Create sessions and monitor attendance.</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="text-lg mb-4">Create Session</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" className="input-premium px-4 py-3 w-full" />
            <input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="Subject" className="input-premium px-4 py-3 w-full" />
          </div>
          <div className="mt-4">
            <Button onClick={create} disabled={creating}>{creating ? 'Creating...' : 'Create Session'}</Button>
          </div>
          <div className="text-xs text-gray-400 mt-2">Location captured automatically</div>
        </Card>
        <Card>
          <div className="text-lg mb-4">Your Sessions</div>
          <div className="space-y-3 max-h-72 overflow-auto pr-2">
            {sessions.map(s => (
              <div key={s._id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <div className="font-medium">{s.title}</div>
                  <div className="text-xs text-gray-400">{s.subject}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-lg text-xs ${s.isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>{s.isActive ? 'Active' : 'Inactive'}</span>
                  <Button onClick={()=>setQrFor(s)} className="px-3 py-2">Show QR</Button>
                  {!s.isActive && (
                    <Button
                      onClick={async ()=>{
                        const ok = window.confirm('Delete this session? This will also remove its attendance records.')
                        if (!ok) return
                        await api.deleteSession(s._id)
                        if (selected === s._id) setSelected('')
                        await reload()
                      }}
                      className="px-3 py-2"
                    >
                      Delete
                    </Button>
                  )}
                  {!s.isActive ? (
                    <Button onClick={()=>start(s._id)} className="px-3 py-2">Start</Button>
                  ) : (
                    <Button onClick={()=>end(s._id)} className="px-3 py-2">End</Button>
                  )}
                </div>
              </div>
            ))}
            {sessions.length===0 && <div className="text-gray-300">No sessions</div>}
          </div>
        </Card>
      </div>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg">Attendance</div>
          <div className="flex items-center gap-3">
            <select value={selected} onChange={e => setSelected(e.target.value)} className="input-premium px-4 py-3 bg-transparent">
              <option className="bg-slate-900" value="">Select session</option>
              {sessions.map(s => (
                <option key={s._id} value={s._id} className="bg-slate-900">{s.title}</option>
              ))}
            </select>
            <Button
              className="px-4 py-3"
              onClick={async ()=>{
                if (!selected) return
                await api.clearSessionAttendance(selected)
                // reload table
                const r = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/attendance/session/${selected}`)
                const data = await r.json()
                setAttendance(Array.isArray(data) ? data : [])
              }}
            >
              Clear Session
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto bg-white/5 backdrop-blur-lg rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-300">
                <th className="py-2 pr-4">Student</th>
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Verified</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(a => (
                <tr key={a._id} className="border-t border-white/10 hover:bg-white/10 transition-all">
                  <td className="py-3 pr-4">{a.student?.name || a.studentId}</td>
                  <td className="py-3 pr-4">{new Date(a.timestamp).toLocaleString()}</td>
                  <td className="py-3 pr-4">{a.locationVerified ? 'Yes' : 'No'}</td>
                </tr>
              ))}
              {attendance.length===0 && (
                <tr className="border-t border-white/10"><td className="py-3" colSpan="3">No records</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal open={!!qrFor} onClose={()=>setQrFor(null)} title={qrFor ? `Scan to join: ${qrFor.title}` : ''}>
        <div className="flex flex-col items-center">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Session QR" className="w-56 h-56 rounded-xl border border-white/20" />
          ) : (
            <div className="text-gray-300">Generating QR…</div>
          )}
          <div className="text-xs text-gray-400 mt-3">This code encodes the session ID only. Students must be on-site; location is verified.</div>
        </div>
      </Modal>
    </div>
  )
}
