
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskService } from '@/lib/api';
import { useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import { toast } from 'sonner';
import type { Task } from '@/types';

interface TaskCreationData {
  title: string;
  description?: string;
  dueDate?: string;
  photoUrl?: string;
  urlLink?: string;
  assigneeId?: string;
  parentTaskId?: string;
}

interface TaskMutationResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: unknown;
}

/**
 * Focused hook for task creation mutations
 */
export function useTaskCreation() {
  const queryClient = useQueryClient();

  const createTask = useMutation({
    mutationFn: async (taskData: TaskCreationData): Promise<TaskMutationResult> => {
      // Use direct service access instead of convenience method
      const result = await TaskService.crud.create(taskData);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create task');
      }
      
      return {
        success: true,
        message: 'Task created successfully',
        data: result.data,
      };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create task: ${error.message}`);
    },
  });

  const createTaskCallback = useOptimizedCallback(
    async (taskData: TaskCreationData) => {
      const result = await createTask.mutateAsync(taskData);
      return result;
    },
    [createTask],
    { name: 'createTask' }
  );

  const createFollowUpTask = useOptimizedCallback(
    async (parentTask: Task, taskData: { title: string; description?: string }): Promise<TaskMutationResult> => {
      const followUpData = {
        ...taskData,
        parentTaskId: parentTask.id,
      };
      const result = await createTask.mutateAsync(followUpData);
      return {
        success: result.success,
        message: result.success ? 'Follow-up task created successfully' : 'Failed to create follow-up task',
        error: result.success ? undefined : 'Failed to create follow-up task',
        data: result.data,
      };
    },
    [createTask],
    { name: 'createFollowUpTask' }
  );

  return {
    createTask,
    createTaskCallback,
    createFollowUpTask,
    isLoading: createTask.isPending,
  };
}
// CodeRabbit review
// CodeRabbit review
