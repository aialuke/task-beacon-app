import { toast } from "sonner";

// Re-export toast
export { toast };

// Function to trigger haptic feedback if available
export const triggerHapticFeedback = () => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(200);
    } catch (error) {
      console.log("Haptic feedback not supported or permission denied");
    }
  }
};

// Function to handle browser notifications with proper checks
export const showBrowserNotification = async (
  title: string,
  body?: string
): Promise<boolean> => {
  if (typeof Notification !== "undefined" && "Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
      return true;
    } else if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification(title, { body });
        return true;
      }
      return false;
    } else {
      toast.info("Notifications are blocked by your browser");
      return false;
    }
  } else {
    toast.info("Your browser does not support notifications");
    return false;
  }
};
