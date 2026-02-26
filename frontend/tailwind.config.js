/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      colors: {
        brand: {
          start: "#3b82f6",
          mid: "#6366f1",
          end: "#7c3aed"
        }
      },
      boxShadow: {
        glow: "0 0 20px rgba(99,102,241,.35)"
      }
    }
  },
  plugins: []
}
