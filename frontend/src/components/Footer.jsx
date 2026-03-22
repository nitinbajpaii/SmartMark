import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { Github, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/[0.08] bg-slate-950/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <Logo size={8} />
            <div>
              <div className="font-bold text-sm text-white">SmartMark</div>
              <div className="text-xs text-gray-500">Smart Attendance Platform</div>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500 order-last md:order-none">
            © {new Date().getFullYear()} SmartMark. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex items-center gap-5">
            <Link to="/about" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">About</Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">Contact</Link>
            <div className="w-px h-4 bg-white/10" />
            <a
              href="https://github.com/nitinbajpaii"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-gray-500 hover:text-white transition-all hover:scale-110"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/nitinbajpaii"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-gray-500 hover:text-blue-400 transition-all hover:scale-110"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
