
import { supabase, isMockingSupabase } from '@/integrations/supabase/client';
import { apiRequest, getCurrentUserId } from './base.api';
import { TablesResponse, TaskRow } from '../types/api.types';
import { Task } from '@/lib/types';

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

  return apiRequest(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        parent_task:parent_task_id (
          title,
          description,
          photo_url,
          url_link
        )
      `)
      .order('pinned', { ascending: false })
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data as Task[];
  });
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
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...taskData,
        owner_id: userId,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as TaskRow;
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

  return apiRequest(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data as TaskRow;
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

  return apiRequest(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        pinned,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data as TaskRow;
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
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...taskData,
        owner_id: userId,
        parent_task_id: parentTaskId,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as TaskRow;
  });
};

/**
 * Uploads a photo for a task
 */
export const uploadTaskPhoto = async (file: File): Promise<TablesResponse<string>> => {
  if (isMockingSupabase) {
    return { data: URL.createObjectURL(file), error: null };
  }

  return apiRequest(async () => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from('task-photos')
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = await supabase.storage
      .from('task-photos')
      .createSignedUrl(fileName, 86400);
      
    if (!urlData?.signedUrl) {
      throw new Error('Failed to get signed URL for uploaded photo');
    }
    
    return urlData.signedUrl;
  });
};
