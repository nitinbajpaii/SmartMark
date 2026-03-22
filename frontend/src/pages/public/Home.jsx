import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { MapPin, Camera, Users, BarChart3, ArrowRight, Zap, Shield, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: MapPin,
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10 border-blue-500/20',
    title: 'Location Verified Attendance',
    desc: 'Prevent proxy attendance using real-time geofencing and location verification within 100 meters.'
  },
  {
    icon: Camera,
    color: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-500/10 border-purple-500/20',
    title: 'Camera-Based Attendance',
    desc: 'Secure attendance marking using camera snapshots and QR code verification.'
  },
  {
    icon: Users,
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Role-Based Dashboards',
    desc: 'Dedicated experiences for Students, Teachers, and Mentors — each tailored to their workflow.'
  },
  {
    icon: BarChart3,
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-500/10 border-amber-500/20',
    title: 'Real-Time Analytics',
    desc: 'Track attendance statistics and performance metrics across all sessions instantly.'
  },
]

const steps = [
  {
    num: '01',
    icon: Shield,
    title: 'Teacher creates a session',
    desc: 'Teacher sets the title, subject, and location — the session is geo-tagged automatically.'
  },
  {
    num: '02',
    icon: Camera,
    title: 'Student marks attendance',
    desc: 'Student verifies presence via QR scan and geolocation — no proxy is possible.'
  },
  {
    num: '03',
    icon: BarChart3,
    title: 'Mentor monitors analytics',
    desc: 'Mentor views all sessions, per-student attendance, and consolidated real-time stats.'
  },
]

const stats = [
  { value: '100m', label: 'Max geofence radius' },
  { value: '3', label: 'Role dashboards' },
  { value: 'Real-time', label: 'Attendance updates' },
  { value: '0', label: 'Proxy attempts possible' },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export default function Home() {
  const { user } = useAuth()
  const dash = user?.role === 'Teacher' ? '/teacher' : user?.role === 'Mentor' ? '/mentor' : '/student'

  return (
    <div className="page space-y-24">
      {/* Hero */}
      <section className="text-center space-y-8 pt-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="badge badge-purple mb-4">
            <Zap className="h-3 w-3" /> Intelligent Attendance Platform
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Modern, Secure{' '}
          <span className="gradient-text block md:inline">SmartMark</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          An intelligent attendance management platform for educational institutions.
          Location-verified, camera-secured, and role-powered.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Link to={user ? dash : '/signup'} className="gradient-btn px-8 py-3.5 text-base gap-2">
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to={dash} className="outline-btn px-8 py-3.5 text-base">
            View Dashboard
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="space-y-10">
        <div className="text-center space-y-3">
          <span className="badge badge-blue">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold">Powerful features for smart institutions</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Everything you need to run a fraud-free, efficient attendance system.</p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {features.map(({ icon: Icon, color, bg, title, desc }) => (
            <motion.div key={title} variants={itemVariants}>
              <Card className="h-full space-y-4 hover:scale-[1.02]">
                <div className={`inline-flex p-3 rounded-xl border ${bg}`}>
                  <div className={`bg-gradient-to-br ${color} rounded-lg p-2`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-white mb-1.5">{title}</div>
                  <div className="text-sm text-gray-400 leading-relaxed">{desc}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section className="space-y-10">
        <div className="text-center space-y-3">
          <span className="badge badge-green">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold">From session to report in 3 steps</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-12 left-[calc(16.5%+2rem)] right-[calc(16.5%+2rem)] h-px bg-gradient-to-r from-blue-500/30 via-purple-500/50 to-purple-500/30" />

          {steps.map(({ num, icon: Icon, title, desc }) => (
            <Card key={num} className="text-center space-y-4 hover:scale-[1.02]">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-purple-500/25 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-purple-400" />
                  </div>
                  <span className="absolute -top-2 -right-2 text-[10px] font-black text-purple-400 bg-purple-500/10 border border-purple-500/30 rounded-lg px-1.5 py-0.5">
                    {num}
                  </span>
                </div>
              </div>
              <div>
                <div className="font-semibold text-white mb-2">{title}</div>
                <div className="text-sm text-gray-400 leading-relaxed">{desc}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20 border border-white/10 p-10 md:p-16 text-center space-y-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
        </div>
        <div className="relative space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to get started?</h2>
          <p className="text-gray-400 max-w-md mx-auto">Join SmartMark and transform your institution's attendance management today.</p>
          <Link to={user ? dash : '/signup'} className="gradient-btn px-8 py-3.5 text-base inline-flex gap-2">
            {user ? 'Go to Dashboard' : 'Create free account'} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
