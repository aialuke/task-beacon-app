import { useState } from 'react';
import TaskFormWithValidation from './TaskFormWithValidation';
import { CreateTaskInput } from '../schemas/taskSchema';
import { supabase, isMockingSupabase } from '@/integrations/supabase/client';
import {
  compressAndResizePhoto,
  supportsWebWorker,
  compressAndResizePhotoFallback,
} from '@/lib/imageUtils';
import { toast } from '@/lib/toast';

export default function TaskFormExample({ onClose }: { onClose?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (isMockingSupabase) {
          photoUrl = URL.createObjectURL(processedFile);
        } else {
          // Upload to Supabase storage
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from('task-photos')
              .upload(`photos/${Date.now()}-${data.photo.name}`, processedFile);

          if (uploadError) throw uploadError;
          photoUrl = uploadData.path;
        }
      }

      // Create task with photo URL
      const taskData = {
        ...data,
        photo_url: photoUrl,
      };

      toast.success('Task created successfully!');
      if (onClose) onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return <TaskFormWithValidation onSubmit={handleSubmit} onClose={onClose} />;
}
