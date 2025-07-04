/**
 * Task API - Simplified Direct Implementation
 *
 * Provides direct task operations without unnecessary facade complexity.
 * Eliminates multiple abstraction layers for better maintainability.
 */

import { supabase } from '@/integrations/supabase/client';
import type { TaskCreateData, TaskUpdateData } from '@/types';

import { withApiResponse } from '../withApiResponse';

// === TASK CRUD OPERATIONS ===

const createTask = async (taskData: TaskCreateData) => {
  return withApiResponse(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be authenticated to create tasks');
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: taskData.title,
        description: taskData.description,
        due_date: taskData.due_date,
        url_link: taskData.url_link,
        assignee_id: taskData.assignee_id,
        parent_task_id: taskData.parent_task_id,
        photo_url: taskData.photo_url,
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  });
};

const updateTask = async (taskId: string, updates: Partial<TaskUpdateData>) => {
  return withApiResponse(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: updates.title,
        description: updates.description,
        due_date: updates.due_date,
        url_link: updates.url_link,
        assignee_id: updates.assignee_id,
        photo_url: updates.photo_url,
        status: updates.status,
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  });
};

const deleteTask = async (taskId: string) => {
  return withApiResponse(async () => {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) throw error;
    return { success: true };
  });
};

const getTaskById = async (taskId: string) => {
  return withApiResponse(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select(
        `
        *,
        assignee:profiles!tasks_assignee_id_fkey(id, name, email, avatar_url),
        owner:profiles!tasks_owner_id_fkey(id, name, email, avatar_url)
      `,
      )
      .eq('id', taskId)
      .single();

    if (error) throw error;
    return data;
  });
};

const getTasks = async (
  options: {
    page?: number;
    pageSize?: number;
    assignedToMe?: boolean;
  } = {},
) => {
  return withApiResponse(async () => {
    const { page = 1, pageSize = 10, assignedToMe = false } = options;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from('tasks').select(
      `
        *,
        assignee:profiles!tasks_assignee_id_fkey(id, name, email, avatar_url),
        owner:profiles!tasks_owner_id_fkey(id, name, email, avatar_url)
      `,
      { count: 'exact' },
    );

    if (assignedToMe) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        query = query.eq('assignee_id', user.id);
      }
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data ?? [],
      pagination: {
        totalCount: count ?? 0,
        currentPage: page,
        pageSize,
        hasNextPage: (count ?? 0) > page * pageSize,
      },
    };
  });
};

const updateTaskStatus = async (
  taskId: string,
  status: 'pending' | 'complete' | 'overdue',
) => {
  return withApiResponse(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  });
};

const uploadPhoto = async (_photo: File) => {
  return withApiResponse(async () => {
    // This is a placeholder - actual implementation would use Supabase Storage
    // For now, return null to indicate no photo upload
    return null;
  });
};

// === BACKWARDS COMPATIBILITY ===
// Simple object that matches the old interface but uses direct functions

export const TaskService = {
  crud: {
    create: createTask,
    update: updateTask,
    delete: deleteTask,
    getById: getTaskById,
  },
  query: {
    getById: getTaskById,
    getMany: getTasks,
  },
  status: {
    updateStatus: updateTaskStatus,
  },
  media: {
    uploadPhoto,
  },
};

// NOTE: Individual function exports removed as they were unused
// Functions are still available through TaskService object
