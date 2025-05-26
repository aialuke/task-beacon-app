
/**
 * Validation utility functions
 */

/**
 * Common validation functions
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  if (!url || url.length === 0) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /[0-9]/.test(password) &&
         /[^A-Za-z0-9]/.test(password);
};

export const isDateInFuture = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date > new Date();
};
