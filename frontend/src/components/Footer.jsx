import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="mt-16 pt-8 pb-6 bg-white/5 backdrop-blur-xl border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size={10} showText />
        </div>
        <div className="text-sm text-gray-300">© {new Date().getFullYear()} SmartMark. All rights reserved.</div>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/about" className="hover:text-purple-400 transition-all">About</Link>
          <Link to="/contact" className="hover:text-purple-400 transition-all">Contact</Link>
          <a href="https://github.com/" target="_blank" className="hover:text-purple-400 transition-all" rel="noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.156-1.109-1.464-1.109-1.464-.907-.62.069-.608.069-.608 1.003.07 1.53 1.03 1.53 1.03.892 1.528 2.341 1.087 2.91.832.091-.647.35-1.087.636-1.337-2.222-.253-4.555-1.111-4.555-4.944 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.851.004 1.706.115 2.505.337 1.909-1.294 2.748-1.025 2.748-1.025.546 1.378.203 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.337 4.688-4.566 4.937.359.309.679.92.679 1.855 0 1.338-.012 2.418-.012 2.747 0 .268.181.579.688.48C19.138 20.162 22 16.414 22 12c0-5.523-4.477-10-10-10z"/></svg>
          </a>
          <a href="https://www.linkedin.com/" target="_blank" className="hover:text-purple-400 transition-all" rel="noreferrer" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M6.94 6.5A1.44 1.44 0 1 1 5.5 5.06 1.44 1.44 0 0 1 6.94 6.5zM7 8.75H4v11h3v-11zM13.5 8.5c-1.63 0-2.5.89-2.93 1.52V8.75H7v11h3.56v-6.11c0-1.62.92-2.56 2.29-2.56 1.3 0 2.15.86 2.15 2.54v6.13H19V13c0-3.19-1.7-4.5-3.98-4.5z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
