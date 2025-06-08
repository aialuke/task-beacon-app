

import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  safelist: [
    "text-destructive",
    "text-success",
    "text-primary",
    "bg-destructive",
    "bg-success",
    "fill-destructive",
    "fill-success",
    "fill-primary",
    "stroke-destructive",
    "stroke-success",
    "stroke-primary",
    "bg-task-pending",
    "bg-task-overdue",
    "bg-task-complete",
    "text-task-pending",
    "text-task-overdue",
    "text-task-complete",
    "dark:bg-gray-800",
    "dark:bg-gray-900",
    "dark:text-gray-100",
    "dark:text-gray-200",
    "dark:border-gray-700",
    "dark:border-gray-600",
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
          color: "#ef4444", // Moved string value
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        "accent-yellow": {
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
          DEFAULT: "hsl(var(--primary))",
          light: "hsl(var(--brand-light))",
        },
        "task-pending": "var(--status-pending)",
        "task-overdue": "var(--status-overdue)",
        "task-complete": "var(--status-complete)",
        "task-timer": "var(--status-pending)",
        // Enhanced gray scale for better dark mode
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6", 
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
        sidebar: "#1a1a1a",
        "sidebar-foreground": "#f3f3f3",
        "sidebar-accent": "#23272f",
        "sidebar-accent-foreground": "#fff",
        "sidebar-border": "#333",
      },
      borderRadius: {
        lg: "calc(var(--radius) - 2px)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 6px)",
        xl: "var(--radius)", // This now maps to 16px (2xl)
      },
      borderColor: {
        "sidebar-border": "#333",
      },
      boxShadow: {
        "task-card": "0 2px 8px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)",
        "task-card-dark":
          "0 2px 8px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.1)",
        focus: "var(--shadow-focus)",
        expanded: "0 8px 25px rgba(0, 0, 0, 0.15)", // From taskCardStyles.ts
      },
      padding: {
        card: "var(--card-padding, 1rem)", // From task-cards.css
      },
      transform: {
        gpu: "translate3d(0, 0, 0)",
      },
      scale: {
        "102": "1.02", // From task-cards.css and taskCardStyles.ts
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
        "caret-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        flash: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "pulse-subtle": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.03)" },
        },
        "ring-fill": {
          from: { strokeDashoffset: "var(--full-circumference)" },
          to: { strokeDashoffset: "var(--target-offset)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "caret-blink": "caret-blink 1s steps(1) infinite",
        flash: "flash 2s infinite",
        "ring-fill": "ring-fill 1.5s ease-out forwards",
        "pulse-subtle": "pulse-subtle 3s infinite ease-in-out",
      },
    },
  },
  plugins: [animate],
} satisfies Config;

// CodeRabbit review
// CodeRabbit review
