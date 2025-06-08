
/**
 * Task Hierarchy Service - Handles parent-child task relationships
 */

import { apiRequest } from '../../error-handling';
import { AuthService } from '../../auth.service';
import { supabase } from '@/integrations/supabase/client';
import type { Task, ApiResponse } from '@/types';

export interface TaskCreateData {
  title: string;
  description?: string;
  dueDate?: string;
  photoUrl?: string | null;
  urlLink?: string | null;
  assigneeId?: string | null;
  parentTaskId?: string | null;
}

export class TaskHierarchyService {
  /**
   * Create a follow-up task
   */
  static async createFollowUp(parentTaskId: string, taskData: TaskCreateData): Promise<ApiResponse<Task>> {
    return apiRequest('tasks.createFollowUp', async () => {
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
          parent_task_id: parentTaskId,
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
}
// CodeRabbit review
