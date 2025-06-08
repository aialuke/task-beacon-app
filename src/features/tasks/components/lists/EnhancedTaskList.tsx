
// === EXTERNAL LIBRARIES ===
import { memo, useMemo, useCallback, useRef, useState, useEffect } from 'react';

// === INTERNAL UTILITIES ===
import UnifiedLoadingStates from '@/components/ui/loading/UnifiedLoadingStates';

// === COMPONENTS ===
import { VirtualizedTaskCard } from '../cards';

// === HOOKS ===
import { useTaskDataContext } from '@/features/tasks/context/TaskDataContext';
import { useTaskUIContext } from '@/features/tasks/context/TaskUIContext';
import { useTasksFilter } from '@/features/tasks/hooks/useTasksFilter';

// === TYPES ===
import type { Task } from '@/types';

interface EnhancedTaskListProps {
  enableVirtualization?: boolean;
  itemHeight?: number;
  overscan?: number;
}

// Simple virtualization logic (replacing the deleted hook)
const useSimpleVirtualization = (
  items: Task[],
  config: { enabled: boolean; itemHeight: number; overscan: number; containerHeight: number }
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    if (!config.enabled) return [];
    
    const startIndex = Math.floor(scrollTop / config.itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(config.containerHeight / config.itemHeight) + config.overscan,
      items.length
    );

    return items.slice(Math.max(0, startIndex - config.overscan), endIndex).map((task, index) => ({
      index: startIndex + index,
      top: (startIndex + index) * config.itemHeight,
      height: config.itemHeight,
      task
    }));
  }, [items, scrollTop, config]);

  const handleScroll = useCallback((e: React.UIEvent) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return { containerRef, visibleItems, handleScroll };
};

function EnhancedTaskListComponent({
  enableVirtualization = true,
  itemHeight = 120,
  overscan = 5,
}: EnhancedTaskListProps) {
  const { tasks, isLoading, error } = useTaskDataContext();
  const { filter, isMobile } = useTaskUIContext();
  
  // Filter tasks based on current filter
  const filteredTasks = useTasksFilter(tasks, filter);
  
  // Virtualization configuration
  const virtualizationConfig = useMemo(() => ({
    enabled: enableVirtualization && filteredTasks.length > 50,
    itemHeight,
    overscan,
    containerHeight: 600,
  }), [enableVirtualization, filteredTasks.length, itemHeight, overscan]);
  
  const { containerRef, visibleItems, handleScroll } = useSimpleVirtualization(
    filteredTasks,
    virtualizationConfig
  );

  // Render item callback for virtualization
  const renderTaskItem = useCallback((task: Task, index: number, style?: React.CSSProperties) => (
    <div key={task.id} style={style}>
      <VirtualizedTaskCard
        task={task}
        index={index}
      />
    </div>
  ), []);

  if (isLoading) {
    return <UnifiedLoadingStates variant="skeleton" message="Loading enhanced task list..." />;
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load tasks</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No tasks found</p>
      </div>
    );
  }

  // Render virtualized list if enabled and beneficial
  if (virtualizationConfig.enabled) {
    return (
      <div
        ref={containerRef}
        className={`h-full overflow-auto ${isMobile ? 'pb-20' : ''}`}
        style={{ height: virtualizationConfig.containerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ position: 'relative', height: filteredTasks.length * itemHeight }}>
          {visibleItems.map((item) => {
            const task = filteredTasks[item.index];
            return renderTaskItem(task, item.index, {
              position: 'absolute',
              top: item.top,
              left: 0,
              right: 0,
              height: item.height,
            });
          })}
        </div>
      </div>
    );
  }

  // Render standard list for smaller datasets
  return (
    <div className={`h-full overflow-y-auto space-y-2 p-4 ${isMobile ? 'pb-20' : ''}`}>
      {filteredTasks.map((task, index) => renderTaskItem(task, index))}
    </div>
  );
}

export default memo(EnhancedTaskListComponent);
