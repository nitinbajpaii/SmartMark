import { Link } from 'react-router-dom'
import { ArrowLeft, Frown } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-6">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Big number */}
        <div className="relative inline-block">
          <div className="text-[10rem] leading-none font-black gradient-text opacity-20 select-none absolute top-0 left-1/2 -translate-x-1/2">
            404
          </div>
          <div className="relative pt-8 flex flex-col items-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-purple-500/25 flex items-center justify-center mb-4">
              <Frown className="h-10 w-10 text-purple-400" />
            </div>
            <h1 className="text-6xl font-extrabold gradient-text">404</h1>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Page not found</h2>
          <p className="text-gray-400 max-w-sm mx-auto text-base">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="gradient-btn px-6 py-3 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Link to="/login" className="outline-btn px-6 py-3">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
