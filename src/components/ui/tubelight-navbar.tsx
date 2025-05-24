
import React from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  value: string
  icon: LucideIcon
}

interface TubelightNavbarProps {
  items: NavItem[]
  activeItem: string
  onItemChange: (value: string) => void
  className?: string
}

export function TubelightNavbar({ items, activeItem, onItemChange, className }: TubelightNavbarProps) {
  // Container styles with backdrop filter and shadow
  const containerStyles: React.CSSProperties = {
    background: 'rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid hsl(var(--border) / 0.5)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  }

  // Dark mode container styles
  const darkContainerStyles: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderColor: 'hsl(var(--border) / 0.3)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  }

  // Tubelight bar styles
  const tubelightBarStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-16px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '64px',
    height: '8px',
    backgroundColor: 'hsl(var(--primary))',
    borderRadius: '9999px',
    zIndex: 30,
    boxShadow: `
      0 0 4px hsl(var(--primary) / 0.8),
      0 0 8px hsl(var(--primary) / 0.6),
      0 0 12px hsl(var(--primary) / 0.4),
      0 0 20px hsl(var(--primary) / 0.2)
    `,
  }

  // Button background styles
  const buttonBgStyles: React.CSSProperties = {
    position: 'absolute',
    inset: '0',
    backgroundColor: 'hsl(var(--primary) / 0.2)',
    borderRadius: '9999px',
    zIndex: 5,
  }

  // Ambient glow styles
  const ambientGlowStyles: React.CSSProperties = {
    position: 'absolute',
    inset: '-16px',
    backgroundColor: 'hsl(var(--primary) / 0.1)',
    borderRadius: '9999px',
    filter: 'blur(20px)',
    zIndex: 0,
  }

  return (
    <div className={cn("flex justify-center w-full overflow-visible", className)}>
      <div 
        className="relative flex items-center gap-1 p-2 rounded-full overflow-visible"
        style={containerStyles}
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.value

          return (
            <button
              key={item.value}
              onClick={() => onItemChange(item.value)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold py-2 px-4 rounded-full transition-all duration-200 z-10 border-none bg-transparent",
                isActive ? "text-white" : "text-foreground/70 hover:text-foreground"
              )}
            >
              <span className="relative z-20">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              
              {isActive && (
                <>
                  {/* Main tubelight bar with glow effects */}
                  <motion.div
                    layoutId="tubelight-bar"
                    style={tubelightBarStyles}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                  
                  {/* Button background highlight */}
                  <motion.div
                    layoutId="button-bg"
                    style={buttonBgStyles}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                  
                  {/* Additional ambient glow */}
                  <motion.div
                    layoutId="ambient-glow"
                    style={ambientGlowStyles}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 40,
                    }}
                  />
                </>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
