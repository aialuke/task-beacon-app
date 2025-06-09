
import { useUnifiedPhotoUpload } from './useUnifiedPhotoUpload';
import type { EnhancedImageProcessingOptions } from '@/lib/utils/image/types';

/**
 * Task-specific photo upload hook - Phase 3 Simplified
 * 
 * Now just a wrapper around useUnifiedPhotoUpload for backward compatibility
 */
export function useTaskPhotoUpload(options?: {
  processingOptions?: EnhancedImageProcessingOptions;
}) {
  return useUnifiedPhotoUpload({
    processingOptions: options?.processingOptions,
    autoUpload: false,
  });
}
