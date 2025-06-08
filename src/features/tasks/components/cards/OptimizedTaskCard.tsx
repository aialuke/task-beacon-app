
/**
 * Optimized Task Card - Phase 2.4.3 Simplified
 * 
 * Simplified task card component using standard React patterns
 */

import { memo, useMemo, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import type { Task } from '@/types';

interface OptimizedTaskCardProps {
  task: Task;
  onStatusToggle?: (taskId: string, newStatus: 'pending' | 'complete') => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  isSelected?: boolean;
  showActions?: boolean;
}

function OptimizedTaskCardComponent({
  task,
  onStatusToggle,
  onEdit,
  onDelete,
  isSelected = false,
  showActions = true,
}: OptimizedTaskCardProps) {
  // Standard React memoization for computed values
  const statusBadgeVariant = useMemo(() => {
    switch (task.status) {
      case 'complete':
        return 'default';
      case 'overdue':
        return 'destructive';
      default:
        return 'secondary';
    }
  }, [task.status]);

  const formattedDate = useMemo(() => {
    if (!task.due_date) return null;
    return formatDistanceToNow(new Date(task.due_date), { addSuffix: true });
  }, [task.due_date]);

  const isOverdue = useMemo(() => {
    if (!task.due_date) return false;
    return new Date(task.due_date) < new Date() && task.status !== 'complete';
  }, [task.due_date, task.status]);

  // Standard React callbacks for event handlers
  const handleStatusToggle = useCallback(() => {
    if (onStatusToggle) {
      const newStatus = task.status === 'complete' ? 'pending' : 'complete';
      onStatusToggle(task.id, newStatus);
    }
  }, [task.id, task.status, onStatusToggle]);

  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit(task);
    }
  }, [task, onEdit]);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(task.id);
    }
  }, [task.id, onDelete]);

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-lg leading-tight ${task.status === 'complete' ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-3">
            <Badge variant={statusBadgeVariant} className="shrink-0">
              {task.status}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive" className="shrink-0">
                Overdue
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Due Date */}
          {formattedDate && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Due:</span> {formattedDate}
            </div>
          )}

          {/* Photo Preview */}
          {task.photo_url && (
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
              <img
                src={task.photo_url}
                alt="Task attachment"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* URL Link */}
          {task.url_link && (
            <div className="text-sm">
              <a
                href={task.url_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate block"
              >
                {task.url_link}
              </a>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex items-center justify-between pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleStatusToggle}
              >
                {task.status === 'complete' ? 'Mark Pending' : 'Mark Complete'}
              </Button>
              
              <div className="flex gap-2">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                )}
                
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="text-destructive hover:text-destructive"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Use standard React memo with shallow equality check
function shallowEqual<T extends Record<string, any>>(prevProps: T, nextProps: T): boolean {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);
  
  if (prevKeys.length !== nextKeys.length) {
    return false;
  }
  
  for (const key of prevKeys) {
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }
  
  return true;
}

export const OptimizedTaskCard = memo(
  OptimizedTaskCardComponent,
  shallowEqual
);
