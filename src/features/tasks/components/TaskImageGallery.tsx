
// === EXTERNAL LIBRARIES ===
import { memo } from 'react';

// === INTERNAL UTILITIES ===
import { cn } from '@/lib/utils';

// === INTERNAL COMPONENTS ===
import { LazyImage } from '@/components/ui/LazyImage';
import { ImagePreviewModal } from './ImagePreviewModal';

// === HOOKS ===
import { useImagePreview } from '../hooks/useImagePreview';

// === TYPES ===
import type { Task } from '@/types';

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

  // Early return if no photo
  if (!task.photo_url) {
    return null;
  }

  const handleImageClick = () => {
    openPreview(task.photo_url);
  };

  return (
    <>
      <div className={cn('task-image-gallery', className)}>
        <button
          onClick={handleImageClick}
          className="block w-full rounded-lg overflow-hidden hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="View task image"
        >
          <LazyImage
            src={task.photo_url}
            alt="Task image"
            className="w-full h-48 object-cover"
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
// CodeRabbit review
