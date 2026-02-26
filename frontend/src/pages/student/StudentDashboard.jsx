import { useEffect, useState } from 'react'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import * as api from '../../services/api.js'
import Modal from '../../components/Modal.jsx'
import QRScanner from '../../components/QRScanner.jsx'

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

export default function StudentDashboard() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [attendance, setAttendance] = useState([])
  const [selected, setSelected] = useState('')
  const [status, setStatus] = useState('')
  const [scanOpen, setScanOpen] = useState(false)
  const [scannedId, setScannedId] = useState('')
  const [marking, setMarking] = useState(false)

  useEffect(() => {
    api.getSessions().then(setSessions)
    if (user?._id) {
      api.getStudentAttendance(user._id).then(setAttendance)
    }
  }, [user])

  useEffect(() => {}, [])

  const mark = async (sessionId) => {
    setStatus('')
    const sid = sessionId || selected
    if (!sid) {
      setStatus('Select or scan an active session')
      return
    }
    setMarking(true)
    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(p => res(p), e => rej(e), { enableHighAccuracy: true }))
      const { latitude, longitude } = pos.coords
      const session = sessions.find(s => s._id === sid)
      if (!session) {
        setStatus('Session not found')
        setMarking(false)
        return
      }
      const dist = haversine({ lat: latitude, lng: longitude }, session.teacherLocation)
      if (dist > 100) {
        setStatus('You are outside the allowed range')
        setMarking(false)
        return
      }
      const res = await api.markAttendance({ sessionId: sid, studentId: user._id, studentLocation: { lat: latitude, lng: longitude }, imageData: null })
      if (res.ok) {
        setStatus('Attendance marked')
        const list = await api.getStudentAttendance(user._id)
        setAttendance(list)
      } else {
        setStatus(res.message || 'Failed to mark attendance')
      }
    } catch {
      setStatus('Location permission denied')
    }
    setMarking(false)
  }

  const totalSessions = sessions.length || 1
  const attendedSessionIds = new Set(attendance.map(a => a.sessionId))
  const percent = Math.round((attendedSessionIds.size / totalSessions) * 100)

  const activeSessions = sessions.filter(s => s.isActive)

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <div className="text-3xl md:text-4xl font-bold">Welcome back, {user?.name} 👋</div>
        <div className="text-gray-400 mt-2">Here is your attendance overview.</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card className="space-y-4">
          <div className="text-lg">Attendance</div>
          <div className="text-4xl font-semibold">{percent}%</div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-500" style={{ width: `${percent}%` }} />
          </div>
          <div className="text-xs text-gray-400">Based on total sessions</div>
        </Card>
        <Card>
          <div className="text-lg mb-3">Session Details</div>
          <select value={selected} onChange={e => setSelected(e.target.value)} className="input-premium px-4 py-3 w-full bg-transparent">
            <option className="bg-slate-900" value="">Select session</option>
            {activeSessions.map(s => (
              <option key={s._id} className="bg-slate-900" value={s._id}>{s.title} • {s.subject}</option>
            ))}
          </select>
          <div className="mt-4">
            <Button onClick={()=>setScanOpen(true)} disabled={marking}>Scan QR</Button>
          </div>
          {status && <div className="text-sm text-gray-300 mt-3">{status}</div>}
          <div className="mt-4 space-y-1 text-sm text-gray-300">
            {selected ? (
              <>
                <div>Title: {sessions.find(s=>s._id===selected)?.title}</div>
                <div>Subject: {sessions.find(s=>s._id===selected)?.subject}</div>
                <div>Status: {sessions.find(s=>s._id===selected)?.isActive ? 'Active' : 'Inactive'}</div>
              </>
            ) : (
              <div>Select a session to view details</div>
            )}
          </div>
        </Card>
        <Card>
          <div className="text-lg mb-3">Summary</div>
          <div className="text-gray-300">Sessions: {sessions.length}</div>
          <div className="text-gray-300">Attended: {attendance.length}</div>
          <div className="text-gray-300">Unique sessions: {attendedSessionIds.size}</div>
        </Card>
      </div>
      <Card>
        <div className="text-lg mb-4">Attendance History</div>
        <div className="overflow-x-auto bg-white/5 backdrop-blur-lg rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-300">
                <th className="py-2 pr-4">Session</th>
                <th className="py-2 pr-4">Timestamp</th>
                <th className="py-2 pr-4">Verified</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(a => {
                const s = sessions.find(x => x._id === a.sessionId)
                return (
                  <tr key={a._id} className="border-t border-white/10 hover:bg-white/10 transition-all">
                    <td className="py-3 pr-4">{s ? `${s.title} • ${s.subject}` : a.sessionId}</td>
                    <td className="py-3 pr-4">{new Date(a.timestamp).toLocaleString()}</td>
                    <td className="py-3 pr-4">{a.locationVerified ? 'Yes' : 'No'}</td>
                  </tr>
                )
              })}
              {attendance.length === 0 && (
                <tr className="border-t border-white/10">
                  <td className="py-3 pr-4" colSpan="3">No records</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal open={scanOpen} onClose={()=>setScanOpen(false)} title="Scan Session QR">
        <QRScanner onResult={(data)=>{
          setScannedId(data)
          setSelected(data)
          setScanOpen(false)
          setStatus('Session detected via QR. Verifying location...')
          setTimeout(()=>mark(data), 300)
        }} />
        {scannedId && <div className="text-xs text-gray-400 mt-2">Session ID: {scannedId}</div>}
      </Modal>
    </div>
  )
}
