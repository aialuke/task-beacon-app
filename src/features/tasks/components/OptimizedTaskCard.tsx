import React, { memo, useMemo, useCallback } from 'react';
import { optimizedMemo, useSmartMemo, trackComponentPerformance } from '@/lib/utils/componentOptimization';
import { useOptimizedCallback, useRenderTracking } from '@/hooks/useOptimizedMemo';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Pin, MoreHorizontal } from 'lucide-react';
import type { Task } from '@/types';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { formatDistanceToNow } from 'date-fns';

interface OptimizedTaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  onPin?: (task: Task) => void;
  onComplete?: (task: Task) => void;
  showMetadata?: boolean;
  compact?: boolean;
}

/**
 * Highly optimized TaskCard component with performance tracking and memoization
 */
const OptimizedTaskCard = memo<OptimizedTaskCardProps>(({
  task,
  onClick,
  onPin,
  onComplete,
  showMetadata = true,
  compact = false
}) => {
  // Track render performance
  const { renderCount, markRenderComplete } = useRenderTracking('OptimizedTaskCard', {
    taskId: task.id,
    status: task.status,
    pinned: task.pinned
  });

  // Use task mutations with optimization
  const { toggleTaskComplete, toggleTaskPin } = useTaskMutations();

  // Memoize expensive computations
  const formattedDate = useSmartMemo(
    () => task.created_at ? formatDistanceToNow(new Date(task.created_at), { addSuffix: true }) : '',
    [task.created_at],
    { name: 'formatted-date', ttl: 60000 } // Cache for 1 minute
  );

  const statusConfig = useSmartMemo(
    () => ({
      complete: { variant: 'default' as const, label: 'Complete', color: 'text-green-600' },
      pending: { variant: 'secondary' as const, label: 'Pending', color: 'text-yellow-600' },
      overdue: { variant: 'destructive' as const, label: 'Overdue', color: 'text-red-600' }
    }[task.status] || { variant: 'outline' as const, label: 'Unknown', color: 'text-gray-600' }),
    [task.status],
    { name: 'status-config' }
  );

  const priorityConfig = useSmartMemo(
    () => ({
      high: { color: 'border-red-200', bg: 'bg-red-50' },
      medium: { color: 'border-yellow-200', bg: 'bg-yellow-50' },
      low: { color: 'border-green-200', bg: 'bg-green-50' }
    }[task.priority] || { color: 'border-gray-200', bg: 'bg-gray-50' }),
    [task.priority],
    { name: 'priority-config' }
  );

  // Optimized event handlers
  const handleClick = useOptimizedCallback(() => {
    onClick?.(task);
  }, [onClick, task.id], { name: 'task-card-click' });

  const handlePin = useOptimizedCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleTaskPin(task);
      onPin?.(task);
    } catch (error) {
      console.error('Failed to pin task:', error);
    }
  }, [toggleTaskPin, task.id, task.pinned, onPin], { name: 'task-pin' });

  const handleComplete = useOptimizedCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleTaskComplete(task);
      onComplete?.(task);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  }, [toggleTaskComplete, task.id, task.status, onComplete], { name: 'task-complete' });

  // Memoize render content
  const cardContent = useMemo(() => (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium truncate ${
            task.status === 'complete' ? 'line-through text-muted-foreground' : 'text-foreground'
          }`}>
            {task.title}
          </h3>
          {task.description && !compact && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        
        {task.pinned && (
          <Pin className="w-4 h-4 text-primary flex-shrink-0 ml-2" fill="currentColor" />
        )}
      </div>

      {/* Metadata */}
      {showMetadata && (
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center space-x-3">
            {formattedDate && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formattedDate}
              </div>
            )}
            {task.priority && (
              <Badge variant="outline" className="text-xs">
                {task.priority}
              </Badge>
            )}
          </div>
          <Badge variant={statusConfig.variant}>
            {statusConfig.label}
          </Badge>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex space-x-2">
          <Button
            variant={task.status === 'complete' ? 'outline' : 'default'}
            size="sm"
            onClick={handleComplete}
            className="button-optimized"
          >
            {task.status === 'complete' ? 'Undo' : 'Complete'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePin}
            className="button-optimized"
          >
            {task.pinned ? 'Unpin' : 'Pin'}
          </Button>
        </div>
        
        <Button variant="ghost" size="sm" className="button-optimized">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </>
  ), [
    task.title,
    task.description,
    task.status,
    task.pinned,
    task.priority,
    formattedDate,
    statusConfig,
    compact,
    showMetadata,
    handleComplete,
    handlePin
  ]);

  // Mark render completion
  React.useEffect(() => {
    markRenderComplete();
  });

  return (
    <Card 
      className={`
        task-card-optimized
        interactive-element
        cursor-pointer
        transition-all
        duration-150
        ${priorityConfig.bg}
        ${priorityConfig.color}
        ${compact ? 'p-4' : 'p-6'}
        hover:shadow-md
        focus-ring
      `}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={`Task: ${task.title}`}
    >
      {cardContent}
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for optimal re-rendering
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.status === nextProps.task.status &&
    prevProps.task.pinned === nextProps.task.pinned &&
    prevProps.task.priority === nextProps.task.priority &&
    prevProps.task.updated_at === nextProps.task.updated_at &&
    prevProps.showMetadata === nextProps.showMetadata &&
    prevProps.compact === nextProps.compact
  );
});

OptimizedTaskCard.displayName = 'OptimizedTaskCard';

// Apply performance tracking HOC
export default trackComponentPerformance(OptimizedTaskCard); 