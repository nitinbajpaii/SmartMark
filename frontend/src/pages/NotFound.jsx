import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-md p-8 space-y-4 text-center">
        <div className="text-3xl font-semibold">Page not found</div>
        <p className="text-gray-300">Return to the app</p>
        <Link to="/login" className="inline-block gradient-btn px-5 py-3">Go Home</Link>
      </div>
    </div>
  )
}
