
import { withLazyLoading } from '@/components/ui/LazyComponent';
import UnifiedLoadingStates from '@/components/ui/loading/UnifiedLoadingStates';

// Lazy load photo upload components to reduce initial bundle
export const LazySimplePhotoUpload = withLazyLoading(
  () => import('../SimplePhotoUpload').then(module => ({ default: module.default })),
  {
    fallback: <div className="p-4 border-2 border-dashed border-border rounded-lg bg-muted/20">
      <UnifiedLoadingStates variant="spinner" message="Loading photo upload..." />
    </div>
  }
);

export const LazySimplePhotoUploadModal = withLazyLoading(
  () => import('../SimplePhotoUploadModal').then(module => ({ default: module.default })),
  {
    fallback: <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <UnifiedLoadingStates variant="spinner" message="Loading photo upload modal..." />
      </div>
    </div>
  }
);
