
import { supabase } from '@/integrations/supabase/client';
import { apiRequest, getCurrentUserId } from './base.api';
import { TablesResponse, TaskRow } from '../types/api.types';
import { Task } from '@/lib/types';
import { isMockingSupabase } from '@/integrations/supabase/client';

// Mock data import for development
const getMockTasks = async (): Promise<Task[]> => {
  const { mockDataTasks } = await import('@/lib/mockDataTasks');
  return mockDataTasks;
};

/**
 * Fetches all tasks with their parent tasks
 */
export const getAllTasks = async (): Promise<TablesResponse<Task[]>> => {
  if (isMockingSupabase) {
    return { data: await getMockTasks(), error: null };
  }

  // When using real Supabase, we'll use API but with mocks for now
  return { data: await getMockTasks(), error: null };
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
