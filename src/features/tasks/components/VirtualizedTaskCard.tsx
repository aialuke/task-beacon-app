
import { memo, forwardRef } from 'react';
import { Task } from '@/types';
import { useTaskCard } from '../hooks/useTaskCard';
import { useTaskCardOptimization } from '../hooks/useTaskCardOptimization';
import { getTaskCardStyles, getTaskCardClasses } from '../utils/taskCardStyles';
import { TaskErrorBoundary } from './TaskErrorBoundary';
import TaskCardHeader from './TaskCardHeader';
import TaskCardContent from './TaskCardContent';

interface VirtualizedTaskCardProps {
  task: Task;
  style?: React.CSSProperties;
  index: number;
}

/**
 * Virtualized Task Card Component - Phase 4 Implementation
 * 
 * Optimized version of TaskCard for virtual scrolling:
 * - Enhanced performance for large lists
 * - Better accessibility support
 * - Memory-efficient rendering
 * - Image prefetching capabilities
 */
const VirtualizedTaskCard = memo(forwardRef<HTMLDivElement, VirtualizedTaskCardProps>(
  ({ task, style, index }, ref) => {
    const {
      contentRef,
      cardRef,
      isExpanded,
      animationState,
      toggleExpand,
    } = useTaskCard(task);

    const {
      taskMetadata,
      accessibilityProps,
      optimizedHandlers,
      keyboardHandlers,
    } = useTaskCardOptimization(task, {
      enableVirtualization: true,
      prefetchImages: true,
      enableAccessibility: true,
    });

    const cardStyles = getTaskCardStyles(task, isExpanded);
    const cardClasses = getTaskCardClasses(task, isExpanded);

    // Combine styles for virtualization
    const combinedStyles = {
      ...cardStyles,
      ...style,
      position: 'absolute' as const,
      width: '100%',
      transform: style?.transform || 'none',
    };

    // Combine all props safely for the article element
    const combinedProps = {
      ...optimizedHandlers,
      ...keyboardHandlers,
      ...accessibilityProps,
      'data-index': index,
      'data-task-id': task.id,
    };

    return (
      <TaskErrorBoundary
        fallback={
          <div 
            style={style}
            className="p-4 rounded-xl border border-destructive/20 bg-destructive/5"
          >
            <p className="text-sm text-destructive">Failed to load task: {task.title}</p>
          </div>
        }
      >
        <article 
          ref={ref || cardRef}
          className={cardClasses} 
          style={combinedStyles}
          {...combinedProps}
        >
          <TaskCardHeader
            task={task}
            isExpanded={isExpanded}
            toggleExpand={toggleExpand}
          />

          <TaskCardContent
            task={task}
            isExpanded={isExpanded}
            animationState={animationState}
            contentRef={contentRef}
          />
        </article>
      </TaskErrorBoundary>
    );
  }
));

VirtualizedTaskCard.displayName = 'VirtualizedTaskCard';

// Enhanced equality check for virtualized rendering
const arePropsEqual = (
  prevProps: VirtualizedTaskCardProps, 
  nextProps: VirtualizedTaskCardProps
): boolean => {
  const prev = prevProps.task;
  const next = nextProps.task;
  const styleChanged = JSON.stringify(prevProps.style) !== JSON.stringify(nextProps.style);
  const indexChanged = prevProps.index !== nextProps.index;

  return !styleChanged && 
         !indexChanged &&
         prev.id === next.id &&
         prev.title === next.title &&
         prev.description === next.description &&
         prev.due_date === next.due_date &&
         prev.url_link === next.url_link &&
         prev.status === next.status &&
         prev.photo_url === next.photo_url &&
         prev.updated_at === next.updated_at;
};

export default memo(VirtualizedTaskCard, arePropsEqual);
