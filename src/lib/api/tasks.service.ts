/**
 * Tasks Service - Provides clean abstraction for task operations
 * 
 * This service layer abstracts all task-related database operations,
 * providing a consistent API that can be easily tested and modified.
 */

import { apiRequest, AuthService, StorageService } from './base';
import { supabase } from '@/integrations/supabase/client';

// Clean imports from organized type system
import type { Task, TaskStatus, ApiResponse, PaginatedResponse } from '@/types';

// Legacy API types (to be migrated)
import { TaskRow, TaskCreateParams, TaskUpdateParams } from '@/types/api.types';

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

export interface TaskCreateData {
  title: string;
  description?: string;
  dueDate?: string;
  photoUrl?: string | null;
  urlLink?: string | null;
  assigneeId?: string | null;
  parentTaskId?: string | null;
  pinned?: boolean;
}

export interface TaskUpdateData {
  title?: string;
  description?: string;
  dueDate?: string;
  photoUrl?: string | null;
  urlLink?: string | null;
  assigneeId?: string | null;
  pinned?: boolean;
  status?: TaskStatus;
}

/**
 * Task Service provides all task-related operations with clean abstraction
 */
export class TaskService {
  /**
   * Get a single task by ID with parent task information
   */
  static async getById(taskId: string): Promise<ApiResponse<Task>> {
    return apiRequest('tasks.getById', async () => {
      const { data, error } = await supabase
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
        `)
        .eq('id', taskId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Task not found');

      return data as Task;
    });
  }

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

  /**
   * Create a new task
   */
  static async create(taskData: TaskCreateData): Promise<ApiResponse<Task>> {
    return apiRequest('tasks.create', async () => {
      const userResponse = await AuthService.getCurrentUserId();
      if (!userResponse.success || !userResponse.data) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description || null,
          due_date: taskData.dueDate || null,
          photo_url: taskData.photoUrl || null,
          url_link: taskData.urlLink || null,
          owner_id: userResponse.data,
          parent_task_id: taskData.parentTaskId || null,
          pinned: taskData.pinned || false,
          status: 'pending' as const,
          assignee_id: taskData.assigneeId || null,
        })
        .select(`
          *,
          parent_task:parent_task_id (
            id,
            title,
            description,
            photo_url,
            url_link
          )
        `)
        .single();

      if (error) throw error;
      return data as Task;
    });
  }

  /**
   * Update an existing task
   */
  static async update(taskId: string, taskData: TaskUpdateData): Promise<ApiResponse<Task>> {
    return apiRequest('tasks.update', async () => {
      const updateData: Partial<TaskRow> = {};

      if (taskData.title !== undefined) updateData.title = taskData.title;
      if (taskData.description !== undefined) updateData.description = taskData.description;
      if (taskData.dueDate !== undefined) updateData.due_date = taskData.dueDate;
      if (taskData.photoUrl !== undefined) updateData.photo_url = taskData.photoUrl;
      if (taskData.urlLink !== undefined) updateData.url_link = taskData.urlLink;
      if (taskData.assigneeId !== undefined) updateData.assignee_id = taskData.assigneeId;
      if (taskData.pinned !== undefined) updateData.pinned = taskData.pinned;
      if (taskData.status !== undefined) updateData.status = taskData.status;

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .select(`
          *,
          parent_task:parent_task_id (
            id,
            title,
            description,
            photo_url,
            url_link
          )
        `)
        .single();

      if (error) throw error;
      return data as Task;
    });
  }

  /**
   * Delete a task
   */
  static async delete(taskId: string): Promise<ApiResponse<void>> {
    return apiRequest('tasks.delete', async () => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    });
  }

  /**
   * Update task status
   */
  static async updateStatus(taskId: string, status: TaskStatus): Promise<ApiResponse<Task>> {
    return this.update(taskId, { status });
  }

  /**
   * Toggle task pin status
   */
  static async togglePin(taskId: string, pinned: boolean): Promise<ApiResponse<Task>> {
    return this.update(taskId, { pinned });
  }

  /**
   * Create a follow-up task
   */
  static async createFollowUp(parentTaskId: string, taskData: TaskCreateData): Promise<ApiResponse<Task>> {
    return this.create({
      ...taskData,
      parentTaskId,
    });
  }

  /**
   * Get all subtasks for a parent task
   */
  static async getSubtasks(parentTaskId: string): Promise<ApiResponse<Task[]>> {
    return apiRequest('tasks.getSubtasks', async () => {
      const { data, error } = await supabase
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
        `)
        .eq('parent_task_id', parentTaskId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as Task[]) || [];
    });
  }

  /**
   * Upload a photo for a task
   */
  static async uploadPhoto(file: File): Promise<ApiResponse<string>> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const filePath = `task-photos/${fileName}`;

    return StorageService.uploadFile('task-photos', filePath, file);
  }

  /**
   * Delete a task photo
   */
  static async deletePhoto(photoUrl: string): Promise<ApiResponse<void>> {
    return apiRequest('tasks.deletePhoto', async () => {
      // Extract path from URL
      const urlParts = photoUrl.split('/');
      const bucket = urlParts[urlParts.length - 2];
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `task-photos/${fileName}`;

      const response = await StorageService.deleteFile(bucket, filePath);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete photo');
      }
    });
  }

  /**
   * Get task statistics for a user
   */
  static async getStats(userId?: string): Promise<ApiResponse<{
    total: number;
    pending: number;
    complete: number;
    overdue: number;
  }>> {
    return apiRequest('tasks.getStats', async () => {
      let targetUserId = userId;
      if (!targetUserId) {
        const userResponse = await AuthService.getCurrentUserId();
        if (!userResponse.success || !userResponse.data) {
          throw new Error('User not authenticated');
        }
        targetUserId = userResponse.data;
      }

      const [totalResult, pendingResult, completeResult, overdueResult] = await Promise.all([
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('owner_id', targetUserId),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('owner_id', targetUserId).eq('status', 'pending'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('owner_id', targetUserId).eq('status', 'complete'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('owner_id', targetUserId).eq('status', 'overdue'),
      ]);

      return {
        total: totalResult.count || 0,
        pending: pendingResult.count || 0,
        complete: completeResult.count || 0,
        overdue: overdueResult.count || 0,
      };
    });
  }

  /**
   * Search tasks by title or description
   */
  static async search(query: string, options: Omit<TaskQueryOptions, 'search'> = {}): Promise<ApiResponse<Task[]>> {
    return apiRequest('tasks.search', async () => {
      const response = await this.getMany({ ...options, search: query });
      if (!response.success) {
        throw new Error(response.error?.message || 'Search failed');
      }
      return response.data?.data || [];
    });
  }
} 