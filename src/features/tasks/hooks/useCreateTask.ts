import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";
import { useTaskForm } from "./useTaskForm";
import { useTaskFormValidation } from "./useTaskFormValidation";
import { createTask, uploadTaskPhoto } from "@/integrations/supabase/api/tasks.api";
import { getCurrentUserId } from "@/integrations/supabase/api/base.api";

interface UseCreateTaskProps {
  onClose?: () => void;
}

/**
 * Hook for creating new tasks with standardized validation
 */
export function useCreateTask({ onClose }: UseCreateTaskProps = {}) {
  const navigate = useNavigate();
  const { validateTaskForm } = useTaskFormValidation();
  
  const taskForm = useTaskForm({ 
    onClose: onClose || (() => navigate("/"))
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      title: taskForm.title,
      description: taskForm.description,
      dueDate: taskForm.dueDate,
      url: taskForm.url,
      pinned: taskForm.pinned,
      assigneeId: taskForm.assigneeId,
    };

    const validationResult = validateTaskForm(formData);
    if (!validationResult.isValid) {
      return;
    }
    
    taskForm.setLoading(true);
    try {
      let photoUrl = null;
      if (taskForm.photo) {
        const { data: uploadedUrl, error: uploadError } = await uploadTaskPhoto(taskForm.photo);
        if (uploadError) throw uploadError;
        photoUrl = uploadedUrl;
      }

      const currentUserId = await getCurrentUserId();
      const finalAssigneeId = taskForm.assigneeId || currentUserId;

      const { error } = await createTask({
        title: taskForm.title,
        description: taskForm.description || null,
        due_date: new Date(taskForm.dueDate).toISOString(),
        photo_url: photoUrl,
        url_link: taskForm.url || null,
        assignee_id: finalAssigneeId,
        pinned: taskForm.pinned,
      });

      if (error) throw error;
      
      toast.success("Task created successfully");
      taskForm.resetForm();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      taskForm.setLoading(false);
    }
  }, [taskForm, validateTaskForm]);

  return {
    ...taskForm,
    handleSubmit,
  };
}
