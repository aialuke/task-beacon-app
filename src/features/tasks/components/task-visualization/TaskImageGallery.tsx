import { memo } from 'react';

// === INTERNAL UTILITIES ===
import { cn } from '@/lib/utils';
import type { TaskImageGalleryProps } from '@/types';

// === INTERNAL COMPONENTS ===
import { useImagePreview } from '../../hooks/useImagePreview';
import { ImagePreviewModal } from '../task-interaction/ImagePreviewModal';

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
const TaskImageGallery = memo(function TaskImageGallery({
  task,
  className,
}: TaskImageGalleryProps) {
  const { isPreviewOpen, previewImageUrl, openPreview, closePreview } =
    useImagePreview();

  // Early return if no photo
  if (!task.photo_url) {
    return null;
  }

  const handleImageClick = () => {
    if (task.photo_url) {
      openPreview(task.photo_url);
    }
  };

  return (
    <>
      <div className={cn('task-image-gallery', className)}>
        <button
          onClick={handleImageClick}
          className="block w-full overflow-hidden rounded-lg transition-opacity duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus-visible:opacity-90 active:opacity-90"
          aria-label="View task image"
        >
          <img
            src={task.photo_url}
            alt="Task attachment"
            className="h-48 w-full object-cover"
            loading="lazy"
          />
        </button>
      </div>

      <ImagePreviewModal
        isOpen={isPreviewOpen}
        imageUrl={previewImageUrl ?? ''}
        onClose={closePreview}
        alt={`Image for task: ${task.title}`}
      />
    </>
  );
});

TaskImageGallery.displayName = 'TaskImageGallery';
export { TaskImageGallery };
