import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import Button from './Button.jsx'

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
    <div>
      <div className="rounded-xl overflow-hidden border border-white/20">
        <video ref={videoRef} className="w-full h-60 object-cover bg-black/30" playsInline />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      {error ? (
        <div className="text-sm text-red-400 mt-2">{error}</div>
      ) : (
        <div className="text-xs text-gray-300 mt-2">{active ? 'Scanning...' : 'Initializing camera...'}</div>
      )}
      <div className="mt-3">
        <Button className="px-4 py-2" onClick={() => setLast('')}>Reset Scanner</Button>
      </div>
    </div>
  )
}
