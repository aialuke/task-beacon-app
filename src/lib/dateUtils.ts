
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
    year: 'numeric' 
  }
): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
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
 * Creates a human-readable string describing the time until a due date
 * 
 * @param dueDate - ISO date string for the due date
 * @returns A string like "2 days left", "Due today", or "No due date"
 */
export function getTimeUntilDue(dueDate: string | null): string {
  if (!dueDate) return "No due date";
  
  const daysRemaining = getDaysRemaining(dueDate);
  
  if (daysRemaining === null) return "No due date";
  if (daysRemaining < 0) return `${Math.abs(daysRemaining)} days overdue`;
  if (daysRemaining === 0) return "Due today";
  if (daysRemaining === 1) return "Due tomorrow";
  return `${daysRemaining} days left`;
}

/**
 * Checks if a date is in the past
 * 
 * @param dateString - ISO date string to check
 * @returns True if the date is in the past, false otherwise
 */
export function isDatePast(dateString: string | null): boolean {
  if (!dateString) return false;
  
  const now = new Date();
  const date = new Date(dateString);
  return date < now;
}

/**
 * Creates a tooltip text for a task due date
 * 
 * @param dueDate - ISO date string for the due date
 * @returns Appropriate tooltip text based on due date
 */
export function getDueDateTooltip(dueDate: string | null): string {
  if (!dueDate) return "No due date set";
  
  const date = new Date(dueDate);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const timeUntil = getTimeUntilDue(dueDate);
  
  if (timeUntil === "Due today") {
    return `Due today (${formattedDate})`;
  } else if (timeUntil === "Due tomorrow") {
    return `Due tomorrow (${formattedDate})`;
  } else if (timeUntil.includes("overdue")) {
    return `${timeUntil} (${formattedDate})`;
  } else {
    return `${timeUntil} - ${formattedDate}`;
  }
}
