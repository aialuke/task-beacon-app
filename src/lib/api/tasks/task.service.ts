
/**
 * Task Service - Main orchestrator for all task operations
 * 
 * This service provides a clean facade over the specialized task services,
 * maintaining backward compatibility while providing organized access to all features.
 */

// Import all specialized services
import { TaskCrudService } from './core/task-crud.service';
import { TaskQueryService } from './core/task-query.service';
import { TaskStatusService } from './features/task-status.service';
import { TaskHierarchyService } from './features/task-hierarchy.service';
import { TaskMediaService } from './features/task-media.service';
import { TaskAnalyticsService } from './features/task-analytics.service';

// Re-export types for convenience
export type { TaskCreateData, TaskUpdateData } from './core/task-crud.service';
export type { TaskQueryOptions } from './core/task-query.service';

/**
 * Main Task Service - Provides organized access to all task operations
 */
export class TaskService {
  // Expose specialized services for direct access
  static crud = TaskCrudService;
  static query = TaskQueryService;
  static status = TaskStatusService;
  static hierarchy = TaskHierarchyService;
  static media = TaskMediaService;
  static analytics = TaskAnalyticsService;

  // Convenience methods for common operations (maintains backward compatibility)
  
  /**
   * Get a single task by ID
   */
  static async getById(taskId: string) {
    return this.crud.getById(taskId);
  }

  /**
   * Get paginated tasks with filtering and sorting
   */
  static async getMany(options = {}) {
    return this.query.getMany(options);
  }

  /**
   * Create a new task
   */
  static async create(taskData: Parameters<typeof TaskCrudService.create>[0]) {
    return this.crud.create(taskData);
  }

  /**
   * Update an existing task
   */
  static async update(taskId: string, taskData: Parameters<typeof TaskCrudService.update>[1]) {
    return this.crud.update(taskId, taskData);
  }

  /**
   * Delete a task
   */
  static async delete(taskId: string) {
    return this.crud.delete(taskId);
  }

  /**
   * Update task status
   */
  static async updateStatus(taskId: string, status: Parameters<typeof TaskStatusService.updateStatus>[1]) {
    return this.status.updateStatus(taskId, status);
  }

  /**
   * Create a follow-up task
   */
  static async createFollowUp(parentTaskId: string, taskData: Parameters<typeof TaskHierarchyService.createFollowUp>[1]) {
    return this.hierarchy.createFollowUp(parentTaskId, taskData);
  }

  /**
   * Get all subtasks for a parent task
   */
  static async getSubtasks(parentTaskId: string) {
    return this.hierarchy.getSubtasks(parentTaskId);
  }

  /**
   * Upload a photo for a task
   */
  static async uploadPhoto(file: File) {
    return this.media.uploadPhoto(file);
  }

  /**
   * Delete a task photo
   */
  static async deletePhoto(photoUrl: string) {
    return this.media.deletePhoto(photoUrl);
  }

  /**
   * Get task statistics for a user
   */
  static async getStats(userId?: string) {
    return this.analytics.getStats(userId);
  }

  /**
   * Search tasks by title or description
   */
  static async search(query: string, options = {}) {
    return this.analytics.search(query, options);
  }
} 
