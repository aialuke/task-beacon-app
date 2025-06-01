import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  computeNavbarColors,
  setupThemeObserver,
} from '@/lib/utils/navbarColors';
import {
  calculateActiveButtonBounds,
  setButtonRef,
} from '@/lib/utils/navbarGeometry';

interface NavItem {
  name: string;
  value: string;
  icon: LucideIcon;
}

interface SimpleNavbarProps {
  items: NavItem[];
  activeItem: string;
  onItemChange: (value: string) => void;
  className?: string;
}

export function SimpleNavbar({
  items,
  activeItem,
  onItemChange,
  className,
}: SimpleNavbarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeButtonBounds, setActiveButtonBounds] = useState({
    x: 0,
    width: 0,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [computedColors, setComputedColors] = useState(() =>
    computeNavbarColors()
  );

  // Get computed CSS variable values and detect theme
  useEffect(() => {
    const updateColors = () => {
      setComputedColors(computeNavbarColors());
    };

    // Get colors on mount and when theme changes
    updateColors();

    // Listen for theme changes
    const cleanup = setupThemeObserver(updateColors);

    return cleanup;
  }, []);

  // Calculate active button position with proper timing - wrapped in useCallback
  const updateActiveButtonBounds = useCallback(() => {
    const activeIndex = items.findIndex((item) => item.value === activeItem);
    const container = containerRef.current;

    if (activeIndex >= 0 && container) {
      const containerPadding = 8;
      const newBounds = calculateActiveButtonBounds(
        activeIndex,
        buttonRefs.current,
        container,
        containerPadding
      );

      setActiveButtonBounds(newBounds);

      if (!isInitialized) {
        setIsInitialized(true);
      }
    }
  }, [items, activeItem, isInitialized]);

  // Initialize and update on changes
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    const frame = requestAnimationFrame(() => {
      updateActiveButtonBounds();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [updateActiveButtonBounds]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateActiveButtonBounds();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateActiveButtonBounds]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    const activeIndex = items.findIndex((item) => item.value === activeItem);
    let newIndex = activeIndex;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        newIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    const newItem = items[newIndex];
    if (newItem) {
      onItemChange(newItem.value);
      // Focus the new active button
      buttonRefs.current[newIndex]?.focus();
    }
  }, [items, activeItem, onItemChange]);

  // Spring animation for active indicator line
  const indicatorLineSpring = useSpring({
    transform: `translateX(${activeButtonBounds.x}px)`,
    width: 40,
    opacity: isInitialized ? 1 : 0,
    config: {
      tension: 300,
      friction: 30,
    },
  });

  // Spring animation for button background
  const buttonBackgroundSpring = useSpring({
    transform: `translateX(${activeButtonBounds.x}px)`,
    width: activeButtonBounds.width,
    opacity: isInitialized ? 1 : 0,
    config: {
      tension: 300,
      friction: 30,
    },
  });

  // Spring animation for glow effect
  const glowSpring = useSpring({
    transform: `translateX(${activeButtonBounds.x - 8}px)`,
    width: activeButtonBounds.width + 16,
    opacity: isInitialized ? 1 : 0,
    config: {
      tension: 250,
      friction: 35,
    },
  });

  return (
    <div className={cn('flex w-full justify-center', className)}>
      <div
        ref={containerRef}
        role="tablist"
        aria-orientation="horizontal"
        aria-label="Navigation"
        onKeyDown={handleKeyDown}
        className="relative flex items-center gap-1 rounded-full border border-gray-300 bg-gray-50/80 p-2 shadow-lg backdrop-blur-md dark:border-gray-600 dark:bg-gray-900/90"
      >
        {/* Active indicator line above button */}
        <animated.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-4px',
            left: '12px',
            height: '4px',
            borderRadius: '9999px',
            zIndex: 20,
            filter: 'blur(1px)',
            backgroundColor: computedColors.indicatorColor,
            boxShadow: computedColors.isDarkMode
              ? '0 0 8px rgba(255, 255, 255, 0.4)'
              : `0 0 8px ${computedColors.primaryGlow}`,
            ...indicatorLineSpring,
          }}
        />

        {/* Button background highlight */}
        <animated.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '8px',
            height: '38px',
            borderRadius: '9999px',
            zIndex: 5,
            backgroundColor: computedColors.highlightColor,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            ...buttonBackgroundSpring,
          }}
        />

        {/* Ambient glow effect */}
        <animated.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '0px',
            left: '0px',
            height: '48px',
            borderRadius: '9999px',
            zIndex: 0,
            backgroundColor: computedColors.primaryVeryLight,
            filter: 'blur(12px)',
            boxShadow: `0 0 20px ${computedColors.primaryGlow}`,
            ...glowSpring,
          }}
        />

        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeItem === item.value;

          return (
            <button
              key={item.value}
              ref={(el) => setButtonRef(buttonRefs, index, el)}
              onClick={() => onItemChange(item.value)}
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`${item.name}${isActive ? ' (current)' : ''}`}
              tabIndex={isActive ? 0 : -1}
              className={cn(
                'relative z-10 min-w-[48px] cursor-pointer rounded-full border-none bg-transparent px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                isActive
                  ? 'text-white dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              )}
            >
              <span className="relative z-20 flex items-center justify-center">
                <Icon size={18} strokeWidth={2.5} aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
