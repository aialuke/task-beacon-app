/**
 * Mobile utilities
 * 
 * Provides mobile-specific detection and utility functions.
 * Migrated from src/lib/mobile-utils.tsx - use this path going forward.
 */

/**
 * Detect if the current device is likely a mobile device
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check user agent first
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'android', 'iphone', 'ipad', 'ipod', 'blackberry', 
    'windows phone', 'mobile', 'opera mini'
  ];
  
  const isMobileUA = mobileKeywords.some(keyword => 
    userAgent.includes(keyword)
  );
  
  // Check screen size as backup
  const isMobileScreen = window.innerWidth <= 768;
  
  // Check touch capability
  const isTouchDevice = 'ontouchstart' in window || 
                       navigator.maxTouchPoints > 0;
  
  return isMobileUA || (isMobileScreen && isTouchDevice);
}

/**
 * Detect if the current device is a tablet
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isIPad = userAgent.includes('ipad');
  const isAndroidTablet = userAgent.includes('android') && !userAgent.includes('mobile');
  
  // Screen size check for tablets
  const screenWidth = window.innerWidth;
  const isTabletScreen = screenWidth >= 768 && screenWidth <= 1024;
  
  return isIPad || isAndroidTablet || (isTabletScreen && 'ontouchstart' in window);
}

/**
 * Detect if the current device is a desktop
 */
export function isDesktop(): boolean {
  return !isMobile() && !isTablet();
}

/**
 * Get device type as string
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
}

/**
 * Detect iOS device
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

/**
 * Detect Android device
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('android');
}

/**
 * Detect if running in standalone mode (PWA)
 */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

/**
 * Get viewport dimensions
 */
export function getViewportDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

/**
 * Get screen orientation
 */
export function getScreenOrientation(): 'portrait' | 'landscape' {
  if (typeof window === 'undefined') return 'portrait';
  
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

/**
 * Check if device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

/**
 * Check if device has hover capability
 */
export function hasHoverSupport(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(hover: hover)').matches;
}

/**
 * Get device pixel ratio
 */
export function getPixelRatio(): number {
  if (typeof window === 'undefined') return 1;
  
  return window.devicePixelRatio || 1;
}

/**
 * Check if device is in dark mode
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Get device information object
 */
export function getDeviceInfo(): {
  type: 'mobile' | 'tablet' | 'desktop';
  os: 'ios' | 'android' | 'other';
  isTouch: boolean;
  hasHover: boolean;
  pixelRatio: number;
  viewport: { width: number; height: number };
  orientation: 'portrait' | 'landscape';
  isStandalone: boolean;
  prefersDark: boolean;
} {
  const deviceType = getDeviceType();
  let os: 'ios' | 'android' | 'other' = 'other';
  
  if (isIOS()) os = 'ios';
  else if (isAndroid()) os = 'android';
  
  return {
    type: deviceType,
    os,
    isTouch: isTouchDevice(),
    hasHover: hasHoverSupport(),
    pixelRatio: getPixelRatio(),
    viewport: getViewportDimensions(),
    orientation: getScreenOrientation(),
    isStandalone: isStandalone(),
    prefersDark: prefersDarkMode(),
  };
}

// Legacy export for backward compatibility
export const mobileUtils = {
  isMobile,
  isTablet,
  isDesktop,
  getDeviceType,
  isIOS,
  isAndroid,
  isStandalone,
  getViewportDimensions,
  getScreenOrientation,
  isTouchDevice,
  hasHoverSupport,
  getPixelRatio,
  prefersDarkMode,
  getDeviceInfo,
}; 