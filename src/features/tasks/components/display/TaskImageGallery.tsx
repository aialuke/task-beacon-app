// === EXTERNAL LIBRARIES ===
import { memo as _memo, useCallback } from 'react';

// === INTERNAL UTILITIES ===
import { LazyImage } from '@/components/ui/LazyImage';
import { safeAsync } from '@/lib/core/ErrorHandler';
import { cn } from '@/lib/utils';
// === INTERNAL COMPONENTS ===
import type { Task } from '@/types';

import { useImagePreview } from '../../hooks/useImagePreview';
import { ImagePreviewModal } from '../ImagePreviewModal';

// === HOOKS ===

// === TYPES ===

interface TaskImageGalleryProps {
  task: Task;
  className?: string;
}

/**
 * TaskImageGallery Component
 * 
 * Displays task images in a gallery format with preview capabilities.
 * Provides lazy loading and click-to-preview functionality.
 * 
 * @component
 * @example
 * ```tsx
 * <TaskImageGallery task={task} />
 * ```
 * 
 * @param {Object} props - Component props
 * @param {Task} props.task - The task object containing image data
 * @param {string} [props.className] - Additional CSS classes
 * 
 * @since 1.4.0 - Extracted from TaskDetails during Phase 1 refactoring
 * @version 1.0.0
 */
function TaskImageGallery({ task, className }: TaskImageGalleryProps) {
  const { isPreviewOpen, previewImageUrl, openPreview, closePreview } = useImagePreview();

  // Define handleImageClick before any early returns to follow React Hook rules
  const handleImageClick = useCallback(() => {
    // Use safeAsync for safe image preview operations
    safeAsync(
      async () => {
        // Preload image before opening preview to ensure it loads properly
        if (task.photo_url) {
          const img = new Image();
          img.src = task.photo_url;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          openPreview(task.photo_url);
        }
      },
      {
        context: 'TaskImageGallery - Image Preview',
        showToast: true
      }
    );
  }, [task.photo_url, openPreview]);

  // Early return if no photo
  if (!task.photo_url) {
    return null;
  }

  return (
    <>
      <div className={cn('task-image-gallery', className)}>
        <button
          onClick={handleImageClick}
          className="focus:ring-primary block w-full overflow-hidden rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
          aria-label="View task image"
        >
          <LazyImage
            src={task.photo_url}
            alt="Task image"
            className="h-48 w-full object-cover"
          />
        </button>
      </div>

      <ImagePreviewModal
        isOpen={isPreviewOpen}
        imageUrl={previewImageUrl}
        onClose={closePreview}
        alt={`Image for task: ${task.title}`}
      />
    </>
  );
}

TaskImageGallery.displayName = 'TaskImageGallery';
export { TaskImageGallery };
