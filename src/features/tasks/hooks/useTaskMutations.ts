
import { useCallback, useState } from 'react';

import { useTaskCreation } from './mutations/useTaskCreation';
import { useTaskDeletion } from './mutations/useTaskDeletion';
import { useTaskStatus } from './mutations/useTaskStatus';
import { useTaskUpdates } from './mutations/useTaskUpdates';
import { executeInSequence } from '@/lib/utils/async';
import { uniqueBy } from '@/lib/utils/data';
import { useQueryClient } from '@/lib/query-client';

/**
 * Unified Task Mutations Hook - Phase 3 Consolidated
 * 
 * Combines all task mutation hooks with simplified, consistent patterns.
 * Eliminates duplicate error handling, optimistic updates, and toast notifications.
 */
export function useTaskMutations() {
  const creation = useTaskCreation();
  const deletion = useTaskDeletion();
  const updates = useTaskUpdates();
  const status = useTaskStatus();
  const queryClient = useQueryClient();
  
  // Batch operation state
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  
  // Batch operations using executeInSequence with duplicate prevention
  const batchCompleteTask = useCallback(async (taskIds: string[]) => {
    setIsBatchProcessing(true);
    try {
      // Remove duplicates using uniqueBy based on ID
      const taskObjects = taskIds.map(id => ({ id }));
      const uniqueTaskIds = uniqueBy(taskObjects, 'id').map(task => task.id);
      
      const operations = uniqueTaskIds.map(taskId => () => status.markAsComplete(taskId));
      await executeInSequence(operations);
      
      // Invalidate tasks cache after batch completion
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error(String(error)) 
      };
    } finally {
      setIsBatchProcessing(false);
    }
  }, [status.markAsComplete]);
  
  const batchDeleteTasks = useCallback(async (taskIds: string[]) => {
    setIsBatchProcessing(true);
    try {
      // Remove duplicates using uniqueBy based on ID
      const taskObjects = taskIds.map(id => ({ id }));
      const uniqueTaskIds = uniqueBy(taskObjects, 'id').map(task => task.id);
      
      const operations = uniqueTaskIds.map(taskId => () => deletion.deleteTaskById(taskId));
      await executeInSequence(operations);
      
      // Invalidate tasks cache after batch deletion
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error(String(error)) 
      };
    } finally {
      setIsBatchProcessing(false);
    }
  }, [deletion.deleteTaskById]);

  return {
    // Creation operations
    createTask: creation.createTask,
    createTaskCallback: creation.createTaskCallback,
    createFollowUpTask: creation.createFollowUpTask,

    // Update operations
    updateTask: updates.updateTask,
    updateTaskCallback: updates.updateTaskCallback,

    // Status operations
    toggleTaskComplete: status.toggleTaskComplete,
    toggleTaskCompleteCallback: status.toggleTaskCompleteCallback,
    markAsComplete: status.markAsComplete,
    markAsIncomplete: status.markAsIncomplete,

    // Deletion operations
    deleteTask: deletion.deleteTask,
    deleteTaskCallback: deletion.deleteTaskCallback,
    deleteTaskById: deletion.deleteTaskById,

    // Batch operations
    batchCompleteTask,
    batchDeleteTasks,

    // Loading states
    isCreating: creation.isLoading,
    isUpdating: updates.isLoading,
    isDeleting: deletion.isLoading,
    isTogglingStatus: status.isLoading,
    isBatchProcessing,
    
    // Combined loading state
    isLoading: creation.isLoading || updates.isLoading || deletion.isLoading || status.isLoading || isBatchProcessing,
  };
}
