
import { LazyComponents } from '@/components/ui/LazyComponent';

// Lazy load photo upload components using the proven LazyComponents pattern
export const LazySimplePhotoUpload = LazyComponents.createLazyForm(
  () => import('../SimplePhotoUpload'),
  'SimplePhotoUpload'
);

export const LazySimplePhotoUploadModal = LazyComponents.createLazyModal(
  () => import('../SimplePhotoUploadModal'),
  'SimplePhotoUploadModal'
);
