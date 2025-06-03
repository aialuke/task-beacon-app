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
        icon: options.icon || "/favicon.ico",
        badge: options.badge,
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
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
    } catch (error) {
      // Silently fail - haptic feedback is nice-to-have
      console.debug("Haptic feedback not available:", error);
    }
  }
}

/**
 * Simple console-based notification system
 * These replace the previous toast notifications to avoid UI blocking issues
 */
export function showSuccessMessage(message: string): void {
  console.log(`✅ Success: ${message}`);
}

export function showErrorMessage(message: string): void {
  console.error(`❌ Error: ${message}`);
}

export function showWarningMessage(message: string): void {
  console.warn(`⚠️ Warning: ${message}`);
}

export function showInfoMessage(message: string): void {
  console.info(`ℹ️ Info: ${message}`);
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
} 