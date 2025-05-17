
import { toast } from "sonner";

// Function to trigger haptic feedback if available
export const triggerHapticFeedback = () => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(200);
    } catch (error) {
      console.log('Haptic feedback not supported or permission denied');
    }
  }
};

// Function to handle browser notifications with proper checks
export const showBrowserNotification = (title: string, body?: string) => {
  // Check if Notification API is supported by the browser
  if (typeof Notification !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
      return true;
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body });
          return true;
        }
        return false;
      });
    } else {
      toast.info('Notifications are blocked by your browser');
      return false;
    }
  } else {
    // Fallback for browsers without Notification API
    toast.info('Your browser does not support notifications');
    return false;
  }
  return false;
};
