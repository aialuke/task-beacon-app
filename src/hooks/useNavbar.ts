import { useRef, useEffect, useState, useCallback } from 'react';
import { useSpring } from '@react-spring/web';
import { LucideIcon } from 'lucide-react';
import {
  computeNavbarColors,
  setupThemeObserver,
} from '@/lib/utils/navbarColors';
import {
  calculateActiveButtonBounds,
  calculateIndicatorPosition,
  calculateGlowPosition,
} from '@/lib/utils/navbarGeometry';

interface NavItem {
  name: string;
  value: string;
  icon: LucideIcon;
}

interface UseNavbarOptions {
  items: NavItem[];
  activeItem: string;
  onItemChange: (value: string) => void;
}

/**
 * Custom hook for navbar business logic
 * 
 * Handles:
 * - Active button positioning and animation
 * - Theme change detection
 * - Keyboard navigation
 * - Resize handling
 * - Spring animations for visual feedback
 */
export function useNavbar({ items, activeItem, onItemChange }: UseNavbarOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  const [activeButtonBounds, setActiveButtonBounds] = useState({
    x: 0,
    width: 0,
    centerX: 0,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [computedColors, setComputedColors] = useState(() =>
    computeNavbarColors()
  );

  // Theme change detection and color computation
  useEffect(() => {
    const updateColors = () => {
      setComputedColors(computeNavbarColors());
    };

    updateColors();
    const cleanup = setupThemeObserver(updateColors);
    return cleanup;
  }, []);

  // Active button position calculation
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
    const frame = requestAnimationFrame(() => {
      updateActiveButtonBounds();
    });
    return () => cancelAnimationFrame(frame);
  }, [updateActiveButtonBounds]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateActiveButtonBounds();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateActiveButtonBounds]);

  // Keyboard navigation
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
      buttonRefs.current[newIndex]?.focus();
    }
  }, [items, activeItem, onItemChange]);

  // Calculate positions for effects
  const indicatorPosition = calculateIndicatorPosition(activeButtonBounds.centerX, 24);
  const glowPosition = calculateGlowPosition(activeButtonBounds, 8);

  // Spring animations with centered positioning
  const indicatorLineSpring = useSpring({
    transform: `translateX(${indicatorPosition.x}px)`,
    width: indicatorPosition.width,
    opacity: isInitialized ? 1 : 0,
    config: {
      tension: 300,
      friction: 30,
    },
  });

  const buttonBackgroundSpring = useSpring({
    transform: `translateX(${activeButtonBounds.x}px)`,
    width: activeButtonBounds.width,
    opacity: isInitialized ? 1 : 0,
    config: {
      tension: 300,
      friction: 30,
    },
  });

  const glowSpring = useSpring({
    transform: `translateX(${glowPosition.x}px)`,
    width: glowPosition.width,
    opacity: isInitialized ? 1 : 0,
    config: {
      tension: 250,
      friction: 35,
    },
  });

  // Helper function to set button ref
  const setButtonRef = (index: number) => (element: HTMLButtonElement | null) => {
    buttonRefs.current[index] = element;
  };

  return {
    // Refs
    containerRef,
    setButtonRef,
    
    // State
    computedColors,
    isInitialized,
    
    // Event handlers
    handleKeyDown,
    
    // Animations
    indicatorLineSpring,
    buttonBackgroundSpring,
    glowSpring,
  };
}
