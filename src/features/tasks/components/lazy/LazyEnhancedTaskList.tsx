
import { withLazyLoading } from '@/components/ui/LazyComponent';
import UnifiedLoadingStates from '@/components/ui/loading/UnifiedLoadingStates';

// Lazy load the EnhancedTaskList component for heavy virtualization
export const LazyEnhancedTaskList = withLazyLoading(
  () => import('../lists/EnhancedTaskList').then(module => ({ default: module.default })),
  {
    fallback: <UnifiedLoadingStates variant="skeleton" message="Loading enhanced task list..." />
  }
);
