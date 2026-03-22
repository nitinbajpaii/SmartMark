import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

// Enhanced Input with icon, error display, and password toggle
export default function Input({ label, icon: Icon = null, error = '', type = 'text', className = '', ...props }) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword ? (show ? 'text' : 'password') : type

  return (
    <label className="block space-y-1.5">
      {label && (
        <span className="text-sm font-medium text-gray-300">{label}</span>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <Icon className="absolute left-3.5 h-4 w-4 text-gray-500 pointer-events-none shrink-0" />
        )}
        <input
          type={resolvedType}
          className={`input-premium w-full py-3 pr-4 ${Icon ? 'pl-10' : 'pl-4'} ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3.5 text-gray-500 hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
          <svg className="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </label>
  )
}
