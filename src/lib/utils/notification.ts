/**
 * Notification utilities
 * 
 * Provides notification, haptic feedback, and toast functionality.
 * Migrated from src/lib/notification.ts - use this path going forward.
 */

import { toast } from "sonner";
import { logger } from '../logger';

// Re-export toast
export { toast };

/**
 * Function to trigger haptic feedback if available
 */
export function triggerHapticFeedback() {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(50); // Short vibration
      logger.debug('Haptic feedback triggered');
    } catch (error) {
      logger.warn('Haptic feedback not supported or permission denied', { error: (error as Error).message });
    }
  } else {
    logger.debug('Haptic feedback not supported on this device');
  }
}

/**
 * Function to handle browser notifications with proper checks
 */
export function requestNotificationPermission() {
  if ('Notification' in window) {
    logger.debug('Requesting notification permission');
    return Notification.requestPermission().then((permission) => {
      logger.info('Notification permission result', { permission });
      return permission;
    });
  } else {
    logger.warn('Notifications not supported on this device');
    return Promise.resolve('denied' as NotificationPermission);
  }
}

/**
 * Show browser notification
 */
export function showNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === 'granted') {
    logger.debug('Showing notification', { title, options: !!options });
    return new Notification(title, options);
  } else {
    logger.warn('Cannot show notification - permission not granted', { 
      permission: Notification.permission,
      title 
    });
    return null;
  }
}

/**
 * Show browser notification (alias for showNotification with simplified interface)
 */
export function showBrowserNotification(title: string, body?: string, options?: NotificationOptions) {
  const notificationOptions: NotificationOptions = {
    body,
    ...options,
  };
  
  return showNotification(title, notificationOptions);
}

/**
 * Show toast notification with haptic feedback
 */
export function showToastWithHaptic(
  message: string, 
  options?: { 
    type?: 'success' | 'error' | 'warning' | 'info';
    haptic?: boolean;
  }
) {
  const { type = 'info', haptic = true } = options || {};
  
  // Show toast based on type
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    case 'warning':
      toast.warning(message);
      break;
    case 'info':
    default:
      toast.info(message);
      break;
  }
  
  // Trigger haptic feedback if enabled
  if (haptic) {
    triggerHapticFeedback();
  }
  
  logger.debug('Toast shown with haptic feedback', { message, type, haptic });
}

/**
 * Check if notifications are supported and enabled
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Check if notification permission is granted
 */
export function isNotificationPermissionGranted(): boolean {
  return isNotificationSupported() && Notification.permission === 'granted';
}

/**
 * Check if haptic feedback is supported
 */
export function isHapticFeedbackSupported(): boolean {
  return 'vibrate' in navigator;
}

// Legacy export for backward compatibility
export const notificationUtils = {
  toast,
  triggerHapticFeedback,
  requestNotificationPermission,
  showNotification,
  showBrowserNotification,
  showToastWithHaptic,
  isNotificationSupported,
  isNotificationPermissionGranted,
  isHapticFeedbackSupported,
}; 