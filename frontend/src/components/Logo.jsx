import logo from '../assets/logo.svg'

export default function Logo({ showText = false, size = 10 }) {
  const box = `h-${size} w-${size}`
  return (
    <div className="flex items-center gap-3">
      <img src={logo} alt="SmartMark" className={`${box} object-contain`} />
      {showText && <div className="font-semibold">SmartMark</div>}
    </div>
  )
}
