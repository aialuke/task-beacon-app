
import React, { useRef, useEffect, useState } from "react"
import { useSpring, animated } from "@react-spring/web"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  value: string
  icon: LucideIcon
}

interface SimpleNavbarProps {
  items: NavItem[]
  activeItem: string
  onItemChange: (value: string) => void
  className?: string
}

export function SimpleNavbar({ items, activeItem, onItemChange, className }: SimpleNavbarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [activeButtonBounds, setActiveButtonBounds] = useState({ x: 0, width: 0 })
  const [isInitialized, setIsInitialized] = useState(false)

  // Calculate active button position with proper timing
  const updateActiveButtonBounds = () => {
    const activeIndex = items.findIndex(item => item.value === activeItem)
    const activeButton = buttonRefs.current[activeIndex]
    const container = containerRef.current

    if (activeButton && container) {
      const buttonRect = activeButton.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      
      // Account for container padding (8px on each side)
      const containerPadding = 8
      
      setActiveButtonBounds({
        x: buttonRect.left - containerRect.left - containerPadding,
        width: buttonRect.width
      })
      
      if (!isInitialized) {
        setIsInitialized(true)
      }
    }
  }

  // Initialize and update on changes
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    const frame = requestAnimationFrame(() => {
      updateActiveButtonBounds()
    })
    
    return () => cancelAnimationFrame(frame)
  }, [activeItem, items])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateActiveButtonBounds()
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [activeItem])

  // Spring animation for active indicator line
  const indicatorLineSpring = useSpring({
    transform: `translateX(${activeButtonBounds.x}px)`,
    width: activeButtonBounds.width,
    opacity: isInitialized ? 1 : 0,
    config: {
      tension: 300,
      friction: 30
    }
  })

  // Spring animation for button background
  const buttonBackgroundSpring = useSpring({
    transform: `translateX(${activeButtonBounds.x}px)`,
    width: activeButtonBounds.width,
    opacity: isInitialized ? 1 : 0,
    config: {
      tension: 300,
      friction: 30
    }
  })

  // Spring animation for glow effect
  const glowSpring = useSpring({
    transform: `translateX(${activeButtonBounds.x - 8}px)`,
    width: activeButtonBounds.width + 16,
    opacity: isInitialized ? 1 : 0,
    config: {
      tension: 250,
      friction: 35
    }
  })

  return (
    <div className={cn("flex justify-center w-full", className)}>
      <div 
        ref={containerRef}
        className="relative flex items-center gap-1 p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg"
      >
        {/* Active indicator line above button */}
        <animated.div
          style={{
            position: 'absolute',
            top: '-6px',
            left: '8px',
            height: '4px',
            borderRadius: '9999px',
            zIndex: 20,
            filter: 'blur(1px)',
            backgroundColor: 'hsl(var(--primary) / 0.8)',
            boxShadow: '0 0 8px hsl(var(--primary) / 0.6)',
            ...indicatorLineSpring
          }}
        />
        
        {/* Button background highlight */}
        <animated.div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            height: '40px',
            borderRadius: '9999px',
            zIndex: 5,
            backgroundColor: 'hsl(var(--primary) / 0.2)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            ...buttonBackgroundSpring
          }}
        />
        
        {/* Ambient glow effect */}
        <animated.div
          style={{
            position: 'absolute',
            top: '4px',
            left: '0px',
            height: '48px',
            borderRadius: '9999px',
            zIndex: 0,
            backgroundColor: 'hsl(var(--primary) / 0.1)',
            filter: 'blur(12px)',
            boxShadow: '0 0 20px hsl(var(--primary) / 0.3)',
            ...glowSpring
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
                "relative cursor-pointer text-sm font-medium py-2 px-4 rounded-full transition-all duration-200 z-10 border-none bg-transparent min-w-[48px]",
                isActive 
                  ? "text-white dark:text-white" 
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              )}
            >
              <span className="relative z-20 flex items-center justify-center">
                <Icon size={18} strokeWidth={2.5} />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
