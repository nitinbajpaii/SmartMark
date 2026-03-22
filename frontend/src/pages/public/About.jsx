import { Shield, MapPin, Clock, LayoutDashboard, Zap, Lock } from 'lucide-react'

const features = [
  { icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', title: 'Secure Attendance System', desc: 'Robust mechanisms to ensure authentic attendance logs with multi-factor verification.' },
  { icon: MapPin, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', title: 'Location Verification', desc: 'Geofencing prevents proxy attendance beyond 100 meters from the session location.' },
  { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', title: 'Real-Time Monitoring', desc: 'Track sessions and attendance records as they happen — zero delay.' },
  { icon: LayoutDashboard, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', title: 'Modern Dashboard Interface', desc: 'Clean, responsive design inspired by top SaaS products — beautifully intuitive.' },
]

export default function About() {
  return (
    <div className="page space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="badge badge-blue">About Us</span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          About <span className="gradient-text">SmartMark</span>
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          SmartMark is an advanced attendance management platform designed to simplify and secure attendance tracking in educational institutions. Our system combines modern web technologies, location verification, and camera-based authentication to ensure accurate and reliable attendance records.
        </p>
        <p className="text-base text-gray-500 leading-relaxed">
          Our platform provides dedicated dashboards for Students, Teachers, and Mentors, allowing each role to efficiently manage attendance, monitor sessions, and view analytics. Our mission is to eliminate manual attendance processes and provide a secure, automated, and user-friendly attendance system.
        </p>
      </div>

      {/* Features */}
      <section className="space-y-8">
        <div className="space-y-2">
          <span className="badge badge-purple">Features</span>
          <h2 className="text-2xl md:text-3xl font-bold">Our core capabilities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, color, bg, title, desc }) => (
            <div
              key={title}
              className="glass-card p-6 space-y-4 hover:scale-[1.02] transition-all duration-300 hover:shadow-glow hover:border-white/20"
            >
              <div className={`inline-flex p-3 rounded-xl border ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <div className="font-semibold text-white mb-1.5">{title}</div>
                <div className="text-sm text-gray-400 leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="glass-card p-8 md:p-10 space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Zap className="h-5 w-5 text-indigo-400" />
          </div>
          <h2 className="text-xl font-semibold">Our Mission</h2>
        </div>
        <p className="text-gray-300 leading-relaxed text-base max-w-3xl">
          We believe attendance tracking should be effortless, secure, and reliable. SmartMark was built to replace archaic manual roll-call systems with a modern, automated platform that institutions can trust. By combining geolocation verification, QR-based check-in, and role-specific analytics, we've created a system that works for everyone — students, teachers, and administrators alike.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
          {[
            { value: '100m', label: 'Geofence radius' },
            { value: '3', label: 'Role dashboards' },
            { value: '0ms', label: 'Processing delay' },
            { value: '100%', label: 'Proxy prevention' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
