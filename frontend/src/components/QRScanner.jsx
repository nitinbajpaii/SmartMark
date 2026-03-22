import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { QrCode, RefreshCw, AlertCircle, Camera } from 'lucide-react'
import Button from './Button.jsx'

// Enhanced QR Scanner with animated scan ring and better status indicators
export default function QRScanner({ onResult }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [active, setActive] = useState(false)
  const [error, setError] = useState('')
  const [last, setLast] = useState('')

  useEffect(() => {
    let raf = null
    let stream = null
    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.setAttribute('playsinline', 'true')
          videoRef.current.muted = true
          await videoRef.current.play()
        }
        setActive(true)
        setError('')
        const tick = () => {
          try {
            const v = videoRef.current
            const c = canvasRef.current
            if (v && c && v.readyState === 4) {
              c.width = v.videoWidth
              c.height = v.videoHeight
              const ctx = c.getContext('2d')
              ctx.drawImage(v, 0, 0, c.width, c.height)
              const img = ctx.getImageData(0, 0, c.width, c.height)
              const code = jsQR(img.data, img.width, img.height)
              if (code && code.data && code.data !== last) {
                setLast(code.data)
                onResult?.(code.data)
              }
            }
          } catch {}
          raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      } catch (e) {
        let msg = 'Camera access denied'
        if (e && e.name === 'NotAllowedError') msg = 'Camera permission was denied in the browser'
        else if (e && e.name === 'NotFoundError') msg = 'No suitable camera device found'
        else if (e && e.name === 'NotReadableError') msg = 'Camera is in use by another application'
        else if (e && e.name === 'SecurityError') msg = 'Insecure context: use HTTPS or localhost for camera'
        setError(msg)
      }
    }
    start()
    return () => {
      if (raf) cancelAnimationFrame(raf)
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Video feed with scan ring overlay */}
      <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/40">
        <video
          ref={videoRef}
          className="w-full h-64 object-cover"
          playsInline
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Scan ring animation */}
        {active && !error && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 relative">
              <div className="absolute inset-0 border-2 border-purple-400/60 rounded-2xl animate-pulse2" />
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-400 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-purple-400 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-purple-400 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-400 rounded-br-lg" />
            </div>
          </div>
        )}

        {/* Initializing overlay */}
        {!active && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50">
            <Camera className="h-8 w-8 text-gray-400 animate-pulse" />
            <p className="text-sm text-gray-400">Initializing camera…</p>
          </div>
        )}
      </div>

      {/* Status */}
      {error ? (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          {active ? (
            <>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
              Scanning for QR code…
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              Starting camera…
            </>
          )}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        icon={RefreshCw}
        onClick={() => setLast('')}
      >
        Reset Scanner
      </Button>
    </div>
  )
}
