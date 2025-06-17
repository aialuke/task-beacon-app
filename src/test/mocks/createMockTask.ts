/**
 * Mock Task Factory
 *
 * Standardized factory for creating mock task objects in tests.
 * Provides consistent, type-safe mock data for task-related testing.
 */

import type {
  TaskTable,
  TaskWithRelations,
  TaskStatusEnum,
} from '@/types/database';

import { createMockUser } from './createMockUser';

export interface MockTaskOptions {
  id?: string;
  title?: string;
  description?: string;
  status?: TaskStatusEnum;
  due_date?: string | null;
  owner_id?: string;
  assignee_id?: string | null;
  parent_task_id?: string | null;
  url_link?: string | null;
  photo_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Creates a mock TaskTable for testing
 */
export function createMockTask(options: MockTaskOptions = {}): TaskTable {
  const now = new Date().toISOString();

  return {
    id: options.id || 'test-task-id',
    title: options.title || 'Test Task',
    description: options.description || 'Test task description',
    status: options.status || 'pending',
    due_date: options.due_date || null,
    owner_id: options.owner_id || 'test-owner-id',
    assignee_id: options.assignee_id || null,
    parent_task_id: options.parent_task_id || null,
    url_link: options.url_link || null,
    photo_url: options.photo_url || null,
    created_at: options.created_at || now,
    updated_at: options.updated_at || now,
  };
}

/**
 * Creates a mock TaskWithRelations for testing with user relationships
 */
export function createMockTaskWithRelations(
  options: MockTaskOptions = {}
): TaskWithRelations {
  const baseTask = createMockTask(options);

  // Create related users
  const owner = createMockUser({
    id: baseTask.owner_id,
    name: 'Task Owner',
    email: 'owner@example.com',
  });

  const assignee = baseTask.assignee_id
    ? createMockUser({
        id: baseTask.assignee_id,
        name: 'Task Assignee',
        email: 'assignee@example.com',
      })
    : null;

  const parentTask = baseTask.parent_task_id
    ? {
        id: baseTask.parent_task_id,
        title: 'Parent Task',
        description: 'Parent task description',
        photo_url: null,
        url_link: null,
      }
    : null;

  return {
    ...baseTask,
    owner: {
      id: owner.id,
      name: owner.name,
      email: owner.email,
      avatar_url: owner.avatar_url,
    },
    assignee: assignee
      ? {
          id: assignee.id,
          name: assignee.name,
          email: assignee.email,
          avatar_url: assignee.avatar_url,
        }
      : null,
    parent_task: parentTask,
  };
}

/**
 * Creates a mock overdue task
 */
export function createMockOverdueTask(
  options: MockTaskOptions = {}
): TaskTable {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return createMockTask({
    ...options,
    status: 'overdue',
    due_date: yesterday.toISOString(),
  });
}

/**
 * Creates a mock completed task
 */
export function createMockCompletedTask(
  options: MockTaskOptions = {}
): TaskTable {
  return createMockTask({
    ...options,
    status: 'complete',
  });
}

/**
 * Creates a mock task with subtasks
 */
export function createMockTaskWithSubtasks(
  options: MockTaskOptions = {},
  subtaskCount = 3
): { parentTask: TaskTable; subtasks: TaskTable[] } {
  const parentTask = createMockTask(options);

  const subtasks = Array.from({ length: subtaskCount }, (_, i) =>
    createMockTask({
      id: `${parentTask.id}-subtask-${i + 1}`,
      title: `${parentTask.title} - Subtask ${i + 1}`,
      description: `Subtask ${i + 1} for ${parentTask.title}`,
      parent_task_id: parentTask.id,
      owner_id: parentTask.owner_id,
      assignee_id: parentTask.assignee_id,
    })
  );

  return { parentTask, subtasks };
}

/**
 * Creates multiple mock tasks for list testing
 */
export function createMockTasks(count: number): TaskTable[] {
  return Array.from({ length: count }, (_, i) => {
    const statuses: TaskStatusEnum[] = ['pending', 'complete', 'overdue'];
    const status = statuses[i % statuses.length];

    return createMockTask({
      id: `task-${i + 1}`,
      title: `Task ${i + 1}`,
      description: `Description for task ${i + 1}`,
      status,
      owner_id: `owner-${(i % 3) + 1}`,
      assignee_id: i % 2 === 0 ? `assignee-${(i % 2) + 1}` : null,
    });
  });
}

/**
 * Creates a mock task for specific testing scenarios
 */
export function createMockTaskScenario(
  scenario: 'basic' | 'with-assignee' | 'with-parent' | 'overdue' | 'completed'
): TaskTable {
  const baseOptions: MockTaskOptions = {
    title: 'Scenario Task',
    description: 'Task created for specific test scenario',
  };

  switch (scenario) {
    case 'basic':
      return createMockTask(baseOptions);

    case 'with-assignee':
      return createMockTask({
        ...baseOptions,
        assignee_id: 'test-assignee-id',
      });

    case 'with-parent':
      return createMockTask({
        ...baseOptions,
        parent_task_id: 'test-parent-id',
      });

    case 'overdue':
      return createMockOverdueTask(baseOptions);

    case 'completed':
      return createMockCompletedTask(baseOptions);

    default:
      return createMockTask(baseOptions);
  }
}
