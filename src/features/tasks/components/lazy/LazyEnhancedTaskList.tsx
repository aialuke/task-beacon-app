
import { LazyComponents } from '@/components/ui/LazyComponent';

// Lazy load the EnhancedTaskList component with optimized virtualization loading
export const LazyEnhancedTaskList = LazyComponents.createLazyList(
  () => import('../lists/EnhancedTaskList').then(module => ({ default: module.default })),
  'EnhancedTaskList'
);
