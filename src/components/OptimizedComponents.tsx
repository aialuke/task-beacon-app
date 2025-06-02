import React, { memo, useMemo, Suspense, ComponentType, ReactNode, useCallback } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { DataErrorBoundary } from './error-boundaries/DataErrorBoundary';
import { useRenderTracking } from '@/hooks/useOptimizedMemo';
import { memoryOptimizer } from '@/lib/utils/performance';
import { Skeleton } from './ui/skeleton';

/**
 * High-performance component wrapper with automatic optimizations
 */
interface OptimizedComponentProps {
  children: ReactNode;
  name: string;
  enableTracking?: boolean;
  enableMemo?: boolean;
  fallback?: ReactNode;
  errorBoundary?: boolean;
}

/**
 * Wrapper component that applies performance optimizations automatically
 */
export const OptimizedComponent = memo<OptimizedComponentProps>(({
  children,
  name,
  enableTracking = true,
  enableMemo = true,
  fallback,
  errorBoundary = true,
}) => {
  // Always call hooks - track render performance if enabled
  const renderTracking = useRenderTracking(name);
  const { renderCount, markRenderComplete } = enableTracking 
    ? renderTracking
    : { renderCount: 0, markRenderComplete: () => {} };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      memoryOptimizer.cleanupComponent(name);
    };
  }, [name]);

  // Mark render complete
  React.useEffect(() => {
    markRenderComplete();
  });

  // Always call useMemo but use different logic
  const optimizedChildren = useMemo(() => {
    return enableMemo ? children : children;
  }, [children, enableMemo]);

  const content = (
    <Suspense fallback={fallback || <OptimizedSkeleton />}>
      {optimizedChildren}
    </Suspense>
  );

  if (errorBoundary) {
    return (
      <DataErrorBoundary dataType={name}>
        {content}
      </DataErrorBoundary>
    );
  }

  return content;
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.name === nextProps.name &&
    prevProps.enableTracking === nextProps.enableTracking &&
    prevProps.enableMemo === nextProps.enableMemo &&
    prevProps.errorBoundary === nextProps.errorBoundary &&
    prevProps.children === nextProps.children
  );
});

OptimizedComponent.displayName = 'OptimizedComponent';

/**
 * Optimized skeleton component for loading states
 */
const OptimizedSkeleton = memo(() => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-20 w-full" />
  </div>
));

OptimizedSkeleton.displayName = 'OptimizedSkeleton';

/**
 * Optimized list component for rendering large datasets
 */
interface OptimizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  chunkSize?: number;
  loadMoreThreshold?: number;
  onLoadMore?: () => void;
  loading?: boolean;
  error?: string | null;
  emptyState?: ReactNode;
  className?: string;
}

export function OptimizedList<T>({
  items,
  renderItem,
  keyExtractor,
  chunkSize = 50,
  loadMoreThreshold = 10,
  onLoadMore,
  loading = false,
  error = null,
  emptyState,
  className = '',
}: OptimizedListProps<T>) {
  const [visibleItems, setVisibleItems] = React.useState(Math.min(chunkSize, items.length));

  // Load more items when scrolling near the end
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          if (visibleItems < items.length) {
            setVisibleItems(prev => Math.min(prev + chunkSize, items.length));
          } else if (onLoadMore) {
            onLoadMore();
          }
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [visibleItems, items.length, loading, onLoadMore, chunkSize]);

  const memoizedItems = useMemo(
    () => items.slice(0, visibleItems),
    [items, visibleItems]
  );

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading items: {error}
      </div>
    );
  }

  if (items.length === 0 && !loading) {
    return emptyState || (
      <div className="text-center py-8 text-gray-500">
        No items to display
      </div>
    );
  }

  return (
    <div className={className}>
      {memoizedItems.map((item, index) => (
        <OptimizedListItem
          key={keyExtractor(item, index)}
          item={item}
          index={index}
          renderItem={renderItem}
        />
      ))}
      
      {/* Load more trigger */}
      {(visibleItems < items.length || loading) && (
        <div
          ref={loadMoreRef}
          className="flex justify-center py-4"
        >
          {loading ? (
            <OptimizedSkeleton />
          ) : (
            <div className="h-4" />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Optimized list item component with memo
 */
interface OptimizedListItemProps<T> {
  item: T;
  index: number;
  renderItem: (item: T, index: number) => ReactNode;
}

const OptimizedListItem = memo(<T,>({
  item,
  index,
  renderItem,
}: OptimizedListItemProps<T>) => (
  <>{renderItem(item, index)}</>
), (prevProps, nextProps) => {
  // Only re-render if the item actually changed
  return prevProps.item === nextProps.item && prevProps.index === nextProps.index;
}) as <T>(props: OptimizedListItemProps<T>) => JSX.Element;

/**
 * Optimized data fetching component
 */
interface OptimizedDataFetcherProps<T> {
  fetchData: () => Promise<T>;
  children: (data: T) => ReactNode;
  loadingFallback?: ReactNode;
  errorFallback?: (error: Error) => ReactNode;
  cacheKey?: string;
  refetchInterval?: number;
}

export function OptimizedDataFetcher<T>({
  fetchData,
  children,
  loadingFallback,
  errorFallback,
  cacheKey,
  refetchInterval,
}: OptimizedDataFetcherProps<T>) {
  const [state, setState] = React.useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchDataCallback = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await fetchData();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [fetchData]);

  React.useEffect(() => {
    fetchDataCallback();
  }, [fetchDataCallback]);

  // Set up refetch interval if specified
  React.useEffect(() => {
    if (refetchInterval && refetchInterval > 0) {
      const interval = setInterval(fetchDataCallback, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetchDataCallback, refetchInterval]);

  if (state.loading && !state.data) {
    return <>{loadingFallback || <OptimizedSkeleton />}</>;
  }

  if (state.error) {
    return <>{errorFallback ? errorFallback(state.error) : `Error: ${state.error.message}`}</>;
  }

  if (!state.data) {
    return <>No data available</>;
  }

  return <>{children(state.data)}</>;
} 