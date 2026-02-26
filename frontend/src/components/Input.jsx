export default function Input({ label, ...props }) {
  return (
    <label className="block space-y-2">
      <span className="text-gray-300">{label}</span>
      <input className="input-premium px-4 py-3 w-full" {...props} />
    </label>
  )
}
