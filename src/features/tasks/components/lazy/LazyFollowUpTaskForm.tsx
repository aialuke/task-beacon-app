
import { LazyComponents } from '@/components/ui/LazyComponent';

// Lazy load the FollowUpTaskForm component with optimized loading
export const LazyFollowUpTaskForm = LazyComponents.createLazyForm(
  () => import('../../forms/FollowUpTaskForm').then(module => ({ default: module.default })),
  'FollowUpTaskForm'
);
