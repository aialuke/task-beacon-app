/**
 * Task Query Service - Handles complex querying, filtering, and pagination
 */

import { apiRequest } from '../../error-handling';
import { AuthService } from '../../auth.service';
import { supabase } from '@/integrations/supabase/client';
import type { Task, TaskStatus, ApiResponse, PaginatedResponse } from '@/types';

export interface TaskQueryOptions {
  status?: TaskStatus | 'all';
  assignedToMe?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'due_date' | 'created_at' | 'title';
  sortDirection?: 'asc' | 'desc';
  search?: string;
  assigneeId?: string;
  ownerId?: string;
  parentTaskId?: string | null;
}

export class TaskQueryService {
  /**
   * Get paginated tasks with filtering and sorting
   */
  static async getMany(options: TaskQueryOptions = {}): Promise<ApiResponse<PaginatedResponse<Task>>> {
    return apiRequest('tasks.getMany', async () => {
      const {
        status = 'all',
        assignedToMe = false,
        page = 1,
        pageSize = 10,
        sortBy = 'created_at',
        sortDirection = 'desc',
        search,
        assigneeId,
        ownerId,
        parentTaskId,
      } = options;

      // Build query
      let query = supabase
        .from('tasks')
        .select(`
          *,
          parent_task:parent_task_id (
            id,
            title,
            description,
            photo_url,
            url_link
          )
        `, { count: 'exact' });

      // Apply filters
      if (status !== 'all') {
        query = query.eq('status', status);
      }

      if (assignedToMe) {
        const userResponse = await AuthService.getCurrentUserId();
        if (userResponse.success && userResponse.data) {
          query = query.eq('assignee_id', userResponse.data);
        }
      }

      if (assigneeId) {
        query = query.eq('assignee_id', assigneeId);
      }

      if (ownerId) {
        query = query.eq('owner_id', ownerId);
      }

      if (parentTaskId !== undefined) {
        if (parentTaskId === null) {
          query = query.is('parent_task_id', null);
        } else {
          query = query.eq('parent_task_id', parentTaskId);
        }
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%, description.ilike.%${search}%`);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortDirection === 'asc' });

      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;
      query = query.range(startIndex, endIndex);

      const { data, error, count } = await query;

      if (error) throw error;

      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        data: (data as Task[]) || [],
        pagination: {
          currentPage: page,
          pageSize,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    });
  }
} 