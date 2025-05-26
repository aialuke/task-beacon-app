
import { useCallback } from "react";
import { toast } from "@/lib/toast";
import { useNavigate } from "react-router-dom";
import { useTaskForm } from "./useTaskForm";
import { useTaskValidation } from "./useTaskValidation";
import { createTask, uploadTaskPhoto } from "@/integrations/supabase/api/tasks.api";
import { getCurrentUserId } from "@/integrations/supabase/api/base.api";

interface UseCreateTaskProps {
  onClose?: () => void;
}

/**
 * Custom hook for task creation functionality
 * 
 * Builds on useTaskForm to provide specialized functionality for creating new tasks
 */
export function useCreateTask({ onClose }: UseCreateTaskProps = {}) {
  const navigate = useNavigate();
  const { validateTaskForm } = useTaskValidation();
  
  const taskForm = useTaskForm({ 
    onClose: onClose || (() => navigate("/"))
  });

  /**
   * Handles form submission for creating a new task
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the complete form using schema validation
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

      // If no assignee is selected, assign to current user
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
