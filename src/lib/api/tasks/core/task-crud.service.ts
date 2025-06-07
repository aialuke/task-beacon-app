
/**
 * Task CRUD Service - Handles basic Create, Read, Update, Delete operations
 */

import { apiRequest } from '../../error-handling';
import { AuthService } from '../../auth.service';
import { supabase } from '@/integrations/supabase/client';
import type { Task, TaskStatus, ApiResponse } from '@/types';

// Database row interface for updates (snake_case to match database schema)
interface TaskDatabaseRow {
  title?: string;
  description?: string;
  due_date?: string;
  photo_url?: string | null;
  url_link?: string | null;
  assignee_id?: string | null;
  status?: TaskStatus;
}

export interface TaskCreateData {
  title: string;
  description?: string;
  dueDate?: string;
  photoUrl?: string | null;
  urlLink?: string | null;
  assigneeId?: string | null;
  parentTaskId?: string | null;
}

export interface TaskUpdateData {
  title?: string;
  description?: string;
  dueDate?: string;
  photoUrl?: string | null;
  urlLink?: string | null;
  assigneeId?: string | null;
  status?: TaskStatus;
}

export class TaskCrudService {
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
          description: taskData.description ?? null,
          due_date: taskData.dueDate ?? null,
          photo_url: taskData.photoUrl ?? null,
          url_link: taskData.urlLink ?? null,
          owner_id: userResponse.data,
          parent_task_id: taskData.parentTaskId ?? null,
          status: 'pending' as const,
          assignee_id: taskData.assigneeId ?? null,
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
      const updateData: Partial<TaskDatabaseRow> = {};

      if (taskData.title !== undefined) updateData.title = taskData.title;
      if (taskData.description !== undefined) updateData.description = taskData.description;
      if (taskData.dueDate !== undefined) updateData.due_date = taskData.dueDate;
      if (taskData.photoUrl !== undefined) updateData.photo_url = taskData.photoUrl;
      if (taskData.urlLink !== undefined) updateData.url_link = taskData.urlLink;
      if (taskData.assigneeId !== undefined) updateData.assignee_id = taskData.assigneeId;
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
} 
