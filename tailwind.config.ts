
// tailwind.config.ts
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  safelist: [
    'text-destructive',
    'text-success',
    'text-primary',
    'text-gray-600',
    'text-gray-900',
    'text-gray-500',
    'text-foreground',
    'text-white',
    'bg-gray-50',
    'bg-white',
    'bg-primary',
    'bg-card',
    'bg-popover',
    'bg-background',
    'border-gray-200',
    'border-gray-300',
    'border-secondary',
    'border',
    'border-primary',
    'hover:border-secondary',
    'hover:underline',
    'bg-destructive', 
    'bg-success',
    'fill-destructive',
    'fill-success',
    'fill-primary',
    'fill-white',
    'fill-gray-500',
    'fill-gray-900',
    'stroke-destructive',
    'stroke-success',
    'stroke-primary',
    'stroke-white',
    'stroke-gray-500',
    'stroke-gray-900',
    'rounded-full',
    'rounded-xl',
    'rounded-lg',
    'rounded-md',
    'rounded-sm',
    // Dark mode classes
    'dark:bg-gray-800',
    'dark:bg-gray-900',
    'dark:text-gray-100',
    'dark:text-gray-200',
    'dark:border-gray-700',
    'dark:border-gray-600',
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
          DEFAULT: "225 77% 60%", // #4C6DE1 in HSL
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
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        brand: {
          DEFAULT: "225 77% 60%", // #4C6DE1 in HSL
          light: "hsl(var(--brand-light))",
        },
        "task-pending": "var(--status-pending)",
        "task-overdue": "var(--status-overdue)",
        "task-complete": "var(--status-complete)",
        "task-timer": "var(--status-pending)",
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
