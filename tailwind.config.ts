// tailwind.config.ts
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  safelist: [
    'text-destructive',
    'text-success',
    'text-primary',
    'text-gray-600',
    'bg-gray-50',
    'border-gray-200',
    'hover:underline',
    'bg-destructive', 
    'bg-success',
    'fill-destructive',
    'fill-success',
    // Added for new color scheme
    'bg-blue-600',
    'text-blue-600',
    'border-blue-600',
    'bg-yellow-400',
    'bg-red-500',
    'text-yellow-400',
    'border-yellow-400',
    'text-red-500',
    'border-red-500',
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        'accent-yellow': {
          DEFAULT: "hsl(var(--accent-yellow))",
          foreground: "hsl(var(--foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--surface-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--surface-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--timer-complete))",
          foreground: "white",
        },
        brand: {
          DEFAULT: "hsl(var(--primary))",
          light: "#E5EDFF",
        },
        "task-pending": "var(--timer-pending)",
        "task-overdue": "var(--timer-overdue)",
        "task-complete": "var(--timer-complete)",
        "task-timer": "var(--timer-pending)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "var(--pulse-opacity, 0.8)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "pulse-subtle": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite --pulse-opacity=0.8",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
