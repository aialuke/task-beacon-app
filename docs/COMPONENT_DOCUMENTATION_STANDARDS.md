# Component Documentation Standards

This document defines the standards for documenting React components, custom hooks, and utility functions in our codebase.

## Table of Contents

- [Component Documentation](#component-documentation)
- [Hook Documentation](#hook-documentation)
- [Utility Function Documentation](#utility-function-documentation)
- [Type Documentation](#type-documentation)
- [Documentation Tools](#documentation-tools)

## Component Documentation

### JSDoc Template for Components

```typescript
/**
 * TaskCard Component
 * 
 * A reusable card component for displaying task information with interactive actions.
 * Supports optimistic updates, drag and drop, and customizable layouts.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <TaskCard task={task} onComplete={handleComplete} />
 * 
 * // With custom styling and actions
 * <TaskCard 
 *   task={task}
 *   onComplete={handleComplete}
 *   onEdit={handleEdit}
 *   variant="compact"
 *   className="mb-4"
 *   showMetadata={true}
 * />
 * 
 * // With drag and drop
 * <TaskCard 
 *   task={task}
 *   isDraggable={true}
 *   onDragStart={handleDragStart}
 *   onDragEnd={handleDragEnd}
 * />
 * ```
 * 
 * @param {Object} props - Component props
 * @param {Task} props.task - The task object to display
 * @param {function} [props.onComplete] - Callback fired when task is completed
 * @param {function} [props.onEdit] - Callback fired when edit button is clicked
 * @param {function} [props.onDelete] - Callback fired when delete button is clicked
 * @param {'default' | 'compact' | 'detailed'} [props.variant='default'] - Visual variant
 * @param {boolean} [props.showMetadata=true] - Whether to show task metadata
 * @param {boolean} [props.isDraggable=false] - Whether the card can be dragged
 * @param {boolean} [props.isSelected=false] - Whether the card is selected
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.data-testid] - Test identifier for testing
 * 
 * @see {@link useTaskMutations} for task mutation operations
 * @see {@link Task} for task data structure
 * 
 * @since 1.0.0
 * @version 1.2.0
 * 
 * @author Development Team
 * @lastModified 2024-12-20
 */
import { memo, useCallback, forwardRef } from 'react';
import type { Task, TaskCardVariant } from '@/types';

interface TaskCardProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  variant?: TaskCardVariant;
  showMetadata?: boolean;
  isDraggable?: boolean;
  isSelected?: boolean;
  className?: string;
  'data-testid'?: string;
}

export const TaskCard = memo(forwardRef<HTMLDivElement, TaskCardProps>(
  function TaskCard(props, ref) {
    // Component implementation...
  }
));
```

### Component Documentation Sections

#### 1. Description
- **Purpose**: What the component does
- **Use Cases**: When to use this component
- **Features**: Key functionality and capabilities

#### 2. Examples
- **Basic Usage**: Simplest implementation
- **Advanced Usage**: Complex scenarios with multiple props
- **Integration Examples**: How it works with other components

#### 3. Props Documentation
- **Required Props**: Must be provided
- **Optional Props**: Default values and behavior
- **Callback Props**: Event handlers and their signatures
- **Style Props**: className, variant, etc.

#### 4. Accessibility
- **ARIA Labels**: Required accessibility attributes
- **Keyboard Navigation**: Supported keyboard interactions
- **Screen Reader**: How it's announced to screen readers

#### 5. Performance Notes
- **Memoization**: When the component re-renders
- **Optimization**: Performance considerations
- **Large Lists**: Behavior with many items

### Real Example: Enhanced TaskCard Documentation

```typescript
/**
 * TaskCard - Interactive Task Display Component
 * 
 * A highly reusable card component for displaying task information with rich
 * interactions including completion toggling, editing, and drag-and-drop support.
 * 
 * ## Features
 * - ✅ Optimistic updates for instant feedback
 * - 🎯 Multiple visual variants (default, compact, detailed)
 * - 🖱️ Drag and drop support with visual feedback
 * - ⌨️ Full keyboard navigation support
 * - 📱 Responsive design with mobile-first approach
 * - 🎨 Customizable theming and styling
 * - ♿ Complete accessibility support
 * 
 * ## Accessibility
 * - Uses semantic HTML with proper heading hierarchy
 * - Provides ARIA labels for all interactive elements
 * - Supports keyboard navigation (Tab, Enter, Space)
 * - Announces state changes to screen readers
 * - Maintains focus management during interactions
 * 
 * ## Performance
 * - Wrapped with React.memo to prevent unnecessary re-renders
 * - Uses useCallback for event handlers to maintain reference equality
 * - Optimized for lists with hundreds of items
 * - Lazy loads heavy operations (image compression, etc.)
 * 
 * @component
 * @example
 * ```tsx
 * // Basic task display
 * <TaskCard 
 *   task={task} 
 *   onComplete={(id) => toggleTask(id)}
 * />
 * 
 * // Compact variant for mobile or dense layouts
 * <TaskCard 
 *   task={task}
 *   variant="compact"
 *   showMetadata={false}
 *   className="mb-2"
 * />
 * 
 * // Full-featured with all interactions
 * <TaskCard 
 *   task={task}
 *   variant="detailed"
 *   onComplete={handleComplete}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   isDraggable={true}
 *   onDragStart={handleDragStart}
 *   onDragEnd={handleDragEnd}
 *   isSelected={selectedTaskId === task.id}
 *   data-testid={`task-card-${task.id}`}
 * />
 * 
 * // In a virtualized list
 * <VirtualizedList
 *   items={tasks}
 *   renderItem={(task) => (
 *     <TaskCard 
 *       key={task.id}
 *       task={task}
 *       variant="compact"
 *       onComplete={handleComplete}
 *     />
 *   )}
 * />
 * ```
 * 
 * @param {TaskCardProps} props - Component properties
 * @param {Task} props.task - Task data object containing title, description, status, etc.
 * @param {(taskId: string) => void} [props.onComplete] - Fired when user marks task complete
 * @param {(task: Task) => void} [props.onEdit] - Fired when user clicks edit button
 * @param {(taskId: string) => void} [props.onDelete] - Fired when user confirms deletion
 * @param {'default' | 'compact' | 'detailed'} [props.variant='default'] - Visual layout variant
 * @param {boolean} [props.showMetadata=true] - Show due date, assignee, tags, etc.
 * @param {boolean} [props.isDraggable=false] - Enable drag and drop functionality
 * @param {boolean} [props.isSelected=false] - Visual selected state
 * @param {(event: DragEvent, task: Task) => void} [props.onDragStart] - Drag start handler
 * @param {(event: DragEvent, task: Task) => void} [props.onDragEnd] - Drag end handler
 * @param {string} [props.className] - Additional Tailwind CSS classes
 * @param {string} [props.data-testid] - Test identifier for automated testing
 * 
 * @throws {Error} When task prop is null or undefined
 * @throws {Error} When task.id is missing (required for operations)
 * 
 * @see {@link useTaskMutations} - Hook for task operations (complete, edit, delete)
 * @see {@link useTaskDragDrop} - Hook for drag and drop functionality
 * @see {@link Task} - Task data type definition
 * @see {@link TaskCardVariant} - Available visual variants
 * 
 * @since 1.0.0 - Initial implementation
 * @version 1.4.2 - Added drag and drop support and accessibility improvements
 * 
 * @author Frontend Team <frontend@company.com>
 * @lastModified 2024-12-20
 * @status Stable - Production ready, no breaking changes planned
 */
```

## Hook Documentation

### Custom Hook Template

```typescript
/**
 * useTaskMutations - Task Operations Hook
 * 
 * Provides a centralized interface for all task mutation operations including
 * creating, updating, completing, and deleting tasks. Implements optimistic
 * updates and comprehensive error handling.
 * 
 * ## Features
 * - 🔄 Optimistic updates for better UX
 * - 🎯 Automatic cache invalidation
 * - 🛡️ Comprehensive error handling and rollback
 * - 📊 Performance monitoring and analytics
 * - 🔧 TypeScript support with full type safety
 * 
 * ## Error Handling
 * All mutations include automatic retry logic and rollback on failure.
 * Errors are logged to the console and optionally reported to monitoring.
 * 
 * ## Performance
 * - Mutations are debounced to prevent rapid successive calls
 * - Uses React Query's optimistic updates for instant feedback
 * - Implements intelligent cache updates to minimize re-fetches
 * 
 * @hook
 * @example
 * ```typescript
 * // Basic usage
 * const { toggleTaskComplete, isLoading } = useTaskMutations();
 * 
 * // Toggle task completion
 * const handleComplete = async (task: Task) => {
 *   try {
 *     const result = await toggleTaskComplete(task);
 *     if (result.success) {
 *       toast.success(`Task ${result.status}`);
 *     }
 *   } catch (error) {
 *     toast.error('Failed to update task');
 *   }
 * };
 * 
 * // Bulk operations
 * const { bulkUpdateTasks } = useTaskMutations();
 * 
 * const handleBulkComplete = async (taskIds: string[]) => {
 *   const results = await bulkUpdateTasks(taskIds, { status: 'complete' });
 *   console.log(`Updated ${results.successCount} tasks`);
 * };
 * 
 * // With error handling
 * const { deleteTask, isDeleting } = useTaskMutations({
 *   onError: (error, context) => {
 *     console.error('Mutation failed:', error);
 *     // Custom error handling
 *   },
 *   onSuccess: (data, variables) => {
 *     analytics.track('task_operation', { 
 *       operation: 'delete',
 *       taskId: variables.taskId 
 *     });
 *   }
 * });
 * ```
 * 
 * @param {UseTaskMutationsOptions} [options] - Configuration options
 * @param {(error: Error, context: any) => void} [options.onError] - Global error handler
 * @param {(data: any, variables: any) => void} [options.onSuccess] - Global success handler
 * @param {boolean} [options.enableOptimisticUpdates=true] - Enable optimistic updates
 * @param {number} [options.retryAttempts=2] - Number of retry attempts on failure
 * 
 * @returns {UseTaskMutationsReturn} Object containing mutation functions and state
 * @returns {function} returns.toggleTaskComplete - Toggle task completion status
 * @returns {function} returns.toggleTaskPin - Toggle task pin status  
 * @returns {function} returns.deleteTask - Delete a task
 * @returns {function} returns.bulkUpdateTasks - Update multiple tasks
 * @returns {boolean} returns.isLoading - True if any mutation is in progress
 * @returns {Error | null} returns.error - Last error that occurred
 * 
 * @throws {Error} When React Query context is not available
 * @throws {TaskMutationError} When task operation fails after retries
 * 
 * @see {@link useTaskQueries} - For task data fetching
 * @see {@link TaskService} - Underlying service layer
 * @see {@link Task} - Task data type
 * 
 * @since 1.0.0 - Initial implementation
 * @version 1.3.0 - Added bulk operations and performance monitoring
 * 
 * @author Frontend Team
 * @category Hooks
 * @subcategory Mutations
 */
export function useTaskMutations(options?: UseTaskMutationsOptions): UseTaskMutationsReturn {
  // Implementation...
}

/**
 * Configuration options for useTaskMutations hook
 */
interface UseTaskMutationsOptions {
  /** Global error handler for all mutations */
  onError?: (error: Error, context: any) => void;
  /** Global success handler for all mutations */
  onSuccess?: (data: any, variables: any) => void;
  /** Enable optimistic updates (default: true) */
  enableOptimisticUpdates?: boolean;
  /** Number of retry attempts on failure (default: 2) */
  retryAttempts?: number;
}

/**
 * Return type for useTaskMutations hook
 */
interface UseTaskMutationsReturn {
  /** Toggle task completion status with optimistic updates */
  toggleTaskComplete: (task: Task) => Promise<TaskOperationResult>;
  /** Toggle task pin status */
  toggleTaskPin: (task: Task) => Promise<TaskOperationResult>;
  /** Delete a task with confirmation */
  deleteTask: (taskId: string) => Promise<TaskOperationResult>;
  /** Update multiple tasks simultaneously */
  bulkUpdateTasks: (taskIds: string[], updates: Partial<Task>) => Promise<BulkOperationResult>;
  /** True if any mutation is currently in progress */
  isLoading: boolean;
  /** Last error that occurred during mutations */
  error: Error | null;
}
```

## Utility Function Documentation

### Utility Function Template

```typescript
/**
 * formatTaskDueDate - Task Due Date Formatter
 * 
 * Formats task due dates into human-readable strings with relative time
 * and localization support. Handles edge cases like overdue tasks and
 * tasks without due dates.
 * 
 * ## Features
 * - 🌍 Internationalization support (i18n)
 * - ⏰ Relative time formatting (e.g., "2 hours ago", "in 3 days")
 * - 🚨 Special handling for overdue tasks
 * - 🎨 Customizable output formats
 * - 📱 Responsive text for different screen sizes
 * 
 * @utility
 * @category Date Formatting
 * @since 1.0.0
 * 
 * @example
 * ```typescript
 * // Basic usage
 * formatTaskDueDate('2024-12-25T10:00:00Z');
 * // Returns: "Due in 3 days"
 * 
 * // With custom format
 * formatTaskDueDate('2024-12-25T10:00:00Z', {
 *   format: 'absolute',
 *   includeTime: true
 * });
 * // Returns: "Dec 25, 2024 at 10:00 AM"
 * 
 * // Overdue task
 * formatTaskDueDate('2024-12-15T10:00:00Z');
 * // Returns: "Overdue by 5 days"
 * 
 * // No due date
 * formatTaskDueDate(null);
 * // Returns: "No due date"
 * 
 * // With locale
 * formatTaskDueDate('2024-12-25T10:00:00Z', {
 *   locale: 'es-ES'
 * });
 * // Returns: "Vence en 3 días"
 * ```
 * 
 * @param {string | null} dueDate - ISO date string or null
 * @param {FormatOptions} [options] - Formatting configuration
 * @param {'relative' | 'absolute'} [options.format='relative'] - Output format type
 * @param {boolean} [options.includeTime=false] - Include time in absolute format
 * @param {string} [options.locale] - Locale for formatting (defaults to user locale)
 * @param {boolean} [options.shortForm=false] - Use abbreviated text
 * @param {Date} [options.baseDate] - Reference date for relative calculations
 * 
 * @returns {string} Formatted due date string
 * 
 * @throws {Error} When dueDate is an invalid date string
 * @throws {Error} When locale is not supported
 * 
 * @see {@link formatDate} - General date formatting utility
 * @see {@link getRelativeTime} - Relative time calculation
 * @see {@link isOverdue} - Check if task is overdue
 * 
 * @author Frontend Team
 * @lastModified 2024-12-20
 * @complexity O(1) - Constant time operation
 * @performance Optimized with memoization for repeated calls
 */
export function formatTaskDueDate(
  dueDate: string | null,
  options?: FormatOptions
): string {
  // Implementation with comprehensive error handling
  try {
    if (!dueDate) {
      return options?.locale === 'es-ES' ? 'Sin fecha límite' : 'No due date';
    }

    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date string: ${dueDate}`);
    }

    // Implementation continues...
  } catch (error) {
    console.error('formatTaskDueDate error:', error);
    throw error;
  }
}

/**
 * Configuration options for formatTaskDueDate
 */
interface FormatOptions {
  /** Output format type */
  format?: 'relative' | 'absolute';
  /** Include time in absolute format */
  includeTime?: boolean;
  /** Locale for formatting */
  locale?: string;
  /** Use abbreviated text */
  shortForm?: boolean;
  /** Reference date for relative calculations */
  baseDate?: Date;
}
```

## Type Documentation

### Interface Documentation

```typescript
/**
 * Task - Core Task Entity
 * 
 * Represents a task in the task management system with all associated
 * metadata, relationships, and operational data.
 * 
 * ## Usage
 * This interface is used throughout the application for task operations,
 * API communication, and UI rendering. All task-related functions should
 * accept or return this type.
 * 
 * ## Validation
 * - `id` must be a valid UUID
 * - `title` must be 1-100 characters
 * - `status` must be one of the defined values
 * - `created_at` and `updated_at` are managed by the database
 * 
 * @interface
 * @category Core Types
 * @since 1.0.0
 * 
 * @example
 * ```typescript
 * // Creating a new task
 * const newTask: Partial<Task> = {
 *   title: 'Complete project documentation',
 *   description: 'Write comprehensive docs for the API',
 *   due_date: '2024-12-31T23:59:59Z',
 *   priority: 'high',
 *   status: 'pending'
 * };
 * 
 * // Type-safe task operations
 * function updateTaskStatus(task: Task, status: TaskStatus): Task {
 *   return { ...task, status, updated_at: new Date().toISOString() };
 * }
 * 
 * // With optional fields
 * const taskUpdate: Partial<Task> = {
 *   title: 'Updated title',
 *   description: null // Clear description
 * };
 * ```
 * 
 * @see {@link TaskStatus} - Available task statuses
 * @see {@link TaskPriority} - Task priority levels
 * @see {@link TaskCreateData} - Data for creating new tasks
 * @see {@link TaskUpdateData} - Data for updating existing tasks
 */
export interface Task extends BaseEntity {
  /** Unique task identifier (UUID) */
  id: ID;
  
  /** Task title (1-100 characters) */
  title: string;
  
  /** Detailed task description (optional, supports markdown) */
  description: string | null;
  
  /** Current task status */
  status: TaskStatus;
  
  /** Task priority level (optional, defaults to 'medium') */
  priority?: TaskPriority;
  
  /** ISO date string for when task is due (optional) */
  due_date: Timestamp | null;
  
  /** URL of attached photo (optional) */
  photo_url: string | null;
  
  /** Related URL link (optional) */
  url_link: string | null;
  
  /** ID of user who owns the task */
  owner_id: ID;
  
  /** ID of user assigned to the task (optional) */
  assignee_id: ID | null;
  
  /** ID of parent task for subtasks (optional) */
  parent_task_id: ID | null;
  
  /** Parent task data (populated in queries) */
  parent_task: ParentTask | null;
  
  /** Whether task is pinned for priority display */
  pinned: boolean;
  
  /** Estimated hours to complete (optional) */
  estimated_hours?: number;
  
  /** Actual hours spent (optional) */
  actual_hours?: number;
  
  /** Completion percentage (0-100, optional) */
  completion_percentage?: number;
  
  /** Array of tags for categorization (optional) */
  tags?: string[];
  
  /** Timestamp when created (managed by database) */
  created_at: Timestamp;
  
  /** Timestamp when last updated (managed by database) */
  updated_at: Timestamp;
}

/**
 * Task Status Values
 * 
 * Defines the possible states a task can be in during its lifecycle.
 * 
 * @type
 * @category Enums
 * 
 * @example
 * ```typescript
 * const task: Task = {
 *   // ...other fields
 *   status: 'pending' // Type-safe status assignment
 * };
 * 
 * // Type-safe status checking
 * if (task.status === 'complete') {
 *   console.log('Task is done!');
 * }
 * ```
 */
export type TaskStatus = 
  | 'pending'   // Task is not yet started
  | 'complete'  // Task has been finished
  | 'overdue';  // Task is past its due date

/**
 * Task Priority Levels
 * 
 * Defines the importance/urgency levels for task prioritization.
 * 
 * @type
 * @category Enums
 */
export type TaskPriority = 
  | 'low'     // Low priority, can be done later
  | 'medium'  // Normal priority (default)
  | 'high'    // High priority, should be done soon
  | 'urgent'; // Critical priority, needs immediate attention
```

## Documentation Tools

### VSCode Extensions
- **TypeScript Importer**: Auto-import type definitions
- **JSDoc Generator**: Generate JSDoc templates
- **Document This**: Auto-generate documentation
- **Better Comments**: Highlight TODO, FIXME, etc.

### Automated Documentation
```bash
# Generate API documentation
npm run docs:generate

# Serve documentation locally
npm run docs:serve

# Validate documentation coverage
npm run docs:validate
```

### Documentation Linting
```json
// .eslintrc.json
{
  "plugins": ["jsdoc"],
  "rules": {
    "jsdoc/require-description": "error",
    "jsdoc/require-param": "error",
    "jsdoc/require-returns": "error",
    "jsdoc/require-example": "warn"
  }
}
```

### Documentation Quality Checklist

#### Component Documentation
- [ ] Clear description of purpose and functionality
- [ ] Complete prop documentation with types
- [ ] Usage examples (basic and advanced)
- [ ] Accessibility considerations
- [ ] Performance notes
- [ ] Related components/hooks referenced

#### Hook Documentation  
- [ ] Clear description of hook's purpose
- [ ] Parameter documentation with types
- [ ] Return value documentation
- [ ] Usage examples
- [ ] Error handling information
- [ ] Performance considerations

#### Utility Documentation
- [ ] Clear function description
- [ ] Parameter and return type documentation
- [ ] Usage examples
- [ ] Error cases documented
- [ ] Performance/complexity notes
- [ ] Related utilities referenced

## Benefits of Good Documentation

1. **Developer Onboarding**: New team members can understand components quickly
2. **API Discoverability**: IntelliSense shows rich information about functions
3. **Consistency**: Standardized patterns across the codebase
4. **Maintenance**: Easier to modify code when behavior is clearly documented
5. **Testing**: Examples provide test cases and usage patterns
6. **Refactoring**: Understanding dependencies makes refactoring safer 