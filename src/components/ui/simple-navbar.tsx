import { memo } from 'react';
import { LucideIcon } from 'lucide-react';

import { useNavbar } from '@/hooks/ui';
import { cn } from '@/lib/utils';

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

/**
 * Pure UI component for navigation bar
 *
 * This component focuses solely on rendering and delegates all business logic
 * to the useNavbar hook, following separation of concerns principles.
 */
export const SimpleNavbar = memo(function SimpleNavbar({
  items,
  activeItem,
  onItemChange,
  className,
}: SimpleNavbarProps) {
  const {
    containerRef,
    setButtonRef,
    computedColors,
    handleKeyDown,
    indicatorLineStyle,
    buttonBackgroundStyle,
    glowStyle,
  } = useNavbar({ items, activeItem, onItemChange });

  return (
    <div className={cn('flex w-full justify-center', className)}>
      <div
        ref={containerRef}
        role="tablist"
        aria-orientation="horizontal"
        aria-label="Navigation"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative z-[100] flex items-center gap-1 rounded-full border border-border bg-card/80 p-2 shadow-lg backdrop-blur-md"
      >
        {/* Active indicator line above button */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-4px',
            left: '0px',
            height: '4px',
            borderRadius: '9999px',
            zIndex: 120,
            filter: 'blur(1px)',
            backgroundColor: computedColors.indicatorColor,
            boxShadow: computedColors.isDarkMode
              ? '0 0 8px rgba(255, 255, 255, 0.4)'
              : `0 0 8px ${computedColors.primaryGlow}`,
            ...indicatorLineStyle,
          }}
        />

        {/* Button background highlight */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '8px',
            left: '0px',
            height: '40px',
            borderRadius: '9999px',
            zIndex: 110,
            backgroundColor: computedColors.highlightColor,
            ...buttonBackgroundStyle,
          }}
        />

        {/* Glow effect */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '0px',
            left: '0px',
            height: '56px',
            borderRadius: '9999px',
            zIndex: 105,
            backgroundColor: computedColors.primaryVeryLight,
            filter: 'blur(8px)',
            ...glowStyle,
          }}
        />

        {/* Navigation buttons */}
        {items.map((item, index) => {
          const isActive = item.value === activeItem;
          const Icon = item.icon;

          return (
            <button
              key={item.value}
              ref={setButtonRef(index)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${item.value}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => {
                onItemChange(item.value);
              }}
              className={cn(
                'relative z-[120] flex h-10 min-w-10 items-center justify-center rounded-full px-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                isActive
                  ? 'text-foreground'
                  : 'text-foreground/70 hover:text-foreground active:text-foreground/90',
              )}
              title={item.name}
            >
              <Icon size={20} />
              <span className="sr-only">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
