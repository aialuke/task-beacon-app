import { supabase } from '@/integrations/supabase/client';
import { apiRequest, getCurrentUserId } from './base.api';
import {
  TablesResponse,
  TaskRow,
  TaskCreateParams,
  TaskUpdateParams,
} from '@/types/api.types';
import { Task } from '@/types/shared.types';

/**
 * Fetches a single task by ID
 */
export const getTask = async (taskId: string): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .select(
      `
      *,
      parent_task:parent_task_id (
        id,
        title,
        description,
        photo_url,
        url_link
      )
    `
    )
    .eq('id', taskId)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Task not found');

  return data as Task;
};

/**
 * Fetches paginated tasks with their parent tasks
 *
 * @param page Current page number (1-based)
 * @param pageSize Number of items per page
 */
export const getAllTasks = async (
  page = 1,
  pageSize = 10
): Promise<
  TablesResponse<{
    data: Task[];
    totalCount: number;
    hasNextPage: boolean;
  }>
> => {
  return apiRequest(async () => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize - 1;

    // Get total count
    const { count } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true });

    // Get paginated tasks with parent task data
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(
        `
        *,
        parent_task:parent_task_id (
          id,
          title,
          description,
          photo_url,
          url_link
        )
      `
      )
      .order('created_at', { ascending: false })
      .range(startIndex, endIndex);

    if (error) throw error;

    const totalCount = count || 0;
    const hasNextPage = endIndex < totalCount - 1;

    return {
      data: tasks as Task[],
      totalCount,
      hasNextPage,
    };
  });
};

/**
 * Creates a new task
 */
export const createTask = async (
  taskData: Partial<TaskRow>
): Promise<TablesResponse<TaskRow>> => {
  return apiRequest(async () => {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: taskData.title || '',
        description: taskData.description || null,
        due_date: taskData.due_date || null,
        photo_url: taskData.photo_url || null,
        url_link: taskData.url_link || null,
        owner_id: userId,
        parent_task_id: taskData.parent_task_id || null,
        pinned: taskData.pinned || false,
        status: taskData.status || 'pending',
        assignee_id: taskData.assignee_id || null,
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
  return apiRequest(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status })
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
  return apiRequest(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ pinned })
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
  return apiRequest(async () => {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: taskData.title || '',
        description: taskData.description || null,
        due_date: taskData.due_date || null,
        photo_url: taskData.photo_url || null,
        url_link: taskData.url_link || null,
        owner_id: userId,
        parent_task_id: parentTaskId,
        pinned: taskData.pinned || false,
        status: taskData.status || 'pending',
        assignee_id: taskData.assignee_id || null,
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
export const uploadTaskPhoto = async (
  file: File
): Promise<TablesResponse<string>> => {
  return apiRequest(async () => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const filePath = `task-photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('task-photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('task-photos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  });
};
