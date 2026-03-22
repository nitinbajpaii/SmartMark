import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import StudentDashboard from './pages/student/StudentDashboard.jsx'
import TeacherDashboard from './pages/teacher/TeacherDashboard.jsx'
import MentorDashboard from './pages/mentor/MentorDashboard.jsx'
import NotFound from './pages/NotFound.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/public/Home.jsx'
import About from './pages/public/About.jsx'
import Contact from './pages/public/Contact.jsx'

function ProtectedRoute({ children, role }) {
  const { user, initializing } = useAuth()

  // Session is still being restored from localStorage — wait before redirecting
  if (initializing) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <svg className="h-8 w-8 animate-spin text-purple-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Restoring session…</span>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="relative">
            <div className="pointer-events-none absolute -z-10 top-20 left-10 h-72 w-72 bg-purple-500/30 blur-3xl rounded-full"></div>
            <div className="pointer-events-none absolute -z-10 bottom-20 right-10 h-80 w-80 bg-indigo-500/30 blur-3xl rounded-full"></div>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/student"
              element={
                <ProtectedRoute role="Student">
                  <DashboardLayout>
                    <StudentDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher"
              element={
                <ProtectedRoute role="Teacher">
                  <DashboardLayout>
                    <TeacherDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentor"
              element={
                <ProtectedRoute role="Mentor">
                  <DashboardLayout>
                    <MentorDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
