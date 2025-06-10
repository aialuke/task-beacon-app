/**
 * Task API - Simplified Direct Implementation
 * 
 * Provides direct task operations without unnecessary facade complexity.
 * Eliminates multiple abstraction layers for better maintainability.
 */

import { supabase } from '@/integrations/supabase/client';
import { apiRequest } from '@/lib/api/error-handling';
import { transformApiError, createSuccessResponse, createErrorResponse } from '@/lib/api/standardized-api';
import { apiLogger } from '@/lib/logger';
import { retryAsync, executeAsync } from '@/lib/utils/patterns';
import { validatePagination, validateSorting } from '@/lib/validation/validators';
import type { TaskCreateData, TaskUpdateData } from '@/types';

// === TASK CRUD OPERATIONS ===

const createTask = async (taskData: TaskCreateData) => {
  apiLogger.info('Creating task', { title: taskData.title });
  try {
    const result = await apiRequest('createTask', async () => {
      // Use retryAsync for critical task creation operation
      return retryAsync(async () => {
        // Get current user for owner_id
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User must be authenticated to create tasks');
        }

        return executeAsync(async () => {
          const { data, error } = await supabase
            .from('tasks')
            .insert({
              title: taskData.title,
              description: taskData.description,
              due_date: taskData.due_date,
              url_link: taskData.url_link,
              assignee_id: taskData.assignee_id,
              parent_task_id: taskData.parent_task_id,
              photo_url: taskData.photo_url,
              owner_id: user.id,
            })
            .select()
            .single();

          if (error) throw error;
          return data;
        });
      }, 3, 1000);
    });

    return result.success ? createSuccessResponse(result.data) : createErrorResponse(result.error!);
  } catch (error) {
    return createErrorResponse(transformApiError(error));
  }
};

const updateTask = async (taskId: string, updates: Partial<TaskUpdateData>) => {
  return apiRequest('updateTask', async () => {
    // Use retryAsync for critical task update operation
    return retryAsync(async () => {
      return executeAsync(async () => {
        const { data, error } = await supabase
          .from('tasks')
          .update({
            title: updates.title,
            description: updates.description,
            due_date: updates.due_date,
            url_link: updates.url_link,
            assignee_id: updates.assignee_id,
            photo_url: updates.photo_url,
            status: updates.status,
          })
          .eq('id', taskId)
          .select()
          .single();

        if (error) throw error;
        return data;
      });
    }, 3, 1000);
  });
};

const deleteTask = async (taskId: string) => {
  return apiRequest('deleteTask', async () => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
    return { success: true };
  });
};

const getTaskById = async (taskId: string) => {
  return apiRequest('getTaskById', async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assignee:profiles!tasks_assignee_id_fkey(id, name, email, avatar_url),
        owner:profiles!tasks_owner_id_fkey(id, name, email, avatar_url)
      `)
      .eq('id', taskId)
      .single();

    if (error) throw error;
    return data;
  });
};

const getTasks = async (options: {
  page?: number;
  pageSize?: number;
  assignedToMe?: boolean;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
} = {}) => {
  return apiRequest('getTasks', async () => {
    const { page = 1, pageSize = 10, assignedToMe = false, sortBy = 'created_at', sortDirection = 'desc' } = options;
    
    // Validate pagination parameters
    const paginationValidation = validatePagination({ page, pageSize });
    if (!paginationValidation.success) {
      throw new Error('Invalid pagination parameters');
    }
    
    // Validate sorting parameters
    const sortingValidation = validateSorting({ field: sortBy, order: sortDirection });
    if (!sortingValidation.success) {
      throw new Error('Invalid sorting parameters');
    }
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('tasks')
      .select(`
        *,
        assignee:profiles!tasks_assignee_id_fkey(id, name, email, avatar_url),
        owner:profiles!tasks_owner_id_fkey(id, name, email, avatar_url)
      `, { count: 'exact' });

    if (assignedToMe) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        query = query.eq('assignee_id', user.id);
      }
    }

    const { data, error, count } = await query
      .order(sortBy, { ascending: sortDirection === 'asc' })
      .range(from, to);

    if (error) throw error;

    return {
      data: data || [],
      pagination: {
        totalCount: count || 0,
        currentPage: page,
        pageSize,
        hasNextPage: (count || 0) > page * pageSize,
      },
    };
  });
};

const updateTaskStatus = async (taskId: string, status: 'pending' | 'complete' | 'overdue') => {
  return apiRequest('updateTaskStatus', async () => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  });
};

const uploadPhoto = async (_photo: File) => {
  return apiRequest('uploadPhoto', async () => {
    // This is a placeholder - actual implementation would use Supabase Storage
    // For now, return null to indicate no photo upload
    return null;
  });
};

// === BACKWARDS COMPATIBILITY ===
// Simple object that matches the old interface but uses direct functions

export const TaskService = {
  crud: {
    create: createTask,
    update: updateTask,
    delete: deleteTask,
    getById: getTaskById,
  },
  query: {
    getById: getTaskById,
    getMany: getTasks,
  },
  status: {
    updateStatus: updateTaskStatus,
  },
  media: {
    uploadPhoto,
  },
};

// NOTE: Individual function exports removed as they were unused
// Functions are still available through TaskService object
