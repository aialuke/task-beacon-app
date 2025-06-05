
import type { Task } from '@/types';

/**
 * Get base styles for task cards based on task state
 */
export function getTaskCardStyles(task: Task, isExpanded: boolean): React.CSSProperties {
  const baseStyles: React.CSSProperties = {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '16px',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
  };

  // Status-based styling
  if (task.status === 'complete') {
    baseStyles.opacity = 0.8;
    baseStyles.background = 'var(--muted)';
  } else if (task.status === 'overdue') {
    baseStyles.borderColor = 'var(--destructive)';
    baseStyles.borderWidth = '2px';
  }

  // Expanded state styling
  if (isExpanded) {
    baseStyles.transform = 'scale(1.02)';
    baseStyles.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
  }

  return baseStyles;
}

/**
 * Get CSS classes for task cards based on expansion state
 */
export function getTaskCardClasses(isExpanded: boolean): string {
  const baseClasses = [
    'task-card',
    'mb-4',
    'transition-all',
    'duration-200',
    'hover:shadow-md',
  ];

  if (isExpanded) {
    baseClasses.push('expanded', 'z-10');
  }

  return baseClasses.join(' ');
}
