import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { QueryKeys } from '@/lib/api/standardized-api';

import { useTaskOptimisticUpdates } from '../useTaskOptimisticUpdates';

interface BaseMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onMutate?: (variables: TVariables) => Promise<{ previousData?: unknown }> | { previousData?: unknown };
  successMessage: string;
  errorMessagePrefix: string;
  queryKeys?: string[][];
}

export interface BaseMutationResult<TData> {
  success: boolean;
  message: string;
  data?: TData;
  error?: string;
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
      // Invalidate standard task queries using centralized QueryKeys
      void queryClient.invalidateQueries({ queryKey: QueryKeys.tasks });
      
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
          message: `${options.errorMessagePrefix}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
    [mutation, options.successMessage, options.errorMessagePrefix]
  );

  return {
    mutation,
    execute,
    isLoading: mutation.isPending,
  };
}
