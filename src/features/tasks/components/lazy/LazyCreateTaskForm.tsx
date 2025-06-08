
import { LazyComponents } from '@/components/ui/LazyComponent';

// Lazy load the CreateTaskForm component with optimized loading
export const LazyCreateTaskForm = LazyComponents.createLazyForm(
  () => import('../../forms/CreateTaskForm').then(module => ({ default: module.default })),
  'CreateTaskForm'
);
