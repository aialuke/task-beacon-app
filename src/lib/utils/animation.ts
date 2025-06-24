/**
 * Animation utilities
 *
 * Provides animation helpers and motion preference detection.
 * Migrated from src/lib/animationUtils.ts - use this path going forward.
 */

import { TaskStatus } from '@/types';

/**
 * Calculate the offset for the timer ring based on days left and status
 */
export function calculateTimerOffset(
  circumference: number,
  daysLeft: number,
  status: TaskStatus,
  dueDate: string | null,
): number {
  if (status === 'complete') return 0;
  if (status === 'overdue') return 0;
  if (!dueDate) return circumference; // No due date, empty ring

  const totalDays = 14;
  const remainingPercentage = Math.min(Math.max(daysLeft / totalDays, 0), 1);
  return circumference * (1 - remainingPercentage);
}
