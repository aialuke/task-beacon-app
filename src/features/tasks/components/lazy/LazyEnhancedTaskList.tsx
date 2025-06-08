
import { LazyComponents } from '@/components/ui/LazyComponent';

// Simplified lazy loading without optimized component dependencies
export const LazyEnhancedTaskList = LazyComponents.createLazyList(
  () => import('../lists/EnhancedTaskList').then(module => ({ default: module.default })),
  'EnhancedTaskList'
);
