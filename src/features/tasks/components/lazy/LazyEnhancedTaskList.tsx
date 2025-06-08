
import { LazyComponents } from '@/components/ui/LazyComponent';

// Updated to use TaskList since EnhancedTaskList was removed during Phase 2 consolidation
export const LazyEnhancedTaskList = LazyComponents.createLazyList(
  () => import('../lists/TaskList').then(module => ({ default: module.default })),
  'TaskList'
);
