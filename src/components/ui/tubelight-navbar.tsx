
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
    <div className={cn("tubelight-navbar flex justify-center w-full overflow-visible", className)}>
      <div className="tubelight-container relative flex items-center gap-1 p-2 rounded-full overflow-visible shadow-lg">
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
                    className="tubelight-bar"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  >
                    <div className="tubelight-glow-outer" />
                  </motion.div>
                  
                  {/* Button background highlight */}
                  <motion.div
                    layoutId="button-bg"
                    className="tubelight-button-bg"
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
                    className="tubelight-ambient"
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
