
import React, { useRef, useEffect, useState } from "react"
import { useSpring, animated } from "@react-spring/web"
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
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [activeButtonBounds, setActiveButtonBounds] = useState({ x: 0, width: 0 })

  // Container styles with backdrop filter and shadow
  const containerStyles: React.CSSProperties = {
    background: 'rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid hsl(var(--border) / 0.5)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  }

  // Calculate active button position
  useEffect(() => {
    const activeIndex = items.findIndex(item => item.value === activeItem)
    const activeButton = buttonRefs.current[activeIndex]
    const container = containerRef.current

    if (activeButton && container) {
      const buttonRect = activeButton.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      
      setActiveButtonBounds({
        x: buttonRect.left - containerRect.left + buttonRect.width / 2,
        width: buttonRect.width
      })
    }
  }, [activeItem, items])

  // Spring animations for tubelight bar
  const tubelightBarSpring = useSpring({
    transform: `translateX(${activeButtonBounds.x - 32}px)`, // Center the 64px bar
    config: {
      tension: 400,
      friction: 30
    }
  })

  // Spring animations for button background
  const buttonBgSpring = useSpring({
    transform: `translateX(${activeButtonBounds.x - activeButtonBounds.width / 2}px)`,
    width: activeButtonBounds.width,
    config: {
      tension: 400,
      friction: 30
    }
  })

  // Spring animations for ambient glow
  const ambientGlowSpring = useSpring({
    transform: `translateX(${activeButtonBounds.x - activeButtonBounds.width / 2 - 16}px)`,
    width: activeButtonBounds.width + 32,
    config: {
      tension: 300,
      friction: 40
    }
  })

  return (
    <div className={cn("flex justify-center w-full overflow-visible", className)}>
      <div 
        ref={containerRef}
        className="relative flex items-center gap-1 p-2 rounded-full overflow-visible"
        style={containerStyles}
      >
        {/* Main tubelight bar with glow effects */}
        <animated.div
          style={{
            position: 'absolute',
            top: '-16px',
            left: '0px',
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
            ...tubelightBarSpring
          }}
        />
        
        {/* Button background highlight */}
        <animated.div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            height: '40px',
            backgroundColor: 'hsl(var(--primary) / 0.2)',
            borderRadius: '9999px',
            zIndex: 5,
            ...buttonBgSpring
          }}
        />
        
        {/* Additional ambient glow */}
        <animated.div
          style={{
            position: 'absolute',
            top: '-8px',
            left: '-8px',
            height: '56px',
            backgroundColor: 'hsl(var(--primary) / 0.1)',
            borderRadius: '9999px',
            filter: 'blur(20px)',
            zIndex: 0,
            ...ambientGlowSpring
          }}
        />

        {items.map((item, index) => {
          const Icon = item.icon
          const isActive = activeItem === item.value

          return (
            <button
              key={item.value}
              ref={el => buttonRefs.current[index] = el}
              onClick={() => onItemChange(item.value)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold py-2 px-4 rounded-full transition-all duration-200 z-10 border-none bg-transparent",
                isActive ? "text-white" : "text-foreground/70 hover:text-foreground"
              )}
            >
              <span className="relative z-20">
                <Icon size={18} strokeWidth={2.5} />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
