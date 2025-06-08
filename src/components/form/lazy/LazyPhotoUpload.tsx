
import { LazyComponents } from '@/components/ui/LazyComponent';
import { preloadComponent } from '@/lib/utils/lazy-loading';

// Lazy load photo upload components with optimized loading and preloading
export const LazySimplePhotoUpload = LazyComponents.createLazyForm(
  () => import('../SimplePhotoUpload').then(module => ({ default: module.SimplePhotoUpload })),
  'SimplePhotoUpload'
);

export const LazySimplePhotoUploadModal = LazyComponents.createLazyModal(
  () => import('../SimplePhotoUploadModal').then(module => ({ default: module.SimplePhotoUploadModal })),
  'SimplePhotoUploadModal'
);

// Preload photo upload components when user hovers over trigger elements
export const preloadPhotoUploadComponents = () => {
  preloadComponent(() => import('../SimplePhotoUpload'));
  preloadComponent(() => import('../SimplePhotoUploadModal'));
};

// Export preload function for use in parent components
export { preloadPhotoUploadComponents as preloadPhotoComponents };
