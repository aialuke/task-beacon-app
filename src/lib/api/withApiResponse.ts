import type { ApiResponse } from '@/types/api.types';

/**
 * Wraps an async operation with consistent API response formatting
 * 
 * This utility standardizes error handling and response formatting across all API services,
 * eliminating the 150+ lines of duplicated try-catch patterns identified in the analysis.
 * 
 * @param operation - The async operation to execute
 * @returns Promise<ApiResponse<T>> - Standardized response format
 */
export async function withApiResponse<T>(
  operation: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await operation();
    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    console.error('API operation failed:', error);
    return {
      success: false,
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Error',
        status: (error as any)?.status,
        code: (error as any)?.code,
        details: error,
      },
    };
  }
}