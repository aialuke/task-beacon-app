/**
 * Date utility functions
 */

/**
 * Formats a date string to a human-readable format
 *
 * @param dateString - ISO date string or Date object
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date,
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  },
): string {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Calculates the number of days remaining until a due date
 *
 * @param dueDate - ISO date string for the due date
 * @returns Number of days until the due date, or null if no due date
 */
export function getDaysRemaining(dueDate: string | null): number | null {
  if (!dueDate) return null;

  const now = new Date();
  now.setHours(0, 0, 0, 0); // Start of today

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0); // Start of due date

  const timeDiff = due.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Formats the time display for the timer component
 *
 * @param daysLeft - Number of days until the due date
 * @param dueDate - ISO date string for the due date
 * @param status - Current task status
 * @returns Formatted string for display in the timer component
 */
export function formatTimeDisplay(
  daysLeft: number | null,
  dueDate: string | null,
  status: string,
): string {
  if (!dueDate) return 'No due date';
  if (status === 'complete') return 'Done';
  if (status === 'overdue') return 'Due';

  // For pending tasks
  if (daysLeft === null) return 'No due date';
  if (daysLeft < 0) return 'Due';
  if (daysLeft === 0) return 'Today';
  if (daysLeft === 1) return '1 day';

  // Always show days remaining, regardless of how many days
  return `${daysLeft}d`;
}

/**
 * Determines the appropriate interval for updating the timer
 *
 * @param daysLeft - Number of days until the due date
 * @param status - Current task status
 * @returns Update interval in milliseconds
 */
export function getUpdateInterval(
  daysLeft: number | null,
  status: string,
): number {
  if (status === 'complete' || status === 'overdue' || daysLeft === null) {
    // No need for frequent updates for these states
    return 0;
  }

  if (daysLeft === 0) {
    // Due today - check every minute to see if it's overdue
    return 60 * 1000;
  }

  if (daysLeft <= 3) {
    // Due soon - check every hour
    return 60 * 60 * 1000;
  }

  // Far in the future - check once a day
  return 24 * 60 * 60 * 1000;
}
