
import { Task } from "@/lib/types";
import { TaskFilter } from "../types";

/**
 * Service layer for complex task operations
 * 
 * This service encapsulates business logic for task filtering, sorting,
 * and other complex operations that should be separate from UI concerns.
 */
export class TaskService {
  /**
   * Filter functions for different task states
   */
  private static readonly FILTER_FUNCTIONS = {
    all: (task: Task) => task.status !== "complete",
    assigned: (task: Task) => 
      task.owner_id && 
      task.assignee_id && 
      task.owner_id !== task.assignee_id,
    overdue: (task: Task) => {
      const dueDate = task.due_date ? new Date(task.due_date) : new Date();
      const now = new Date();
      return dueDate < now && task.status !== "complete";
    },
    complete: (task: Task) => task.status === "complete",
    pending: (task: Task) => {
      const dueDate = task.due_date ? new Date(task.due_date) : new Date();
      const now = new Date();
      return dueDate >= now && task.status !== "complete";
    }
  } as const;

  /**
   * Filters tasks based on the selected filter
   * 
   * @param tasks - Array of tasks to filter
   * @param filter - Current filter selection
   * @returns Filtered array of tasks
   */
  static filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
    const filterFunction = this.FILTER_FUNCTIONS[filter];
    return tasks.filter(filterFunction);
  }

  /**
   * Gets overdue tasks count
   * 
   * @param tasks - Array of tasks to check
   * @returns Number of overdue tasks
   */
  static getOverdueCount(tasks: Task[]): number {
    return this.filterTasks(tasks, 'overdue').length;
  }

  /**
   * Gets assigned tasks count
   * 
   * @param tasks - Array of tasks to check
   * @returns Number of assigned tasks
   */
  static getAssignedCount(tasks: Task[]): number {
    return this.filterTasks(tasks, 'assigned').length;
  }

  /**
   * Gets complete tasks count
   * 
   * @param tasks - Array of tasks to check
   * @returns Number of complete tasks
   */
  static getCompleteCount(tasks: Task[]): number {
    return this.filterTasks(tasks, 'complete').length;
  }

  /**
   * Sorts tasks by priority (pinned first, then by due date)
   * 
   * @param tasks - Array of tasks to sort
   * @returns Sorted array of tasks
   */
  static sortTasksByPriority(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      // Pinned tasks first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      // Then by due date
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
  }

  /**
   * Checks if a task is overdue
   * 
   * @param task - Task to check
   * @returns True if task is overdue
   */
  static isTaskOverdue(task: Task): boolean {
    if (!task.due_date || task.status === "complete") return false;
    return new Date(task.due_date) < new Date();
  }

  /**
   * Checks if a task is assigned to someone else
   * 
   * @param task - Task to check
   * @returns True if task is assigned to someone else
   */
  static isTaskAssigned(task: Task): boolean {
    return Boolean(
      task.owner_id && 
      task.assignee_id && 
      task.owner_id !== task.assignee_id
    );
  }

  /**
   * Gets task statistics for a given array of tasks
   * 
   * @param tasks - Array of tasks to analyze
   * @returns Task statistics object
   */
  static getTaskStatistics(tasks: Task[]) {
    return {
      total: tasks.length,
      active: this.filterTasks(tasks, 'all').length,
      overdue: this.getOverdueCount(tasks),
      assigned: this.getAssignedCount(tasks),
      complete: this.getCompleteCount(tasks),
      pending: this.filterTasks(tasks, 'pending').length
    };
  }
}
