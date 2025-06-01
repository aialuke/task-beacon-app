
import { useState } from 'react';
import TaskFormWithValidation from './TaskFormWithValidation';
import { CreateTaskInput } from '../schemas/taskSchema';
import { uploadTaskPhoto } from '@/integrations/supabase/api/tasks.api';
import { useCreateTaskAPI } from '../hooks/useCreateTaskAPI';
import {
  compressAndResizePhoto,
  supportsWebWorker,
  compressAndResizePhotoFallback,
} from '@/lib/imageUtils';
import { toast } from '@/lib/toast';

export default function TaskFormExample({ onClose }: { onClose?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeCreateTask } = useCreateTaskAPI();

  const handleSubmit = async (
    data: CreateTaskInput & { photo: File | null }
  ) => {
    setIsSubmitting(true);

    try {
      let photoUrl = null;
      if (data.photo) {
        // Use Web Worker version if supported, otherwise fallback to main thread
        const processImage = supportsWebWorker()
          ? compressAndResizePhoto
          : compressAndResizePhotoFallback;
        const processedFile = await processImage(data.photo);

        // Upload via API layer instead of direct Supabase usage
        const { data: uploadedUrl, error: uploadError } = await uploadTaskPhoto(processedFile);

        if (uploadError) throw new Error(uploadError.message);
        photoUrl = uploadedUrl;
      }

      // Use API layer for task creation
      const result = await executeCreateTask({
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        url: data.url,
        pinned: data.pinned,
        assigneeId: data.assigneeId,
        photoUrl,
      });

      if (result.success) {
        if (onClose) onClose();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return <TaskFormWithValidation onSubmit={handleSubmit} onClose={onClose} isSubmitting={isSubmitting} />;
}
