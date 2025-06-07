
/**
 * Task Service - Simplified Direct Implementation
 * 
 * Provides direct access to task operations with standardized response patterns.
 * Removed unnecessary facade complexity while maintaining clean API.
 */

// Import specialized services for composition
import { TaskCrudService } from './core/task-crud.service';
import { TaskQueryService } from './core/task-query.service';
import { TaskStatusService } from './features/task-status.service';
import { TaskHierarchyService } from './features/task-hierarchy.service';
import { TaskMediaService } from './features/task-media.service';
import { TaskAnalyticsService } from './features/task-analytics.service';

// Export types for convenience
export type { TaskCreateData, TaskUpdateData } from './core/task-crud.service';
export type { TaskQueryOptions } from './core/task-query.service';

/**
 * Simplified Task Service - Direct access to operations with standardized responses
 */
export class TaskService {
  // Direct access to specialized services (no unnecessary delegation)
  static crud = TaskCrudService;
  static query = TaskQueryService;
  static status = TaskStatusService;
  static hierarchy = TaskHierarchyService;
  static media = TaskMediaService;
  static analytics = TaskAnalyticsService;
}
