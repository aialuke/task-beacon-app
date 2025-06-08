
/**
 * Shared Utility Functions - Cleaned Up
 * 
 * Only essential shared utilities remain. Legacy compatibility layers removed.
 */

// === INTERNAL UTILITIES ===
export {
  formatDate,
  getDaysRemaining,
  getTimeUntilDue,
  isDatePast,
  getDueDateTooltip,
} from './date';

export {
  formatFileSize,
  truncateText,
  formatPercentage,
  formatPrice,
  formatNumber,
} from './format';

// === URL UTILITIES ===
export const truncateUrl = (url: string, maxLength = 30): string => {
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
};
