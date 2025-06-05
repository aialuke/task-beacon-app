
import type { Task } from '@/types';

/**
 * Get base styles for task cards based on task state
 */
export function getTaskCardStyles(task: Task, isExpanded: boolean): React.CSSProperties {
  const baseStyles: React.CSSProperties = {
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
  };

  // Status-based styling - only dynamic colors in inline styles
  if (task.status === 'complete') {
    baseStyles.opacity = 0.8;
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
export function getTaskCardClasses(task: Task, isExpanded: boolean): string {
  const baseClasses = [
    'task-card-interactive', // Use the optimized class that includes width constraints
    'mb-4',
    'p-4',
    'transition-all',
    'duration-200',
    'hover:shadow-md',
    'bg-card',
    'text-card-foreground',
    'border',
    'border-border',
    'rounded-lg', // Use default radius instead of xl
  ];

  // Status-based classes
  if (task.status === 'complete') {
    baseClasses.push('bg-muted');
  } else if (task.status === 'overdue') {
    baseClasses.push('border-destructive', 'border-2');
  }

  if (isExpanded) {
    baseClasses.push('expanded', 'z-10');
  }

  return baseClasses.join(' ');
}
