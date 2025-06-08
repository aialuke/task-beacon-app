
import { useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import { useTaskMutations } from './useTaskMutations';
import { Task } from '@/types';

interface BatchOperation {
  type: 'update';
  data: Partial<Task>;
  task: Task;
}

interface BatchOperationResult {
  success: boolean;
  error?: string;
  taskId?: string;
}

/**
 * Hook for handling batch task operations
 * Extracted from useTaskWorkflow for better separation of concerns
 */
export function useTaskBatchOperations() {
  const mutations = useTaskMutations();

  const executeBatchOperations = useOptimizedCallback(
    async (operations: BatchOperation[]): Promise<{
      results: BatchOperationResult[];
      successCount: number;
      totalCount: number;
    }> => {
      const results: BatchOperationResult[] = [];
      
      for (const operation of operations) {
        if (operation.type === 'update' && operation.task) {
          try {
            const result = await mutations.updateTaskCallback(operation.task.id, operation.data);
            
            if (result.success) {
              results.push({ success: true, taskId: operation.task.id });
            } else {
              results.push({
                success: false,
                error: 'Update failed',
                taskId: operation.task.id,
              });
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            results.push({
              success: false,
              error: errorMessage,
              taskId: operation.task.id,
            });
          }
        } else {
          results.push({
            success: false,
            error: 'Invalid operation: task required for update',
          });
        }
      }

      const successCount = results.filter(r => r.success).length;
      return { results, successCount, totalCount: results.length };
    },
    [mutations],
    { name: 'execute-batch-operations' }
  );

  return {
    executeBatchOperations,
  };
}
// CodeRabbit review
// CodeRabbit review
