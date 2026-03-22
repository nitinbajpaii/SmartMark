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
        },
        surface: {
          DEFAULT: "rgba(255,255,255,0.05)",
          hover: "rgba(255,255,255,0.10)",
          border: "rgba(255,255,255,0.12)"
        }
      },
      boxShadow: {
        glow: "0 0 20px rgba(99,102,241,.35)",
        "glow-lg": "0 0 40px rgba(99,102,241,.25)",
        "glow-purple": "0 0 20px rgba(124,58,237,.3)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.1)"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" }
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "fade-in-delay": "fade-in 0.4s ease-out 0.15s both",
        "slide-in-left": "slide-in-left 0.4s ease-out both",
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
        pulse2: "pulse2 2s ease-in-out infinite",
        "spin-slow": "spin-slow 3s linear infinite"
      },
      backgroundSize: {
        "200%": "200%"
      }
    }
  },
  plugins: []
}
