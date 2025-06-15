
/**
 * Basic Task Service for testing
 */

import type { TaskWithRelations } from '@/types';
import type { ApiResponse } from '@/types/api.types';

interface CreateTaskData {
  title: string;
  description: string;
  dueDate: string;
  url: string;
  pinned: boolean;
  assigneeId: string;
  photoUrl?: string | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export class TaskService {
  static crud = {
    async create(data: CreateTaskData): Promise<ApiResponse<TaskWithRelations>> {
      // Mock implementation for testing
      return {
        success: true,
        data: {
          id: 'test-id',
          title: data.title,
          description: data.description,
          owner_id: 'owner-id',
          assignee_id: data.assigneeId,
          status: 'pending' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          due_date: data.dueDate || null,
          parent_task_id: null,
          photo_url: data.photoUrl || null,
          url_link: data.url || null,
        },
        error: null,
      };
    },

    async update(id: string, data: Partial<CreateTaskData>): Promise<ApiResponse<TaskWithRelations>> {
      // Mock implementation for testing
      return {
        success: true,
        data: {
          id,
          title: data.title || 'Updated Task',
          description: data.description || 'Updated Description',
          owner_id: 'owner-id',
          assignee_id: data.assigneeId || 'assignee-id',
          status: 'pending' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          due_date: data.dueDate || null,
          parent_task_id: null,
          photo_url: data.photoUrl || null,
          url_link: data.url || null,
        },
        error: null,
      };
    },
  };
}
