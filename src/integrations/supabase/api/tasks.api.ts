import { supabase } from '@/integrations/supabase/client';
import { apiRequest, getCurrentUserId } from './base.api';
import { TablesResponse, TaskRow } from '../types/api.types';
import { Task } from '@/lib/types';
import { isMockingSupabase } from '@/integrations/supabase/client';

// Mock data import for development
const getMockTasks = async (page = 1, pageSize = 10): Promise<{data: Task[], totalCount: number, hasNextPage: boolean}> => {
  const { mockDataTasks } = await import('@/lib/mockDataTasks');
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTasks = mockDataTasks.slice(startIndex, endIndex);
  
  return {
    data: paginatedTasks,
    totalCount: mockDataTasks.length,
    hasNextPage: endIndex < mockDataTasks.length
  };
};

/**
 * Fetches a single task by ID
 */
export const getTask = async (taskId: string): Promise<Task> => {
  if (isMockingSupabase) {
    const { mockDataTasks } = await import('@/lib/mockDataTasks');
    const task = mockDataTasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  // Mock implementation for now
  const { mockDataTasks } = await import('@/lib/mockDataTasks');
  const task = mockDataTasks.find(t => t.id === taskId);
  if (!task) {
    throw new Error('Task not found');
  }
  return task;
};

/**
 * Fetches paginated tasks with their parent tasks
 * 
 * @param page Current page number (1-based)
 * @param pageSize Number of items per page
 */
export const getAllTasks = async (page = 1, pageSize = 10): Promise<TablesResponse<{
  data: Task[];
  totalCount: number;
  hasNextPage: boolean;
}>> => {
  if (isMockingSupabase) {
    const result = await getMockTasks(page, pageSize);
    return { data: result, error: null };
  }

  // When using real Supabase, we'd use API but with mocks for now
  return { data: await getMockTasks(page, pageSize), error: null };
};

/**
 * Creates a new task
 */
export const createTask = async (taskData: Partial<TaskRow>): Promise<TablesResponse<TaskRow>> => {
  if (isMockingSupabase) {
    return { data: { id: `mock-${Date.now()}`, ...taskData } as TaskRow, error: null };
  }

  return apiRequest(async () => {
    const userId = await getCurrentUserId();
    
    // Mock implementation
    return {
      id: `mock-${Date.now()}`,
      ...taskData,
      owner_id: userId,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as TaskRow;
  });
};

/**
 * Updates a task's status (complete/pending)
 */
export const updateTaskStatus = async (
  taskId: string, 
  status: 'pending' | 'complete' | 'overdue'
): Promise<TablesResponse<TaskRow>> => {
  if (isMockingSupabase) {
    return { data: { id: taskId, status } as TaskRow, error: null };
  }

  // Mock implementation
  return apiRequest(async () => {
    return { 
      id: taskId,
      status,
      updated_at: new Date().toISOString()
    } as TaskRow;
  });
};

/**
 * Toggles the pinned status of a task
 */
export const toggleTaskPin = async (
  taskId: string,
  pinned: boolean
): Promise<TablesResponse<TaskRow>> => {
  if (isMockingSupabase) {
    return { data: { id: taskId, pinned } as TaskRow, error: null };
  }

  // Mock implementation
  return apiRequest(async () => {
    return { 
      id: taskId,
      pinned,
      updated_at: new Date().toISOString()
    } as TaskRow;
  });
};

/**
 * Creates a follow-up task for a parent task
 */
export const createFollowUpTask = async (
  parentTaskId: string,
  taskData: Partial<TaskRow>
): Promise<TablesResponse<TaskRow>> => {
  if (isMockingSupabase) {
    return { 
      data: { 
        id: `mock-followup-${Date.now()}`, 
        ...taskData, 
        parent_task_id: parentTaskId 
      } as TaskRow, 
      error: null 
    };
  }

  return apiRequest(async () => {
    const userId = await getCurrentUserId();
    
    // Mock implementation
    return {
      id: `mock-followup-${Date.now()}`,
      ...taskData,
      owner_id: userId,
      parent_task_id: parentTaskId,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as TaskRow;
  });
};

/**
 * Uploads a photo for a task
 */
export const uploadTaskPhoto = async (file: File): Promise<TablesResponse<string>> => {
  if (isMockingSupabase) {
    return { data: URL.createObjectURL(file), error: null };
  }

  // Mock implementation
  return apiRequest(async () => {
    return URL.createObjectURL(file);
  });
};
