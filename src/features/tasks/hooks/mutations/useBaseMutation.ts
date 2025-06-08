
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTaskOptimisticUpdates } from '../useTaskOptimisticUpdates';
import { useCallback } from 'react';
import { toast } from 'sonner';

interface BaseMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onMutate?: (variables: TVariables) => Promise<{ previousData?: unknown }> | { previousData?: unknown };
  successMessage: string;
  errorMessagePrefix: string;
  queryKeys?: string[][];
}

interface BaseMutationResult<TData> {
  success: boolean;
  message?: string;
  error?: string;
  data?: TData;
}

/**
 * Base mutation hook that consolidates common patterns
 * Eliminates duplicate optimistic updates, error handling, and toast notifications
 */
export function useBaseMutation<TData, TVariables>(
  options: BaseMutationOptions<TData, TVariables>
) {
  const queryClient = useQueryClient();
  const optimisticUpdates = useTaskOptimisticUpdates();

  const mutation = useMutation({
    mutationFn: options.mutationFn,
    onMutate: options.onMutate || (() => {
      const previousData = optimisticUpdates.getPreviousData();
      return { previousData };
    }),
    onError: (error, _, context) => {
      if (context?.previousData) {
        optimisticUpdates.rollbackToData(context.previousData);
      }
      toast.error(`${options.errorMessagePrefix}: ${error.message}`);
    },
    onSuccess: () => {
      // Invalidate standard task queries
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      // Invalidate additional query keys if provided
      if (options.queryKeys) {
        options.queryKeys.forEach(queryKey => {
          void queryClient.invalidateQueries({ queryKey });
        });
      }
      
      toast.success(options.successMessage);
    },
  });

  const execute = useCallback(
    async (variables: TVariables): Promise<BaseMutationResult<TData>> => {
      try {
        const result = await mutation.mutateAsync(variables);
        return {
          success: true,
          message: options.successMessage,
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
    [mutation, options.successMessage]
  );

  return {
    mutation,
    execute,
    isLoading: mutation.isPending,
  };
}
