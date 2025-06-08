/**
 * Notification utilities for providing user feedback through various channels
 * 
 * Supports browser notifications, haptic feedback, and other non-intrusive
 * user notification methods. Gracefully handles permissions and fallbacks.
 */

export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
}

/**
 * Show a browser notification (requires user permission)
 * 
 * Automatically requests permission if not already granted.
 * Falls back gracefully if notifications are not supported.
 * 
 * @param title - The notification title
 * @param options - Additional notification options
 * @returns Promise<boolean> - Success status
 */
export async function showBrowserNotification(
  title: string,
  body?: string,
  options: Partial<NotificationOptions> = {}
): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return false;
  }

  // Request permission if needed
  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return false;
    }
  }

  if (Notification.permission === "granted") {
    try {
      new Notification(title, {
        body,
        icon: options.icon ?? "/favicon.ico",
        badge: options.badge,
        tag: options.tag,
        requireInteraction: options.requireInteraction ?? false,
        silent: options.silent ?? false,
      });
      return true;
    } catch (error) {
      console.error("Failed to show notification:", error);
      return false;
    }
  }

  return false;
}

/**
 * Trigger haptic feedback on supported devices
 * 
 * Provides tactile feedback for user actions. Falls back gracefully
 * on devices that don't support haptics.
 * 
 * @param pattern - Vibration pattern (default: short vibration)
 */
export function triggerHapticFeedback(pattern: number | number[] = 100): void {
  if ("vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (error: unknown) {
      // Haptic feedback not available - fail silently
    }
  }
}

/**
 * Show success message to user
 * Uses browser notifications if available, falls back to console
 */
export function showSuccessMessage(message: string): void {
  // Try to show browser notification first
  showBrowserNotification('Success', message, {
    icon: '/favicon.ico',
    tag: 'success',
    silent: true,
  }).catch(() => {
    // Fallback to console if browser notifications fail
    console.info(`✅ ${message}`);
  });
}

/**
 * Show error message to user
 * Uses browser notifications if available, falls back to console
 */
export function showErrorMessage(message: string): void {
  // Try to show browser notification first
  showBrowserNotification('Error', message, {
    icon: '/favicon.ico',
    tag: 'error',
    requireInteraction: true,
  }).catch(() => {
    // Fallback to console if browser notifications fail
    console.error(`❌ ${message}`);
  });
}

/**
 * Show warning message to user
 * Uses browser notifications if available, falls back to console
 */
export function showWarningMessage(message: string): void {
  // Try to show browser notification first
  showBrowserNotification('Warning', message, {
    icon: '/favicon.ico',
    tag: 'warning',
  }).catch(() => {
    // Fallback to console if browser notifications fail
    console.warn(`⚠️ ${message}`);
  });
}

/**
 * Show info message to user
 * Always uses console for info messages
 */
export function showInfoMessage(message: string): void {
  console.info(`ℹ️ ${message}`);
}

/**
 * Check if browser notifications are supported and enabled
 * 
 * @returns Promise<boolean> - Whether notifications can be shown
 */
export async function checkNotificationSupport(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.info("Your browser does not support notifications");
    return false;
  }

  if (Notification.permission === "denied") {
    console.info("Notifications are blocked by your browser");
    return false;
  }

  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.info("Notifications are blocked by your browser");
      return false;
    }
  }

  return true;
} // CodeRabbit review
// CodeRabbit review
