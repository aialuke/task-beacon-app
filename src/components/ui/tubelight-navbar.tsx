
import React, { useEffect, useState } from "react"
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
  return (
    <div
      className={cn(
        "flex justify-center w-full overflow-visible relative",
        className,
      )}
    >
      <div className="relative flex items-center gap-1 bg-background/10 border border-border/50 backdrop-blur-lg py-2 px-2 rounded-full shadow-lg overflow-visible">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.value

          return (
            <button
              key={item.value}
              onClick={() => onItemChange(item.value)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 z-10",
                "text-foreground/70 hover:text-foreground",
                isActive && "text-white"
              )}
            >
              <span className="relative z-20">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              
              {isActive && (
                <>
                  {/* Main tubelight bar */}
                  <motion.div
                    layoutId="tubelight-bar"
                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-2 bg-primary rounded-full z-30"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  >
                    {/* Primary glow effects */}
                    <div className="absolute inset-0 bg-primary rounded-full blur-sm opacity-80" />
                    <div className="absolute -inset-1 bg-primary/60 rounded-full blur-md" />
                    <div className="absolute -inset-2 bg-primary/40 rounded-full blur-lg" />
                  </motion.div>
                  
                  {/* Button background highlight */}
                  <motion.div
                    layoutId="button-bg"
                    className="absolute inset-0 bg-primary/20 rounded-full z-5"
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
                    className="absolute -inset-4 bg-primary/10 rounded-full blur-xl z-0"
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
