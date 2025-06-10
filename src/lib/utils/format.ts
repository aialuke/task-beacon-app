/**
 * Text and data formatting utilities
 */

/**
 * Truncates text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalizeFirst(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Converts a string to title case
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => capitalizeFirst(word))
    .join(' ');
}

/**
 * Formats a file size in bytes to a human-readable string
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
  );
}

/**
 * Formats a percentage value with optional decimal places
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats a price value with currency symbol
 */
export function formatPrice(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formats a number with thousands separators
 */
export function formatNumber(
  value: number,
  locale = 'en-US',
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Parses a formatted number string to number
 */
export function parseNumber(numberString: string): number {
  return parseFloat(numberString.replace(/[^0-9.-]+/g, ''));
}

/**
 * Truncates a URL to a more readable format
 */
export function truncateUrl(url: string, maxLength = 30): string {
  if (!url || typeof url !== 'string') return '';
  
  if (url.length <= maxLength) return url;
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    if (domain.length <= maxLength) return domain;
    
    return domain.length > maxLength 
      ? `${domain.substring(0, maxLength - 3)}...`
      : domain;
  } catch {
    return url.length > maxLength 
      ? `${url.substring(0, maxLength - 3)}...`
      : url;
  }
}
