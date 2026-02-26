export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">About SmartMark</h1>
        <p className="text-lg text-gray-300 max-w-3xl">
          SmartMark is an advanced attendance management platform designed to simplify and secure attendance tracking in educational institutions. Our system combines modern web technologies, location verification, and camera-based authentication to ensure accurate and reliable attendance records.
        </p>
        <p className="text-lg text-gray-300 max-w-3xl">
          Our platform provides dedicated dashboards for Students, Teachers, and Mentors, allowing each role to efficiently manage attendance, monitor sessions, and view analytics. Our mission is to eliminate manual attendance processes and provide a secure, automated, and user-friendly attendance system.
        </p>
      </div>
      <section className="space-y-8">
        <h2 className="text-2xl md:text-3xl font-semibold">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
            <div className="text-lg font-medium mb-2">Secure Attendance System</div>
            <div className="text-gray-300">Robust mechanisms to ensure authentic attendance logs.</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
            <div className="text-lg font-medium mb-2">Location Verification</div>
            <div className="text-gray-300">Geofencing prevents proxy attendance beyond 100 meters.</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
            <div className="text-lg font-medium mb-2">Real-Time Monitoring</div>
            <div className="text-gray-300">Track sessions and attendance as they happen.</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
            <div className="text-lg font-medium mb-2">Modern Dashboard Interface</div>
            <div className="text-gray-300">Clean, responsive design inspired by top SaaS products.</div>
          </div>
        </div>
      </section>
    </div>
  )
}
