import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Home() {
  const { user } = useAuth()
  const dash = user?.role === 'Teacher' ? '/teacher' : user?.role === 'Mentor' ? '/mentor' : '/student'
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">Modern, Secure SmartMark</h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          SmartMark is a modern, secure, and intelligent attendance management platform designed for educational institutions. It uses location verification, camera-based attendance, and role-based dashboards to provide a seamless and reliable attendance experience.
        </p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <Link to={user ? dash : '/signup'} className="gradient-btn px-6 py-3">Get Started</Link>
          <Link to={dash} className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-all">View Dashboard</Link>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-center">Powerful Features for Smart Institutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6">
            <div className="text-lg font-medium mb-2">Location Verified Attendance</div>
            <div className="text-gray-300">Prevent proxy attendance using real-time location verification.</div>
          </Card>
          <Card className="p-6">
            <div className="text-lg font-medium mb-2">Camera-Based Attendance</div>
            <div className="text-gray-300">Secure attendance marking using camera and QR verification.</div>
          </Card>
          <Card className="p-6">
            <div className="text-lg font-medium mb-2">Role-Based Dashboards</div>
            <div className="text-gray-300">Separate dashboards for Students, Teachers, and Mentors.</div>
          </Card>
          <Card className="p-6">
            <div className="text-lg font-medium mb-2">Real-Time Analytics</div>
            <div className="text-gray-300">Track attendance statistics and performance easily.</div>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-center">How SmartMark Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6">
            <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">1</div>
            <div className="mt-3 text-lg font-medium">Teacher creates attendance session</div>
            <div className="text-gray-300">Teacher sets title, subject, and location; starts the session.</div>
          </Card>
          <Card className="p-6">
            <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">2</div>
            <div className="mt-3 text-lg font-medium">Student marks attendance</div>
            <div className="text-gray-300">Student verifies via camera snapshot and geolocation.</div>
          </Card>
          <Card className="p-6">
            <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">3</div>
            <div className="mt-3 text-lg font-medium">Mentor monitors analytics</div>
            <div className="text-gray-300">Mentor views sessions, students, and consolidated stats.</div>
          </Card>
        </div>
      </section>
    </div>
  )
}
