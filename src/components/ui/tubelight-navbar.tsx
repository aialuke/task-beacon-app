
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
    <div className={cn("tubelight-navbar", className)}>
      <div className="tubelight-container">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.value

          return (
            <button
              key={item.value}
              onClick={() => onItemChange(item.value)}
              className={cn(
                "tubelight-button",
                isActive && "active"
              )}
            >
              <span className="tubelight-icon">
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
