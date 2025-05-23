
/**
 * Truncates a URL to a specified length
 * 
 * Removes protocol (http://, https://) and truncates the remaining URL
 * if it exceeds the maxLength. Adds ellipsis to indicate truncation.
 * 
 * @param url - URL string to truncate
 * @param maxLength - Maximum length of the truncated URL
 * @returns Truncated URL string
 */
export function truncateUrl(url: string, maxLength: number = 30): string {
  // Remove protocol
  let cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '');
  
  // Truncate if still too long
  if (cleanUrl.length > maxLength) {
    cleanUrl = cleanUrl.substring(0, maxLength - 3) + '...';
  }
  
  return cleanUrl;
}

/**
 * Formats a file size in bytes to a human-readable string
 * 
 * @param bytes - Size in bytes
 * @param decimals - Number of decimal places in the result
 * @returns Formatted file size string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * Truncates text to a specified length
 * 
 * @param text - Text to truncate 
 * @param maxLength - Maximum length of the truncated text
 * @returns Truncated text string
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Formats a number as a percentage
 * 
 * @param value - Number to format as percentage
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
