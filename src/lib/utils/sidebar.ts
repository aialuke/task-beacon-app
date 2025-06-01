/**
 * Sidebar utilities
 * 
 * Provides sidebar constants, variants, and utility functions.
 * Consolidating sidebar-related utilities - use this path going forward.
 */

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Sidebar context interface
 */
export interface SidebarContext {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  toggleSidebar: () => void;
}

/**
 * Sidebar context
 */
export const SidebarContext = React.createContext<SidebarContext | null>(null);

/**
 * Use sidebar hook
 */
export function useSidebar(): SidebarContext {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

/**
 * Sidebar menu button variants
 */
export const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!h-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Sidebar constants
 */
export const SIDEBAR_CONSTANTS = {
  widths: {
    collapsed: '4rem',
    expanded: '16rem',
    mobile: '100%',
  },
  breakpoints: {
    mobile: 768,
    tablet: 1024,
  },
  animations: {
    duration: '200ms',
    easing: 'ease-in-out',
  },
} as const;

/**
 * Sidebar container variants
 */
export const sidebarVariants = cva(
  "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r bg-background transition-transform duration-200 ease-in-out",
  {
    variants: {
      variant: {
        default: "border-border",
        ghost: "border-transparent",
        outline: "border-2 border-border",
      },
      size: {
        sm: "w-48",
        default: "w-64",
        lg: "w-80",
      },
      state: {
        open: "translate-x-0",
        closed: "-translate-x-full",
        collapsed: "w-16",
      },
      mobile: {
        true: "w-full sm:w-64",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "open",
      mobile: false,
    },
  }
);

/**
 * Sidebar item variants
 */
export const sidebarItemVariants = cva(
  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-transparent",
        outline: "border border-input hover:bg-accent",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        default: "px-3 py-2 text-sm",
        lg: "px-4 py-3 text-base",
      },
      active: {
        true: "bg-accent text-accent-foreground",
        false: "",
      },
      disabled: {
        true: "pointer-events-none opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      active: false,
      disabled: false,
    },
  }
);

/**
 * Sidebar overlay variants
 */
export const sidebarOverlayVariants = cva(
  "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity",
  {
    variants: {
      visible: {
        true: "opacity-100",
        false: "opacity-0 pointer-events-none",
      },
    },
    defaultVariants: {
      visible: false,
    },
  }
);

/**
 * Get sidebar classes for different states
 */
export function getSidebarClasses(props?: VariantProps<typeof sidebarVariants>) {
  return sidebarVariants(props);
}

/**
 * Get sidebar item classes
 */
export function getSidebarItemClasses(props?: VariantProps<typeof sidebarItemVariants>) {
  return sidebarItemVariants(props);
}

/**
 * Get sidebar overlay classes
 */
export function getSidebarOverlayClasses(props?: VariantProps<typeof sidebarOverlayVariants>) {
  return sidebarOverlayVariants(props);
}

/**
 * Calculate sidebar width based on state
 */
export function getSidebarWidth(
  isCollapsed: boolean,
  isMobile: boolean = false
): string {
  if (isMobile) {
    return SIDEBAR_CONSTANTS.widths.mobile;
  }
  return isCollapsed 
    ? SIDEBAR_CONSTANTS.widths.collapsed 
    : SIDEBAR_CONSTANTS.widths.expanded;
}

/**
 * Check if sidebar should be collapsed on current screen size
 */
export function shouldCollapseOnResize(screenWidth: number): boolean {
  return screenWidth < SIDEBAR_CONSTANTS.breakpoints.mobile;
}

/**
 * Get sidebar animation styles
 */
export function getSidebarAnimationStyles(): React.CSSProperties {
  return {
    transition: `transform ${SIDEBAR_CONSTANTS.animations.duration} ${SIDEBAR_CONSTANTS.animations.easing}`,
  };
}

/**
 * Generate sidebar item props for navigation
 */
export function createSidebarItemProps(
  isActive: boolean,
  isDisabled: boolean = false,
  variant: VariantProps<typeof sidebarItemVariants>['variant'] = 'default',
  size: VariantProps<typeof sidebarItemVariants>['size'] = 'default'
) {
  return {
    className: getSidebarItemClasses({
      variant,
      size,
      active: isActive,
      disabled: isDisabled,
    }),
    'aria-current': isActive ? 'page' : undefined,
    'aria-disabled': isDisabled,
  };
}

/**
 * Sidebar state management helpers
 */
export interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
}

/**
 * Get initial sidebar state based on screen size and preferences
 */
export function getInitialSidebarState(
  screenWidth?: number,
  userPreference?: boolean
): SidebarState {
  const width = screenWidth || (typeof window !== 'undefined' ? window.innerWidth : 1024);
  const isMobile = width < SIDEBAR_CONSTANTS.breakpoints.mobile;
  
  return {
    isOpen: !isMobile && (userPreference ?? true),
    isCollapsed: false,
    isMobile,
  };
}

/**
 * Handle sidebar state transitions
 */
export function handleSidebarToggle(
  currentState: SidebarState,
  action: 'toggle' | 'open' | 'close' | 'collapse' | 'expand'
): SidebarState {
  switch (action) {
    case 'toggle':
      return {
        ...currentState,
        isOpen: !currentState.isOpen,
      };
    case 'open':
      return {
        ...currentState,
        isOpen: true,
      };
    case 'close':
      return {
        ...currentState,
        isOpen: false,
      };
    case 'collapse':
      return {
        ...currentState,
        isCollapsed: true,
      };
    case 'expand':
      return {
        ...currentState,
        isCollapsed: false,
      };
    default:
      return currentState;
  }
}

// Legacy export for backward compatibility
export const sidebarUtils = {
  SIDEBAR_CONSTANTS,
  sidebarVariants,
  sidebarItemVariants,
  sidebarOverlayVariants,
  getSidebarClasses,
  getSidebarItemClasses,
  getSidebarOverlayClasses,
  getSidebarWidth,
  shouldCollapseOnResize,
  getSidebarAnimationStyles,
  createSidebarItemProps,
  getInitialSidebarState,
  handleSidebarToggle,
};

// Re-export variant props types
export type SidebarVariantProps = VariantProps<typeof sidebarVariants>;
export type SidebarItemVariantProps = VariantProps<typeof sidebarItemVariants>;
export type SidebarOverlayVariantProps = VariantProps<typeof sidebarOverlayVariants>; 