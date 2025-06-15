
import { useMemo } from 'react';
import type { Task } from '@/types';

/**
 * Business Logic Hook for Task Cards - Phase 1 Architecture Fix
 * 
 * Extracts business logic from TaskCard UI component to improve
 * separation of concerns and testability.
 */
export function useTaskCardLogic(task: Task) {
  // Status-based styling logic
  const statusClass = useMemo(() => `status-${task.status.toLowerCase()}`, [task.status]);
  
  // Status-based inline styles
  const statusStyles = useMemo((): React.CSSProperties => ({
    opacity: task.status === 'complete' ? 0.8 : 1,
  }), [task.status]);

  // Border styling based on status
  const borderClass = useMemo(() => {
    if (task.status === 'complete') return 'bg-muted';
    if (task.status === 'overdue') return 'border-destructive';
    return '';
  }, [task.status]);

  // Expansion styling logic
  const getExpansionClass = useMemo(() => (isExpanded: boolean) => 
    isExpanded ? 'scale-102 shadow-expanded z-10' : '', []);

  // Accessibility label
  const ariaLabel = useMemo(() => `Task: ${task.title}`, [task.title]);

  return {
    statusClass,
    statusStyles,
    borderClass,
    getExpansionClass,
    ariaLabel,
  };
}
