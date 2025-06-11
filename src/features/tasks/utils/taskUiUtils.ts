import { getDaysRemaining } from '@/lib/utils/shared';
import { Task, TaskStatus } from '@/types';

export function getTaskStatus(task: Task): TaskStatus {
  if (task.status === 'complete') {
    return 'complete';
  }
  if (!task.due_date) {
    return 'pending';
  }
  const daysRemaining = getDaysRemaining(task.due_date);
  if (daysRemaining !== null && daysRemaining < 0) {
    return 'overdue';
  }
  return 'pending';
}

// Note: getStatusColor, getTimerColor, getTimerGradient exports removed as unused

export function getStatusTooltipClass(status: TaskStatus): string {
  if (status === 'overdue') return 'bg-destructive text-destructive-foreground';
  if (status === 'complete') return 'bg-success text-success-foreground';
  return 'bg-popover text-popover-foreground border border-border';
}

export function getTooltipArrowClass(status: TaskStatus): string {
  if (status === 'overdue') return 'fill-destructive';
  if (status === 'complete') return 'fill-success';
  return 'fill-popover';
}
