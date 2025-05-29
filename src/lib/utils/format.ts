/**
 * Text and data formatting utilities
 */

/**
 * Truncates text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Truncates a URL to a specified length, removing protocol
 */
export function truncateUrl(url: string, maxLength: number = 30): string {
  // Remove protocol and www
  let cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '');

  // Truncate if still too long
  if (cleanUrl.length > maxLength) {
    cleanUrl = cleanUrl.substring(0, maxLength - 3) + '...';
  }

  return cleanUrl;
}

/**
 * Formats a file size in bytes to a human-readable string
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
  );
}

/**
 * Formats a number as a percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
