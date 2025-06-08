
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
 * Truncates a URL to a specified length, removing protocol
 */
export function truncateUrl(url: string, maxLength = 30): string {
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
 * Formats bytes with alias to formatFileSize for backward compatibility
 */
export function formatBytes(bytes: number, decimals = 2): string {
  return formatFileSize(bytes, decimals);
}

/**
 * Formats a number as a percentage
 */
export function formatPercentage(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formats a price/currency value
 */
export function formatPrice(value: number, currency = '$'): string {
  return `${currency}${value.toFixed(2)}`;
}

/**
 * Formats a currency value (alias to formatPrice)
 */
export function formatCurrency(value: number, currency = '$'): string {
  return formatPrice(value, currency);
}

/**
 * Formats a number with thousand separators
 */
export function formatNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Parses a price string to number
 */
export function parsePrice(priceString: string): number {
  return parseFloat(priceString.replace(/[^0-9.-]+/g, ''));
}

/**
 * Parses a formatted number string to number
 */
export function parseNumber(numberString: string): number {
  return parseFloat(numberString.replace(/[^0-9.-]+/g, ''));
}
// CodeRabbit review
