
/**
 * Task Status Service - Handles status updates
 */

import { apiRequest } from '../../error-handling';
import { supabase } from '@/integrations/supabase/client';
import type { Task, TaskStatus, ApiResponse } from '@/types';

// Database row interface for updates (snake_case to match database schema)
interface TaskDatabaseRow {
  status?: TaskStatus;
}

export class TaskStatusService {
  /**
   * Update task status
   */
  static async updateStatus(taskId: string, status: TaskStatus): Promise<ApiResponse<Task>> {
    return apiRequest('tasks.updateStatus', async () => {
      const updateData: Partial<TaskDatabaseRow> = { status };

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
} 
// CodeRabbit review
// CodeRabbit review
