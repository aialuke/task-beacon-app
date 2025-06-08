
import { withLazyLoading } from '@/components/ui/LazyComponent';

// Lazy load the FollowUpTaskForm component
export const LazyFollowUpTaskForm = withLazyLoading(
  () => import('../../forms/FollowUpTaskForm').then(module => ({ default: module.default })),
  {
    fallback: <div className="p-6 rounded-xl border border-border bg-card animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-muted rounded w-1/3"></div>
        <div className="h-8 bg-muted rounded w-2/3"></div>
        <div className="h-10 bg-muted rounded"></div>
        <div className="h-20 bg-muted rounded"></div>
        <div className="h-10 bg-muted rounded w-1/3"></div>
      </div>
    </div>
  }
);
